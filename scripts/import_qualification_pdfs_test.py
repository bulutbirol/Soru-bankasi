import tempfile
import unittest
from pathlib import Path

import fitz

from scripts.import_qualification_pdfs import import_document


class QualificationPdfImporterTest(unittest.TestCase):
    def test_imports_manifest_page_pairs_as_written_questions(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            pdf_path = root / "sample.pdf"
            document = fitz.open()
            for text in ("Question page", "Answer page"):
                page = document.new_page()
                page.insert_text((72, 72), text)
            document.save(pdf_path)
            document.close()

            metadata = {
                "documentId": "qualification-2026-1-finansal-muhasebe",
                "examId": "qualification-2026-1",
                "year": 2026,
                "period": 1,
                "lesson": "Finansal Muhasebe",
                "pairs": [{"questionPages": [1], "answerPages": [2]}],
            }

            records = import_document(pdf_path, metadata, root / "images")

            self.assertEqual(len(records), 1)
            self.assertEqual(records[0]["type"], "written")
            self.assertEqual(records[0]["sourcePage"], 1)
            self.assertTrue((root / "images" / "qualification-2026-1-finansal-muhasebe-001-question.webp").exists())
            self.assertTrue((root / "images" / "qualification-2026-1-finansal-muhasebe-001-answer.webp").exists())

    def test_requires_explicit_page_pairs(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            pdf_path = root / "sample.pdf"
            document = fitz.open()
            document.new_page()
            document.save(pdf_path)
            document.close()

            with self.assertRaisesRegex(ValueError, "manual review"):
                import_document(pdf_path, {
                    "documentId": "qualification-2026-1-hukuk",
                    "examId": "qualification-2026-1",
                    "year": 2026,
                    "period": 1,
                    "lesson": "Hukuk",
                }, root / "images")


if __name__ == "__main__":
    unittest.main()
