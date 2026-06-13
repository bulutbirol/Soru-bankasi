"""Build the SMMM qualification PDF catalog from the public source page."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
import re
from pathlib import Path
from urllib.parse import urljoin
from urllib.request import Request, urlopen


SOURCE_PAGE = "https://aktifonline.net/smmmyeterliliksinavsorucevap.htm"
SOURCE_ORIGIN = "https://aktifonline.net/"


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def slugify(value: str) -> str:
    translation = str.maketrans("çğıöşüÇĞİÖŞÜ", "cgiosuCGIOSU")
    return re.sub(r"[^a-z0-9]+", "-", value.translate(translation).lower()).strip("-")


def normalize_lesson(value: str) -> str:
    value = clean_text(value.replace("Aç", ""))
    if "•" in value:
        value = value.split("•", 1)[1].strip()
    aliases = {
        "Finansal": "Finansal Muhasebe",
        "Maliyet": "Maliyet Muhasebesi",
        "Analiz": "Finansal Tablolar Analizi",
        "Finansal (TESMER)": "Finansal Muhasebe",
        "Maliyet (TESMER)": "Maliyet Muhasebesi",
        "Analiz (TESMER)": "Finansal Tablolar Analizi",
    }
    return aliases.get(value, value)


def normalize_pdf_url(href: str, year: int, period: int) -> str:
    absolute = urljoin(SOURCE_ORIGIN, href)
    if "aktifonline.net/" not in absolute:
        return absolute
    return re.sub(
        r"(smmm-yeterlilik-sinavi-)\d{4,5}-\d(-)",
        rf"\g<1>{year}-{period}\2",
        absolute,
        count=1,
    )


class CatalogParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.records: list[dict] = []
        self.current_heading = ""
        self.current_period: tuple[int, int] | None = None
        self.pending_period: tuple[int, int] | None = None
        self.heading_buffer: list[str] = []
        self.link_buffer: list[str] = []
        self.current_href = ""
        self.in_heading = False
        self.in_pdf_link = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        classes = set((attributes.get("class") or "").split())
        if tag == "button" and "acc-head" in classes:
            self.current_period = self.pending_period
            self.pending_period = None
            self.in_heading = True
            self.heading_buffer = []
        if tag == "a" and "pdf-link" in classes:
            self.in_pdf_link = True
            self.link_buffer = []
            self.current_href = attributes.get("href") or ""

    def handle_data(self, data: str) -> None:
        if self.in_heading:
            self.heading_buffer.append(data)
        if self.in_pdf_link:
            self.link_buffer.append(data)

    def handle_comment(self, data: str) -> None:
        match = re.fullmatch(r"\s*(20\d{2})/(\d)\s*", data)
        if match:
            self.pending_period = tuple(map(int, match.groups()))

    def handle_endtag(self, tag: str) -> None:
        if tag == "button" and self.in_heading:
            self.current_heading = clean_text("".join(self.heading_buffer))
            self.in_heading = False
        if tag == "a" and self.in_pdf_link:
            self._append_record()
            self.in_pdf_link = False

    def _append_record(self) -> None:
        link_text = clean_text("".join(self.link_buffer))
        heading_match = re.search(r"(20\d{2})/(\d)", self.current_heading)
        href_match = re.search(r"sinavi-(20\d{2,3})-(\d)-", self.current_href)
        text_match = re.search(r"(20\d{2})/(\d)", link_text)

        if self.current_period:
            year, period = self.current_period
        elif heading_match:
            year, period = map(int, heading_match.groups())
        elif text_match:
            year, period = map(int, text_match.groups())
        elif href_match:
            raw_year, raw_period = href_match.groups()
            year = int(raw_year[:4])
            period = int(raw_period)
        else:
            return

        lesson = normalize_lesson(link_text)
        exam_id = f"qualification-{year}-{period}"
        self.records.append(
            {
                "id": f"{exam_id}-{slugify(lesson)}",
                "examId": exam_id,
                "year": year,
                "period": period,
                "label": f"{year}/{period} • SMMM Yeterlilik",
                "lesson": lesson,
                "sourceUrl": normalize_pdf_url(self.current_href, year, period),
                "sourcePage": SOURCE_PAGE,
                "available": True,
                "contentStatus": "catalog_only",
                "questionCount": 0,
            }
        )


def parse_catalog_html(html: str) -> list[dict]:
    parser = CatalogParser()
    parser.feed(html)
    unique = {}
    for record in parser.records:
        unique[record["id"]] = record
    return list(unique.values())


def is_pdf_available(url: str) -> bool:
    request = Request(
        url,
        headers={
            "Range": "bytes=0-16",
            "User-Agent": "Mozilla/5.0 SMMM-Soru-Bankasi-Catalog/1.0",
        },
    )
    for _attempt in range(3):
        try:
            with urlopen(request, timeout=20) as response:
                content_type = response.headers.get("Content-Type", "").lower()
                return response.status in (200, 206) and "pdf" in content_type
        except Exception:
            continue
    return False


def verify_availability(records: list[dict]) -> list[dict]:
    with ThreadPoolExecutor(max_workers=12) as executor:
        availability = executor.map(is_pdf_available, (record["sourceUrl"] for record in records))
    for record, available in zip(records, availability):
        record["available"] = available
    return records


def fetch_source_html() -> str:
    request = Request(SOURCE_PAGE, headers={"User-Agent": "Mozilla/5.0 SMMM-Soru-Bankasi/1.0"})
    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", type=Path)
    parser.add_argument("--skip-check", action="store_true")
    args = parser.parse_args()

    records = parse_catalog_html(fetch_source_html())
    if not args.skip_check:
        records = verify_availability(records)
    records.sort(key=lambda item: (-item["year"], -item["period"], item["lesson"]))

    payload = {
        "sourcePage": SOURCE_PAGE,
        "documents": records,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(
        f"Cataloged {len(records)} documents "
        f"({sum(record['available'] for record in records)} available)."
    )


if __name__ == "__main__":
    main()
