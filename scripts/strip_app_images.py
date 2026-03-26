#!/usr/bin/env python3
"""Re-save assets/images/app/*.jpg without EXIF (clean JPEG). Requires Pillow."""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "assets" / "images" / "app"


def main() -> None:
    for path in sorted(APP.glob("*.jpg")):
        img = Image.open(path).convert("RGB")
        img.save(path, format="JPEG", quality=88, optimize=True)
        print(path.name)


if __name__ == "__main__":
    main()
