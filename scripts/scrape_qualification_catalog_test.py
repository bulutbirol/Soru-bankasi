import unittest
from unittest.mock import patch

from scripts.scrape_qualification_catalog import (
    is_pdf_available,
    normalize_pdf_url,
    parse_catalog_html,
)


HTML_FIXTURE = """
<div class="acc-item open">
  <button class="acc-head" type="button">
    <span>2026/1 • SMMM Yeterlilik</span>
  </button>
  <div class="acc-body">
    <a class="pdf-link" href="smmm-yeterlilik-sinavi-2026-1-finansal-muhasebe.pdf">
      <span class="pdf-left">Finansal Muhasebe</span>
    </a>
    <a class="pdf-link" href="smmm-yeterlilik-sinavi-2026-1-vergi-mevzuati.pdf">
      <span class="pdf-left">Vergi Hukuku</span>
    </a>
  </div>
</div>
"""


class QualificationCatalogTest(unittest.TestCase):
    def test_parses_period_and_lessons(self):
        records = parse_catalog_html(HTML_FIXTURE)

        self.assertEqual(len(records), 2)
        self.assertEqual(records[0]["examId"], "qualification-2026-1")
        self.assertEqual(records[0]["year"], 2026)
        self.assertEqual(records[0]["period"], 1)
        self.assertEqual(records[0]["lesson"], "Finansal Muhasebe")
        self.assertEqual(records[1]["lesson"], "Vergi Hukuku")

    def test_repairs_known_year_typo_in_pdf_url(self):
        repaired = normalize_pdf_url(
            "smmm-yeterlilik-sinavi-20202-3-vergi-mevzuati.pdf",
            year=2022,
            period=3,
        )

        self.assertEqual(
            repaired,
            "https://aktifonline.net/smmm-yeterlilik-sinavi-2022-3-vergi-mevzuati.pdf",
        )

    def test_uses_stable_unique_document_ids(self):
        records = parse_catalog_html(HTML_FIXTURE)

        self.assertEqual(
            [record["id"] for record in records],
            [
                "qualification-2026-1-finansal-muhasebe",
                "qualification-2026-1-vergi-hukuku",
            ],
        )

    def test_uses_period_comment_when_heading_contains_only_a_date(self):
        records = parse_catalog_html("""
        <!-- 2025/1 -->
        <div class="acc-item">
          <button class="acc-head">12-13 Nisan 2025 • SMMM Yeterlilik</button>
          <a class="pdf-link" href="smmm-yeterlilik-sinavi-2024-1-spk-mevzuati.pdf">
            Sermaye Piyasası Mevzuatı
          </a>
        </div>
        """)

        self.assertEqual(records[0]["examId"], "qualification-2025-1")
        self.assertIn("smmm-yeterlilik-sinavi-2025-1-spk-mevzuati.pdf", records[0]["sourceUrl"])

    def test_retries_transient_pdf_check_failures(self):
        class Response:
            status = 200
            headers = {"Content-Type": "application/pdf"}

            def __enter__(self):
                return self

            def __exit__(self, *_args):
                return False

        with patch(
            "scripts.scrape_qualification_catalog.urlopen",
            side_effect=[TimeoutError(), Response()],
        ) as mocked_open:
            self.assertTrue(is_pdf_available("https://example.com/file.pdf"))
            self.assertEqual(mocked_open.call_count, 2)


if __name__ == "__main__":
    unittest.main()
