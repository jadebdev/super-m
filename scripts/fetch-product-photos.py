"""Download product photos listed in scripts/product-photos.txt into public/products/."""
import io
import pathlib
import sys
import urllib.request

from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent
out = root / "public" / "products"
out.mkdir(parents=True, exist_ok=True)
failed = []
for line in (root / "scripts" / "product-photos.txt").read_text().splitlines():
    if not line.strip() or line.startswith("#"):
        continue
    pid, url = line.split()
    try:
        data = urllib.request.urlopen(url, timeout=60).read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img.thumbnail((600, 600))
        img.save(out / f"{pid}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
        print("ok", pid)
    except Exception as e:  # keep going; report at the end
        failed.append(pid)
        print("FAILED", pid, e)
if failed:
    sys.exit(f"{len(failed)} photos failed: {', '.join(failed)}")
