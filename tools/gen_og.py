"""Generate the 1200x630 Open Graph image (public/og-image.png).

Run from the repo root with Pillow installed:

    python3 tools/gen_og.py
"""
import os

from PIL import Image, ImageDraw, ImageFont

from gen_icons import BLUE, NAVY, ROOT, WHITE, draw_gauge

W, H = 1200, 630


def font(size, bold=True):
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        if bold
        else "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()


def main():
    img = Image.new("RGBA", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    gauge = draw_gauge(380, content_scale=1.0)
    img.paste(gauge, (70, (H - 380) // 2), gauge)

    sub_font = font(28, bold=False)
    brand_font = font(34)

    tx = 70 + 380 + 60
    max_w = W - tx - 50

    def fit_font(text, start_size):
        size = start_size
        while size > 20:
            f = font(size)
            bbox = draw.textbbox((0, 0), text, font=f)
            if bbox[2] - bbox[0] <= max_w:
                return f
            size -= 2
        return font(20)

    line1, line2 = "Static Pressure", "Calculator"
    draw.text((tx, 175), line1, font=fit_font(line1, 50), fill=WHITE)
    draw.text((tx, 245), line2, font=fit_font(line2, 50), fill=WHITE)
    draw.text((tx, 325), "Free ESP calculator", font=sub_font, fill=(148, 163, 184, 255))
    draw.text((tx, 362), "for HVAC technicians", font=sub_font, fill=(148, 163, 184, 255))
    draw.text((tx, 500), "hvacnumbers.com", font=brand_font, fill=BLUE)

    out = os.path.join(ROOT, "public", "og-image.png")
    img.convert("RGB").save(out)
    print("wrote", out)


if __name__ == "__main__":
    main()
