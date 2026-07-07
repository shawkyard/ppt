#!/usr/bin/env python3
"""Generate PromptShot app icons (PNG/ICO/ICNS) with no third-party deps.

Draws a rounded orange square with a white lightning bolt, then emits every
icon size Tauri references in tauri.conf.json. Run once from src-tauri/:

    python3 gen_icons.py
"""
import struct
import zlib
import os

OUT = os.path.join(os.path.dirname(__file__), "icons")
os.makedirs(OUT, exist_ok=True)

ORANGE = (249, 115, 22, 255)   # #F97316
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)

BOLT = [
    (580, 160), (360, 570), (505, 570),
    (445, 860), (700, 460), (548, 460), (610, 160),
]


def rounded_rect(x, y, w, h, r):
    def inside(px, py):
        if x + r <= px <= x + w - r and y <= py <= y + h:
            return True
        if x <= px <= x + w and y + r <= py <= y + h - r:
            return True
        for cx, cy in ((x + r, y + r), (x + w - r, y + r),
                       (x + r, y + h - r), (x + w - r, y + h - r)):
            if (px - cx) ** 2 + (py - cy) ** 2 <= r * r:
                return True
        return False
    return inside


def point_in_poly(px, py, poly):
    inside = False
    n = len(poly)
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > py) != (yj > py)) and \
           (px < (xj - xi) * (py - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside


def render(size):
    """Render the icon at `size`x`size` as a flat RGBA bytearray."""
    s = 1024
    px = bytearray(size * size * 4)
    rr = rounded_rect(64, 64, s - 128, s - 128, 200)
    scale = s / size
    for yy in range(size):
        for xx in range(size):
            # supersample 2x2 for smoother edges
            r = g = b = a = 0
            for sy in (0.25, 0.75):
                for sx in (0.25, 0.75):
                    fx = (xx + sx) * scale
                    fy = (yy + sy) * scale
                    if point_in_poly(fx, fy, BOLT) and rr(fx, fy):
                        cr, cg, cb, ca = WHITE
                    elif rr(fx, fy):
                        cr, cg, cb, ca = ORANGE
                    else:
                        cr, cg, cb, ca = TRANSPARENT
                    r += cr; g += cg; b += cb; a += ca
            idx = (yy * size + xx) * 4
            px[idx] = r // 4
            px[idx + 1] = g // 4
            px[idx + 2] = b // 4
            px[idx + 3] = a // 4
    return px


def png_bytes(size, px):
    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    raw = bytearray()
    for y in range(size):
        raw.append(0)  # filter type 0
        raw.extend(px[y * size * 4:(y + 1) * size * 4])
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw), 9)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


CACHE = {}


def get_png(size):
    if size not in CACHE:
        CACHE[size] = png_bytes(size, render(size))
    return CACHE[size]


def write_png(name, size):
    with open(os.path.join(OUT, name), "wb") as f:
        f.write(get_png(size))
    print("wrote", name)


def write_ico(name, sizes):
    imgs = [(sz, get_png(sz)) for sz in sizes]
    header = struct.pack("<HHH", 0, 1, len(imgs))
    offset = 6 + 16 * len(imgs)
    entries = b""
    data = b""
    for sz, png in imgs:
        w = sz if sz < 256 else 0
        entries += struct.pack("<BBBBHHII", w, w, 0, 0, 1, 32,
                               len(png), offset)
        data += png
        offset += len(png)
    with open(os.path.join(OUT, name), "wb") as f:
        f.write(header + entries + data)
    print("wrote", name)


def write_icns(name, entries):
    # entries: list of (ostype, size)
    body = b""
    for ostype, sz in entries:
        png = get_png(sz)
        body += ostype + struct.pack(">I", len(png) + 8) + png
    data = b"icns" + struct.pack(">I", len(body) + 8) + body
    with open(os.path.join(OUT, name), "wb") as f:
        f.write(data)
    print("wrote", name)


if __name__ == "__main__":
    write_png("32x32.png", 32)
    write_png("128x128.png", 128)
    write_png("128x128@2x.png", 256)
    write_png("icon.png", 512)
    write_png("Square30x30Logo.png", 30)
    write_png("Square44x44Logo.png", 44)
    write_png("Square71x71Logo.png", 71)
    write_png("Square89x89Logo.png", 89)
    write_png("Square107x107Logo.png", 107)
    write_png("Square142x142Logo.png", 142)
    write_png("Square150x150Logo.png", 150)
    write_png("Square284x284Logo.png", 284)
    write_png("Square310x310Logo.png", 310)
    write_png("StoreLogo.png", 50)
    write_ico("icon.ico", [16, 32, 48, 64, 128, 256])
    write_icns("icon.icns", [
        (b"ic07", 128), (b"ic08", 256), (b"ic09", 512),
        (b"ic11", 32), (b"ic12", 64), (b"ic13", 256),
    ])
    print("done")
