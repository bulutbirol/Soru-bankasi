"""Import user-supplied SGS PDFs into the app's JSON question format.

Requires PyMuPDF. Correct answers are detected from pure red option text.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
from typing import Iterable

import fitz
from PIL import Image, ImageChops


RED = 0xFF0000
QUESTION_COUNT = 130
RENDER_SCALE = 3.4
WEBP_QUALITY = 88
COLUMN_WIDTH = 265
QUESTION_TOP_PADDING = 14
MONTHS = {
    "OCAK": 1,
    "ŞUBAT": 2,
    "MART": 3,
    "NİSAN": 4,
    "MAYIS": 5,
    "HAZİRAN": 6,
    "TEMMUZ": 7,
    "AĞUSTOS": 8,
    "EYLÜL": 9,
    "EKİM": 10,
    "KASIM": 11,
    "ARALIK": 12,
}
MONTH_DISPLAY = {
    "OCAK": "Ocak",
    "ŞUBAT": "Şubat",
    "MART": "Mart",
    "NİSAN": "Nisan",
    "MAYIS": "Mayıs",
    "HAZİRAN": "Haziran",
    "TEMMUZ": "Temmuz",
    "AĞUSTOS": "Ağustos",
    "EYLÜL": "Eylül",
    "EKİM": "Ekim",
    "KASIM": "Kasım",
    "ARALIK": "Aralık",
}
MOJIBAKE_TRANSLATION = str.maketrans(
    {
        "Ý": "İ",
        "ý": "ı",
        "Þ": "Ş",
        "þ": "ş",
        "Ð": "Ğ",
        "ð": "ğ",
    }
)
IGNORED_LINES = {
    "TÜRMOB-TESMER STAJA GİRİŞ SINAVI",
    "GENEL KÜLTÜR VE GENEL YETENEK",
    "YABANCI DİL",
    "ALAN BİLGİSİ",
    "TEST BİTTİ. CEVAPLARINIZI KONTROL EDİNİZ.",
}


def repair_text(value: str) -> str:
    return value.translate(MOJIBAKE_TRANSLATION).replace("\uf0b7", "•")


def detect_answer(options: list[dict]) -> int:
    red_indexes = [index for index, option in enumerate(options) if option["is_red"]]
    if len(red_indexes) != 1:
        raise ValueError(f"Expected exactly one red option, found {len(red_indexes)}")
    return red_indexes[0]


def append_text(chars: list[str], colors: list[bool], text: str, is_red: bool) -> None:
    text = repair_text(text)
    chars.extend(text)
    colors.extend([is_red] * len(text))


def extract_annotated_stream(document: fitz.Document) -> tuple[str, list[bool]]:
    chars: list[str] = []
    colors: list[bool] = []

    # Question pages are 2-21 in the supplied 23-page booklets.
    for page in document[1:21]:
        columns: list[list[tuple[float, list[dict]]]] = [[], []]
        for block in page.get_text("dict", sort=True)["blocks"]:
            for line in block.get("lines", []):
                x0, y0, x1, y1 = line["bbox"]
                if y0 < 54 or y1 > 792:
                    continue
                if x0 < 290 < x1:
                    continue

                spans = [span for span in line["spans"] if span["text"]]
                if not spans:
                    continue
                line_text = repair_text("".join(span["text"] for span in spans)).strip()
                if not line_text or line_text in IGNORED_LINES:
                    continue
                column = 0 if x0 < 290 else 1
                columns[column].append((y0, spans))

        for column in columns:
            for _, spans in sorted(column, key=lambda item: item[0]):
                for span in spans:
                    text = repair_text(span["text"])
                    # Force structural markers onto a fresh line, including
                    # horizontally arranged answer options.
                    text = re.sub(r"(?<!\n)(?<![A-Za-zÇĞİÖŞÜçğıöşü])([A-E]\))", r"\n\1", text)
                    text = re.sub(r"(?<!\n)(?<!\d)(\d{1,3}\.\s)", r"\n\1", text)
                    append_text(chars, colors, text, span["color"] == RED)
                append_text(chars, colors, "\n", False)

    return "".join(chars), colors


def find_question_boundaries(text: str) -> list[tuple[int, int]]:
    starts: list[int] = []
    cursor = 0
    for number in range(1, QUESTION_COUNT + 1):
        pattern = re.compile(rf"(?m)^\s*{number}\.\s+")
        match = pattern.search(text, cursor)
        if not match:
            raise ValueError(f"Question {number} start not found")
        starts.append(match.start())
        cursor = match.end()
    return [
        (start, starts[index + 1] if index + 1 < len(starts) else len(text))
        for index, start in enumerate(starts)
    ]


def clean_fragment(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def parse_question_segment(segment: str, red_flags: list[bool], number: int) -> dict:
    prefix = re.compile(rf"(?m)^\s*{number}\.\s+").search(segment)
    if not prefix:
        raise ValueError(f"Question {number} prefix missing")

    option_matches = []
    cursor = prefix.end()
    for letter in "ABCDE":
        match = re.compile(rf"(?m)^\s*{letter}\)\s*").search(segment, cursor)
        if not match:
            raise ValueError(f"Question {number}: option {letter} missing")
        option_matches.append(match)
        cursor = match.end()

    question_text = clean_fragment(segment[prefix.end() : option_matches[0].start()])
    options = []
    for index, match in enumerate(option_matches):
        end = option_matches[index + 1].start() if index < 4 else len(segment)
        option_text = clean_fragment(segment[match.end() : end])
        options.append(
            {
                "text": option_text,
                "is_red": any(
                    is_red and not character.isspace()
                    for character, is_red in zip(
                        segment[match.start() : end],
                        red_flags[match.start() : end],
                    )
                ),
            }
        )

    if not question_text:
        raise ValueError(f"Question {number}: question text is empty")
    if any(not option["text"] for option in options):
        raise ValueError(f"Question {number}: one or more options are empty")

    return {
        "number": number,
        "question": question_text,
        "options": [option["text"] for option in options],
        "answer": detect_answer(options),
    }


def parse_exam_date(document: fitz.Document) -> tuple[int, int, int, str]:
    cover = repair_text(document[0].get_text()).upper()
    match = re.search(
        r"(\d{1,2})\s+(" + "|".join(MONTHS) + r")\s+(20\d{2})\s*-\s*SAAT",
        cover,
    )
    if not match:
        raise ValueError("Exam date not found on cover")
    day = int(match.group(1))
    month_name = match.group(2)
    year = int(match.group(3))
    display = f"{day:02d} {MONTH_DISPLAY[month_name]} {year}"
    return year, MONTHS[month_name], day, display


def locate_questions(document: fitz.Document) -> list[dict]:
    locations = []
    expected = 1
    for page_index in range(1, 21):
        page = document[page_index]
        lines = []
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                x0, y0, x1, _ = line["bbox"]
                if x0 < 290 < x1:
                    continue
                text = repair_text("".join(span["text"] for span in line["spans"])).strip()
                column = 0 if x0 < 290 else 1
                lines.append((column, y0, text))

        for column in (0, 1):
            column_lines = sorted(
                (line for line in lines if line[0] == column),
                key=lambda line: line[1],
            )
            for _, y0, text in column_lines:
                if re.match(rf"^{expected}\.(?:\s+|$)", text):
                    locations.append(
                        {
                            "number": expected,
                            "page": page_index,
                            "column": column,
                            "top": y0,
                        }
                    )
                    expected += 1

    if len(locations) != QUESTION_COUNT:
        raise ValueError(f"Expected {QUESTION_COUNT} question locations, found {len(locations)}")

    for index, location in enumerate(locations):
        following = next(
            (
                candidate
                for candidate in locations[index + 1 :]
                if candidate["page"] == location["page"]
                and candidate["column"] == location["column"]
            ),
            None,
        )
        location["bottom"] = following["top"] - 2 if following else 790
    return locations


def answer_from_location(document: fitz.Document, location: dict) -> int:
    red_text = []
    for block in document[location["page"]].get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            x0, y0, x1, y1 = line["bbox"]
            column = 0 if x0 < 290 else 1
            if x0 < 290 < x1 or column != location["column"]:
                continue
            if y0 < location["top"] - 2 or y1 > location["bottom"] + 2:
                continue
            red_text.extend(
                repair_text(span["text"])
                for span in line["spans"]
                if span["color"] == RED and span["text"].strip()
            )

    letters = set(re.findall(r"(?:^|\s)([A-E])\)(?:\s|$)", " ".join(red_text)))
    if len(letters) != 1:
        raise ValueError(
            f"Question {location['number']}: expected one red option letter, found {sorted(letters)}"
        )
    return "ABCDE".index(letters.pop())


def hide_red_text(image: Image.Image) -> Image.Image:
    red, green, blue = image.convert("RGB").split()
    red_mask = red.point(lambda value: 255 if value > 130 else 0)
    green_mask = green.point(lambda value: 255 if value < 190 else 0)
    blue_mask = blue.point(lambda value: 255 if value < 190 else 0)
    mask = ImageChops.multiply(ImageChops.multiply(red_mask, green_mask), blue_mask)
    image = image.convert("RGB")
    image.paste((0, 0, 0), mask=mask)
    return image


def question_image_width(scale: float) -> int:
    return round(COLUMN_WIDTH * scale)


def question_crop_top(question_top: float) -> float:
    return max(52, question_top - QUESTION_TOP_PADDING)


def render_question_images(
    document: fitz.Document,
    locations: list[dict],
    exam_id: str,
    image_output: Path,
) -> dict[int, str]:
    image_output.mkdir(parents=True, exist_ok=True)
    paths = {}
    scale = RENDER_SCALE

    for page_index in sorted({location["page"] for location in locations}):
        page = document[page_index]
        pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        page_image = hide_red_text(
            Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        )
        for location in (item for item in locations if item["page"] == page_index):
            left, right = (25, 290) if location["column"] == 0 else (305, 570)
            box = (
                round(left * scale),
                round(question_crop_top(location["top"]) * scale),
                round(right * scale),
                round(min(790, location["bottom"]) * scale),
            )
            question_image = page_image.crop(box)
            filename = f"{exam_id}-{location['number']:03d}.webp"
            question_image.save(
                image_output / filename,
                "WEBP",
                quality=WEBP_QUALITY,
                method=6,
            )
            paths[location["number"]] = f"/sgs/questions/{filename}"
    return paths


def category_for(number: int) -> tuple[str, str]:
    if number <= 20:
        return "Genel Kültür ve Genel Yetenek", "Genel Kültür ve Genel Yetenek"
    if number <= 30:
        return "Yabancı Dil", "İngilizce"
    return "Alan Bilgisi", "Alan Bilgisi"


def import_pdf(path: Path, image_output: Path) -> tuple[dict, list[dict]]:
    raw = path.read_bytes()
    source_hash = hashlib.sha256(raw).hexdigest()
    document = fitz.open(stream=raw, filetype="pdf")
    year, month, day, display_date = parse_exam_date(document)
    exam_id = f"sgs-{year}-{month:02d}-{day:02d}"
    locations = locate_questions(document)
    image_paths = render_question_images(document, locations, exam_id, image_output)
    questions = []

    for location in locations:
        index = location["number"]
        try:
            answer = answer_from_location(document, location)
        except ValueError as error:
            raise ValueError(f"{path.name}, question {index}: {error}") from error
        category, topic = category_for(index)
        questions.append(
            {
                "id": f"{exam_id}-{index:03d}",
                "exam": "SGS",
                "sourceType": "past_exam",
                "year": year,
                "period": display_date,
                "examId": exam_id,
                "sourceFile": path.name,
                "sourceHash": source_hash,
                "category": category,
                "topic": topic,
                "difficulty": "medium",
                "question": f"{display_date} SGS - Soru {index}",
                "questionImage": image_paths[index],
                "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği", "E seçeneği"],
                "answer": answer,
                "explanation": "Doğru seçenek kaynak PDF'de kırmızı olarak işaretlenmiştir.",
            }
        )

    metadata = {
        "id": exam_id,
        "year": year,
        "date": display_date,
        "sourceFile": path.name,
        "sourceHash": source_hash,
        "questionCount": len(questions),
    }
    return metadata, questions


def import_unique_pdfs(
    paths: Iterable[Path],
    image_output: Path,
) -> tuple[list[dict], list[dict], list[dict]]:
    exams = []
    questions = []
    duplicates = []
    grouped: dict[str, list[Path]] = {}
    for path in paths:
        source_hash = hashlib.sha256(path.read_bytes()).hexdigest()
        grouped.setdefault(source_hash, []).append(path)

    for source_hash, candidates in grouped.items():
        def source_name_score(candidate: Path) -> int:
            document = fitz.open(candidate)
            year, _, day, display = parse_exam_date(document)
            normalized_name = candidate.stem.lower().replace("_", " ")
            month_name = display.split()[1].lower()
            return (
                (3 if str(year) in normalized_name else 0)
                + (2 if str(day) in normalized_name else 0)
                + (1 if month_name in normalized_name else 0)
            )

        path = max(candidates, key=source_name_score)
        duplicates.extend(
            {"sourceFile": candidate.name, "sourceHash": source_hash}
            for candidate in candidates
            if candidate != path
        )
        metadata, imported = import_pdf(path, image_output)
        exams.append(metadata)
        questions.extend(imported)

    exams.sort(key=lambda exam: exam["id"], reverse=True)
    questions.sort(key=lambda question: (question["examId"], question["id"]), reverse=True)
    return exams, questions, duplicates


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source_dir", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--metadata-output", type=Path)
    parser.add_argument(
        "--image-output",
        type=Path,
        default=Path("public/sgs/questions"),
    )
    args = parser.parse_args()

    paths = list(args.source_dir.glob("*staja-giris-sinav-sorulari.pdf"))
    exams, questions, duplicates = import_unique_pdfs(paths, args.image_output)
    if not paths:
        raise SystemExit("No SGS PDF files found")
    if any(exam["questionCount"] != QUESTION_COUNT for exam in exams):
        raise SystemExit("One or more exams do not contain 130 valid questions")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(questions, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    if args.metadata_output:
        args.metadata_output.write_text(
            json.dumps(
                {"exams": exams, "duplicates": duplicates},
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )

    print(
        f"Imported {len(questions)} questions from {len(exams)} unique exams; "
        f"skipped {len(duplicates)} duplicate files."
    )


if __name__ == "__main__":
    main()
