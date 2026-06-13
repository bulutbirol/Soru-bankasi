"""Import authorized SMMM qualification PDFs using reviewed page mappings.

The importer never guesses question boundaries. Each manifest entry must provide
explicit question/answer page pairs so incomplete content cannot be published
silently.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import fitz
from PIL import Image


RENDER_SCALE = 2.4
WEBP_QUALITY = 88


def file_hash(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def render_pages(document: fitz.Document, pages: list[int], output_path: Path) -> None:
    rendered = []
    matrix = fitz.Matrix(RENDER_SCALE, RENDER_SCALE)
    for page_number in pages:
        if page_number < 1 or page_number > document.page_count:
            raise ValueError(f"Page {page_number} is outside the PDF page range")
        pixmap = document[page_number - 1].get_pixmap(matrix=matrix, alpha=False)
        rendered.append(Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples))

    width = max(image.width for image in rendered)
    height = sum(image.height for image in rendered)
    combined = Image.new("RGB", (width, height), "white")
    top = 0
    for image in rendered:
        combined.paste(image, (0, top))
        top += image.height

    output_path.parent.mkdir(parents=True, exist_ok=True)
    combined.save(output_path, "WEBP", quality=WEBP_QUALITY, method=6)


def import_document(pdf_path: Path, metadata: dict, image_output: Path) -> list[dict]:
    pairs = metadata.get("pairs")
    if not pairs:
        raise ValueError(f"{pdf_path.name}: manual review required; no page pairs supplied")

    required = ("documentId", "examId", "year", "period", "lesson")
    missing = [field for field in required if not metadata.get(field)]
    if missing:
        raise ValueError(f"{pdf_path.name}: missing metadata fields: {', '.join(missing)}")

    source_hash = file_hash(pdf_path)
    records = []
    with fitz.open(pdf_path) as document:
        for index, pair in enumerate(pairs, start=1):
            question_pages = pair.get("questionPages") or []
            answer_pages = pair.get("answerPages") or []
            if not question_pages or not answer_pages:
                raise ValueError(
                    f"{pdf_path.name}: pair {index} requires questionPages and answerPages"
                )

            record_id = f"{metadata['documentId']}-{index:03d}"
            question_name = f"{record_id}-question.webp"
            answer_name = f"{record_id}-answer.webp"
            render_pages(document, question_pages, image_output / question_name)
            render_pages(document, answer_pages, image_output / answer_name)

            records.append(
                {
                    "id": record_id,
                    "exam": "SMMM Yeterlilik",
                    "type": "written",
                    "sourceType": "qualification_exam",
                    "examId": metadata["examId"],
                    "documentId": metadata["documentId"],
                    "year": metadata["year"],
                    "period": metadata["period"],
                    "lesson": metadata["lesson"],
                    "question": pair.get(
                        "questionTitle",
                        f"{metadata['lesson']} klasik soru {index}",
                    ),
                    "questionImage": f"/qualification/questions/{question_name}",
                    "answerText": pair.get("answerText", ""),
                    "answerImage": f"/qualification/questions/{answer_name}",
                    "sourceFile": pdf_path.name,
                    "sourceHash": source_hash,
                    "sourcePage": question_pages[0],
                }
            )

    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf_directory", type=Path)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument(
        "--image-output",
        type=Path,
        default=Path("public/qualification/questions"),
    )
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
    records = []
    report = {"imported": [], "requiresReview": []}

    for metadata in manifest.get("documents", []):
        pdf_path = args.pdf_directory / metadata["file"]
        try:
            imported = import_document(pdf_path, metadata, args.image_output)
            records.extend(imported)
            report["imported"].append(
                {"documentId": metadata["documentId"], "questionCount": len(imported)}
            )
        except (FileNotFoundError, ValueError) as error:
            report["requiresReview"].append(
                {"documentId": metadata.get("documentId"), "reason": str(error)}
            )

    ids = [record["id"] for record in records]
    if len(ids) != len(set(ids)):
        raise ValueError("Duplicate qualification question IDs detected")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(
            json.dumps(report, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )

    print(
        f"Imported {len(records)} written questions; "
        f"{len(report['requiresReview'])} documents require review."
    )


if __name__ == "__main__":
    main()
