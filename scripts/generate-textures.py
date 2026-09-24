"""
Seravit — prosedürel karo dokuları.
Gerçek ürün fotoğrafları gelene kadar katalog ve vitrin görselleri için kullanılır.

Kullanım:
  python3 -m venv .venv && .venv/bin/pip install numpy pillow scipy
  .venv/bin/python scripts/generate-textures.py
Çıktı: public/textures/*.webp
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter, zoom

OUT = Path(__file__).resolve().parent.parent / "public" / "textures"
OUT.mkdir(parents=True, exist_ok=True)


def rgb(hex_: str) -> np.ndarray:
    hex_ = hex_.lstrip("#")
    return np.array([int(hex_[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255


def noise(h, w, rng, sigma):
    """Gauss-bulanık gürültü; büyük ölçekler düşük çözünürlükte üretilip büyütülür (hız)."""
    f = max(1, int(sigma // 6))
    sh, sw = max(2, h // f), max(2, w // f)
    n = gaussian_filter(rng.standard_normal((sh, sw)).astype(np.float32), sigma / f, mode="wrap")
    if f > 1:
        n = zoom(n, (h / sh, w / sw), order=1)[:h, :w]
    return n / (n.std() + 1e-6)


def fbm(h, w, rng, scales=(160, 80, 40, 20, 10), gain=0.55):
    """Çok ölçekli gürültü, [-1, 1]"""
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    for sc in scales:
        out += noise(h, w, rng, sc) * amp
        total += amp
        amp *= gain
    out /= total
    return np.clip(out / (np.abs(out).max() + 1e-6), -1, 1)


def aniso(h, w, rng, sy, sx):
    """Yönlü (uzamış) gürültü, [0, 1]"""
    f = max(1, int(min(sy, sx) // 3))
    sh, sw = max(2, h // f), max(2, w // f)
    n = gaussian_filter(rng.standard_normal((sh, sw)).astype(np.float32), (sy / f, sx / f), mode="wrap")
    if f > 1:
        n = zoom(n, (h / sh, w / sw), order=1)[:h, :w]
    return (n - n.min()) / (np.ptp(n) + 1e-6)


def mix(a, b, t):
    t = t[..., None]
    return a * (1 - t) + b * t


def save(arr, name, quality=80):
    img = Image.fromarray((np.clip(arr, 0, 1) * 255).astype(np.uint8))
    img.save(OUT / f"{name}.webp", quality=quality, method=6)
    print("✓", name, img.size)


def marble(name, size, base, cloud, veins, seed, angle=0.35, freq=2.2, crack=0.25, grain=0.012, warp=0.35):
    """Domain-warp ile akışkan damarlı mermer. veins: [(renk, güç, genişlik)]"""
    h, w = size
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32) / max(h, w)
    img = np.ones((h, w, 3), np.float32) * rgb(base)
    c = (fbm(h, w, rng, scales=(0.3 * w, 0.15 * w, 0.06 * w)) + 1) / 2
    img = mix(img, np.ones_like(img) * rgb(cloud), c * 0.7)
    for i, (color, strength, width) in enumerate(veins):
        a = angle + rng.uniform(-0.35, 0.35) * (i > 0)
        coord = x * np.cos(a) + y * np.sin(a)
        wp = fbm(h, w, rng, scales=(0.35 * w, 0.18 * w, 0.08 * w, 0.03 * w, 0.012 * w), gain=0.5)
        u = coord * freq * (1 + 0.45 * i) + wp * warp * freq * 1.6 + rng.uniform(0, 1)
        v = np.abs(np.sin(u * np.pi))
        wmod = width * (0.35 + 1.3 * (fbm(h, w, rng, scales=(0.2 * w, 0.07 * w)) + 1) / 2)
        line = np.exp(-((v / wmod) ** 2))
        fade = np.clip((fbm(h, w, rng, scales=(0.25 * w, 0.1 * w)) + 1) / 2 * 1.8 - 0.35, 0, 1)
        line = gaussian_filter(line * fade, 0.7)
        img = mix(img, np.ones_like(img) * rgb(color), np.clip(line * strength, 0, 1))
        # damarın etrafında hafif hale
        halo = gaussian_filter(line, 0.012 * w)
        img = mix(img, np.ones_like(img) * rgb(color), np.clip(halo * strength * 0.18, 0, 1))
    # ince kılcal damarlar (seyrek)
    n2 = fbm(h, w, rng, scales=(0.08 * w, 0.04 * w, 0.02 * w, 0.008 * w))
    mask = np.clip((fbm(h, w, rng, scales=(0.2 * w,)) + 1) / 2 * 2 - 1.1, 0, 1)
    web = np.exp(-((n2 / 0.02) ** 2)) * mask
    img = mix(img, np.ones_like(img) * rgb(veins[0][0]), np.clip(web * crack, 0, 1))
    img += rng.standard_normal((h, w, 1)).astype(np.float32) * grain
    save(img, name)


def travertine(name, size, base, dark, light, seed):
    """Damar kesim traverten: 1B katman profili (dalgalı) + kümelenmiş gözenekler"""
    h, w = size
    rng = np.random.default_rng(seed)
    # katman profili: farklı kalınlıkta bantlar
    prof = (
        gaussian_filter(rng.standard_normal(h * 2), 3) * 0.6
        + gaussian_filter(rng.standard_normal(h * 2), 14) * 1.4
        + gaussian_filter(rng.standard_normal(h * 2), 50) * 2.0
    ).astype(np.float32)
    prof = (prof - prof.min()) / (np.ptp(prof) + 1e-6)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    warp = fbm(h, w, rng, scales=(0.5 * w, 0.25 * w, 0.1 * w)) * h * 0.06
    idx = np.clip((y + warp + h * 0.5).astype(int), 0, h * 2 - 1)
    t = prof[idx]
    img = mix(np.ones((h, w, 3), np.float32) * rgb(light), np.ones((h, w, 3), np.float32) * rgb(base), np.clip(t * 1.6 - 0.2, 0, 1))
    img = mix(img, np.ones_like(img) * rgb(dark), np.clip(t * 2.2 - 1.45, 0, 1) * 0.8)
    fib = aniso(h, w, rng, 0.8, 0.03 * w)
    img = mix(img, np.ones_like(img) * rgb(dark), np.clip(fib * 2 - 1.2, 0, 1) * 0.12)
    # gözenekler: koyu bantlarda yoğunlaşır
    prob = 0.00003 + 0.00032 * np.clip(t * 2 - 1, 0, 1)
    pores = (rng.random((h, w)) < prob).astype(np.float32)
    pores = gaussian_filter(pores, (2.4, 6)) * 90
    img = mix(img, np.ones_like(img) * rgb(dark) * 0.72, np.clip(pores, 0, 0.9))
    img *= 1 + fbm(h, w, rng, scales=(0.3 * w,))[..., None] * 0.04
    img += rng.standard_normal((h, w, 1)).astype(np.float32) * 0.008
    save(img, name)


def concrete(name, size, base, dark, seed, speck=0.35):
    h, w = size
    rng = np.random.default_rng(seed)
    n = (fbm(h, w, rng, scales=(300, 150, 70, 30, 12, 5)) + 1) / 2
    img = mix(np.ones((h, w, 3), np.float32) * rgb(base), np.ones((h, w, 3), np.float32) * rgb(dark), n * 0.6)
    specks = gaussian_filter((rng.random((h, w)) > 0.997).astype(np.float32), 0.9) * 6
    img = mix(img, np.ones_like(img) * rgb(dark) * 0.7, np.clip(specks * speck, 0, 1))
    img += rng.standard_normal((h, w, 1)).astype(np.float32) * 0.025
    save(img, name)


def wood(name, size, base, dark, seed, planks=6):
    """Düz lifli meşe parke"""
    h, w = size
    rng = np.random.default_rng(seed)
    img = np.zeros((h, w, 3), np.float32)
    ph = h // planks
    for p in range(planks):
        prng = np.random.default_rng(seed + p)
        grain = aniso(ph, w, prng, 0.9, 0.25 * w)
        fine = aniso(ph, w, prng, 0.5, 0.05 * w)
        wave = aniso(ph, w, prng, 0.25 * ph, 0.3 * w)
        tone = prng.uniform(-0.05, 0.05)
        t = np.clip(grain * 0.7 + fine * 0.3 + wave * 0.3 - 0.35, 0, 1)
        plank = mix(np.ones((ph, w, 3), np.float32) * (rgb(base) + tone), np.ones((ph, w, 3), np.float32) * rgb(dark), t * 0.8)
        joint = int(prng.uniform(0.2, 0.8) * w)
        plank[:, joint : joint + 2] *= 0.8
        plank[:2] *= 0.75
        img[p * ph : (p + 1) * ph] = plank
    img += rng.standard_normal((h, w, 1)).astype(np.float32) * 0.01
    save(img, name)


def tiles(name, size, grid, colors, grout, seed, gloss=0.25, jitter=0.07, wave=0.04):
    h, w = size
    rng = np.random.default_rng(seed)
    rows, cols = grid
    th, tw = h // rows, w // cols
    img = np.ones((h, w, 3), np.float32) * rgb(grout)
    yy, xx = np.mgrid[0:th, 0:tw].astype(np.float32)
    for r in range(rows):
        for c in range(cols):
            col = rgb(colors[rng.integers(len(colors))]) + rng.uniform(-jitter, jitter)
            n = fbm(th, tw, rng, scales=(max(th, 8) / 2, max(th, 8) / 5)) * wave
            shade = 1 + n + gloss * np.exp(-(((xx - tw * rng.uniform(0.2, 0.8)) / tw) ** 2 + ((yy - th * 0.3) / th) ** 2) * 6) * rng.uniform(0.3, 1)
            edge = np.minimum.reduce([xx, yy, tw - 1 - xx, th - 1 - yy])
            shade *= 0.93 + 0.07 * np.clip(edge / 4, 0, 1)
            m = max(1, int(min(th, tw) * 0.045))
            img[r * th + m : (r + 1) * th - m, c * tw + m : (c + 1) * tw - m] = (col * shade[..., None])[m:-m, m:-m]
    save(img, name)


def terrazzo(name, size, base, chips, seed, count=1400):
    h, w = size
    rng = np.random.default_rng(seed)
    img = np.ones((h, w, 3), np.float32) * rgb(base)
    img = mix(img, img * 0.94, (fbm(h, w, rng, scales=(200, 60)) + 1) / 2)
    yy, xx = np.mgrid[0:h, 0:w]
    small = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
    from PIL import ImageDraw

    d = ImageDraw.Draw(small)
    for _ in range(count):
        cx, cy = rng.integers(0, w), rng.integers(0, h)
        r = rng.gamma(2, 3.2)
        pts = [(cx + np.cos(a) * r * rng.uniform(0.6, 1.3), cy + np.sin(a) * r * rng.uniform(0.6, 1.3)) for a in np.linspace(0, 2 * np.pi, rng.integers(4, 7), endpoint=False)]
        col = tuple(int(v * 255) for v in np.clip(rgb(chips[rng.integers(len(chips))]) + rng.uniform(-0.05, 0.05), 0, 1))
        d.polygon(pts, fill=col)
    small = small.filter(ImageFilter.GaussianBlur(0.4))
    save(np.asarray(small).astype(np.float32) / 255, name)


def plain(name, size, base, seed, amount=0.03):
    h, w = size
    rng = np.random.default_rng(seed)
    n = fbm(h, w, rng, scales=(300, 120, 40, 8))
    img = np.ones((h, w, 3), np.float32) * rgb(base) * (1 + n[..., None] * amount)
    img += rng.standard_normal((h, w, 1)).astype(np.float32) * 0.01
    save(img, name)


import sys


def main(only=None, scale=1.0):
    S = (int(1200 * scale), int(1200 * scale))
    WIDE = (int(1300 * scale), int(2300 * scale))
    jobs = [
        ("calacatta-oro", lambda: marble("calacatta-oro", S, "#f3f0ea", "#e9e4db", [("#8e8a85", 0.75, 0.05), ("#c7a35a", 0.7, 0.025)], seed=3)),
        ("calacatta-viola", lambda: marble("calacatta-viola", S, "#f4f1f0", "#ece6ea", [("#6d3b77", 0.85, 0.06), ("#9e79a6", 0.6, 0.035), ("#c9a24a", 0.5, 0.015)], seed=11, angle=0.6)),
        ("nero-marquina", lambda: marble("nero-marquina", S, "#141214", "#1d1a1d", [("#e9e5e0", 0.85, 0.035), ("#bca06a", 0.45, 0.02)], seed=21, angle=-0.4, crack=0.3)),
        ("statuario-grey", lambda: marble("statuario-grey", S, "#e6e4e1", "#d7d4d0", [("#6f6c6a", 0.8, 0.045), ("#9c9894", 0.5, 0.03)], seed=5, angle=0.9)),
        ("travertino-beige", lambda: travertine("travertino-beige", S, "#d9c7a9", "#b39c78", "#e8dcc6", seed=7)),
        ("beton-grey", lambda: concrete("beton-grey", S, "#b9b6b1", "#8a8782", seed=9)),
        ("bodrum-stone", lambda: concrete("bodrum-stone", S, "#c9c2b5", "#8f877a", seed=13, speck=0.6)),
        ("mese-dogal", lambda: wood("mese-dogal", S, "#c29a6b", "#7d5a36", seed=17)),
        ("zellige-blanc", lambda: tiles("zellige-blanc", S, (8, 8), ["#ece8de", "#e4dfd2", "#f1eee6", "#dcd6c6", "#e8e2d4"], "#bdb6a6", seed=19, gloss=0.05, jitter=0.025, wave=0.06)),
        ("aegean-mozaik", lambda: tiles("aegean-mozaik", S, (26, 26), ["#1f6f9e", "#2b86b7", "#175a86", "#3a9ccb", "#5bb4d8"], "#e8eef0", seed=23, gloss=0.35, jitter=0.03)),
        ("terrazzo-krem", lambda: terrazzo("terrazzo-krem", S, "#ece5da", ["#b98a6a", "#8c8f86", "#d6b894", "#5d5a55", "#f5f2ec", "#a9624a"], seed=29)),
        ("mat-beyaz", lambda: plain("mat-beyaz", S, "#f1efeb", seed=31)),
        ("antrasit", lambda: plain("antrasit", S, "#3b3a3c", seed=37, amount=0.05)),
        ("hero-viola", lambda: marble("hero-viola", WIDE, "#f4f1f0", "#ebe4ea", [("#6d3b77", 0.85, 0.05), ("#9e79a6", 0.6, 0.03), ("#c9a24a", 0.55, 0.012)], seed=41, angle=0.5, freq=1.6)),
        ("hero-nero", lambda: marble("hero-nero", WIDE, "#121012", "#1c181c", [("#ebe6e0", 0.85, 0.03), ("#c2a466", 0.55, 0.018)], seed=43, angle=-0.35, freq=1.5, crack=0.3)),
        ("hero-travertino", lambda: travertine("hero-travertino", WIDE, "#d6c4a6", "#ae9672", "#e6dac3", seed=47)),
    ]
    for name, job in jobs:
        if not only or name in only:
            job()


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--scale=")]
    sc = next((float(a[8:]) for a in sys.argv[1:] if a.startswith("--scale=")), 1.0)
    main(args or None, sc)
