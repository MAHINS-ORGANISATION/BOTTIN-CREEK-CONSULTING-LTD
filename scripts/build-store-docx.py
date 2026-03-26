#!/usr/bin/env python3
"""Build a styled Pandoc reference.docx and convert store/*.md to .docx."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from docx import Document
from docx.enum.text import WD_LINE_SPACING
from docx.shared import Pt, RGBColor

ROOT = Path(__file__).resolve().parent.parent
STORE = ROOT / "store"
REF_IN = STORE / "_reference.docx"
REF_OUT = STORE / "BottinConsult_word_reference.docx"

NAVY = RGBColor(0x0A, 0x16, 0x28)
BRASS = RGBColor(0x9A, 0x7B, 0x3C)


def style_reference() -> None:
    if not REF_IN.exists():
        subprocess.run(
            ["pandoc", "-o", str(REF_IN), "--print-default-data-file", "reference.docx"],
            cwd=str(STORE),
            check=True,
        )
    doc = Document(str(REF_IN))
    body_font = "Calibri"

    for name, size, bold, color, space_after in (
        ("Normal", 11, False, None, Pt(6)),
        ("Heading 1", 20, True, NAVY, Pt(12)),
        ("Heading 2", 14, True, NAVY, Pt(8)),
        ("Heading 3", 12, True, BRASS, Pt(6)),
        ("First Paragraph", 11, False, None, Pt(6)),
    ):
        try:
            st = doc.styles[name]
        except KeyError:
            continue
        st.font.name = body_font
        st.font.size = Pt(size)
        st.font.bold = bold
        if color is not None:
            st.font.color.rgb = color
        pfmt = st.paragraph_format
        pfmt.space_after = space_after
        pfmt.line_spacing_rule = WD_LINE_SPACING.MULTIPLE
        pfmt.line_spacing = 1.15

    try:
        toc = doc.styles["TOC Heading"]
        toc.font.name = body_font
        toc.font.size = Pt(16)
        toc.font.bold = True
        toc.font.color.rgb = NAVY
    except KeyError:
        pass

    doc.save(str(REF_OUT))


def pandoc_one(md: Path, title: str) -> None:
    out = md.with_suffix(".docx")
    cmd = [
        "pandoc",
        str(md),
        "-o",
        str(out),
        "-f",
        "gfm",
        "--standalone",
        "--toc",
        "--toc-depth=3",
        f"--reference-doc={REF_OUT}",
        "-M",
        f"title={title}",
        "-M",
        "author=BOTTIN CREEK CONSULTING LTD",
        "-M",
        "lang=en-US",
    ]
    subprocess.run(cmd, check=True)


def main() -> None:
    style_reference()

    titles = {
        "BottinConsult_Google_Play_Data_Safety.md": "Bottin Consult — Google Play Data Safety (Guidance)",
        "BottinConsult_privacy_policy.md": "Bottin Consult — Privacy Policy",
        "BottinConsult_store_description.md": "Bottin Consult — Store Listing Copy",
        "BottinConsult_permissions.md": "Bottin Consult — Android Permissions",
        "BottinConsult_promotional_text.md": "Bottin Consult — Promotional Text",
        "BottinConsult_Google_Play_Console_Help_Answers.md": "Bottin Consult — Play Console Help (Draft Answers)",
    }

    for name, title in titles.items():
        md = STORE / name
        if not md.exists():
            print(f"skip missing: {md}", file=sys.stderr)
            continue
        pandoc_one(md, title)
        print(f"OK {md.name} -> {md.with_suffix('.docx').name}")

    if REF_IN.exists():
        REF_IN.unlink(missing_ok=True)


if __name__ == "__main__":
    main()
