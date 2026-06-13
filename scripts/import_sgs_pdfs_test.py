import importlib.util
from pathlib import Path
import unittest


MODULE_PATH = Path(__file__).with_name("import_sgs_pdfs.py")
SPEC = importlib.util.spec_from_file_location("import_sgs_pdfs", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class ImportSgsPdfsTest(unittest.TestCase):
    def test_question_images_are_rendered_for_full_width_displays(self):
        self.assertGreaterEqual(
            MODULE.question_image_width(MODULE.RENDER_SCALE),
            850,
        )

    def test_question_crop_keeps_formula_content_above_the_number_line(self):
        self.assertLessEqual(
            MODULE.question_crop_top(120),
            108,
        )

    def test_detects_exactly_one_red_option(self):
        options = [
            {"text": "A seçeneği", "is_red": False},
            {"text": "B seçeneği", "is_red": True},
            {"text": "C seçeneği", "is_red": False},
            {"text": "D seçeneği", "is_red": False},
            {"text": "E seçeneği", "is_red": False},
        ]

        self.assertEqual(MODULE.detect_answer(options), 1)

    def test_rejects_missing_or_multiple_red_options(self):
        with self.assertRaises(ValueError):
            MODULE.detect_answer([{"text": "A", "is_red": False}] * 5)

        with self.assertRaises(ValueError):
            MODULE.detect_answer(
                [
                    {"text": "A", "is_red": True},
                    {"text": "B", "is_red": True},
                    {"text": "C", "is_red": False},
                    {"text": "D", "is_red": False},
                    {"text": "E", "is_red": False},
                ]
            )


if __name__ == "__main__":
    unittest.main()
