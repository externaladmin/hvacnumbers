"""Generate the PWA icons and favicon for hvacnumbers.

Run from the repo root with Pillow installed (pip3 install --user Pillow):

    python3 tools/gen_icons.py

Writes public/icons/*.png and app/favicon.ico. The gauge glyph is drawn at 4x
and scaled down so the edges are anti-aliased.
"""
import math
import os

from PIL import Image, ImageDraw

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT_DIR = os.path.join(ROOT, "public", "icons")

NAVY = (15, 23, 42, 255)       # #0f172a
BLUE = (30, 64, 175, 255)      # #1e40af
WHITE = (255, 255, 255, 255)

SS = 4  # supersample factor for anti-aliasing


def draw_gauge(size, content_scale=1.0, bg=NAVY):
    """Draw a pressure-gauge glyph centred in a size x size canvas.

    content_scale below 1.0 keeps the glyph inside the maskable safe zone.
    """
    big = size * SS
    img = Image.new("RGBA", (big, big), bg)
    draw = ImageDraw.Draw(img)

    cx, cy = big / 2, big / 2
    r = big * 0.30 * content_scale

    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=WHITE)

    arc_r = r * 1.18
    arc_w = max(2, int(big * 0.022 * content_scale))
    draw.arc(
        [cx - arc_r, cy - arc_r, cx + arc_r, cy + arc_r],
        start=125,
        end=55,
        fill=BLUE,
        width=arc_w,
    )

    for deg in range(125, 56 + 360, 20):
        a = math.radians(deg % 360)
        inner = arc_r - arc_w * 1.8
        outer = arc_r + arc_w * 1.8
        x1, y1 = cx + inner * math.cos(a), cy + inner * math.sin(a)
        x2, y2 = cx + outer * math.cos(a), cy + outer * math.sin(a)
        draw.line([x1, y1, x2, y2], fill=BLUE, width=max(2, arc_w // 2))

    needle_angle = math.radians(-25)
    needle_len = r * 0.85
    nx = cx + needle_len * math.cos(needle_angle)
    ny = cy + needle_len * math.sin(needle_angle)
    draw.line([cx, cy, nx, ny], fill=BLUE, width=max(3, int(big * 0.018)))

    hub_r = big * 0.035 * content_scale
    draw.ellipse([cx - hub_r, cy - hub_r, cx + hub_r, cy + hub_r], fill=BLUE)

    return img.resize((size, size), Image.LANCZOS)


def rounded_mask(size, radius_ratio=0.22):
    big = size * SS
    mask = Image.new("L", (big, big), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, big, big], radius=int(big * radius_ratio), fill=255
    )
    return mask.resize((size, size), Image.LANCZOS)


def save_standard_icon(size, filename):
    img = draw_gauge(size, content_scale=1.0)
    rounded = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rounded.paste(img, (0, 0), rounded_mask(size))
    rounded.save(os.path.join(OUT_DIR, filename))
    print("wrote", filename, rounded.size)


def save_maskable_icon(size, filename):
    # Maskable icons fill the whole square (no rounding, no transparency) and
    # keep the glyph inside the roughly 80% safe-zone circle.
    img = draw_gauge(size, content_scale=0.72)
    img.save(os.path.join(OUT_DIR, filename))
    print("wrote", filename, img.size)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    save_standard_icon(192, "icon-192.png")
    save_standard_icon(512, "icon-512.png")
    save_standard_icon(180, "apple-touch-icon.png")
    save_standard_icon(32, "favicon-32.png")
    save_maskable_icon(512, "icon-maskable-512.png")

    favicon = Image.open(os.path.join(OUT_DIR, "favicon-32.png"))
    favicon.save(
        os.path.join(ROOT, "app", "favicon.ico"),
        sizes=[(16, 16), (32, 32), (48, 48)],
    )
    print("wrote app/favicon.ico")


if __name__ == "__main__":
    main()
