"""
Seravit — fotoğraf tabanlı mermer / traverten dokuları.

Kaynak: ambientCG (https://ambientcg.com) — CC0 1.0 (kamu malı, ticari kullanım serbest,
atıf zorunlu değil). Kullanılan malzemeler: Marble001, Marble006, Marble012, Onyx015, Travertine009.

Kullanım:
  1) Her malzemenin 2K-JPG zip'ini indirip *_Color.jpg dosyalarını SRC klasörüne çıkarın:
     https://ambientcg.com/get?file=Marble001_2K-JPG.zip  (Marble006, Marble012, Onyx015, Travertine009)
  2) .venv/bin/python scripts/prepare-photo-textures.py <SRC klasörü>
Çıktı: public/textures/*.webp (prosedürel sürümlerin üzerine yazar)
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, label

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
OUT = Path(__file__).resolve().parent.parent / "public" / "textures"


def load(name: str) -> np.ndarray:
    return np.asarray(Image.open(SRC / f"{name}_2K-JPG_Color.jpg").convert("RGB")).astype(np.float32) / 255


def rgb(h: str) -> np.ndarray:
    h = h.lstrip("#")
    return np.array([int(h[i : i + 2], 16) for i in (0, 2, 4)], np.float32) / 255


def lum(img: np.ndarray) -> np.ndarray:
    return img @ np.array([0.2126, 0.7152, 0.0722], np.float32)


def vein_mask(img: np.ndarray, lo: float, hi: float, dark_veins=True) -> np.ndarray:
    """Zemine göre damar yoğunluğu (0–1). Açık zeminde koyu, koyu zeminde açık damarlar."""
    L = lum(img)
    base = gaussian_filter(L, 40)  # yerel zemin tonu
    d = (base - L) if dark_veins else (L - base)
    return np.clip((d - lo) / (hi - lo), 0, 1)


def main_veins(v: np.ndarray, thr=0.08, min_px=3000, blur=3) -> np.ndarray:
    """Birbirine bağlı uzun damar ağını tutar, küçük lekeleri eler."""
    lab, n = label(gaussian_filter(v, blur) > thr)
    sizes = np.bincount(lab.ravel())
    keep = sizes >= min_px
    keep[0] = False
    return v * gaussian_filter(keep[lab].astype(np.float32), 1.5)


def mix(a, b, t):
    return a * (1 - t[..., None]) + b * t[..., None]


def grade(img, sat=1.0, warm=0.0, contrast=1.0, bright=0.0):
    L = lum(img)[..., None]
    img = L + (img - L) * sat
    img = (img - 0.5) * contrast + 0.5 + bright
    img = img + np.array([warm, warm * 0.4, -warm], np.float32)
    return np.clip(img, 0, 1)


def save(img: np.ndarray, name: str, size=None, quality=82):
    im = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8))
    if size:
        im = im.resize(size, Image.LANCZOS)
    im.save(OUT / f"{name}.webp", quality=quality, method=6)
    print("✓", name, im.size)


def wide(img: np.ndarray, top=0.2) -> np.ndarray:
    """2048² kareden 16:9 vitrin kesiti"""
    h, w, _ = img.shape
    ch = int(w * 9 / 16)
    y = int((h - ch) * top)
    return img[y : y + ch]


def main():
    # ——— Calacatta Oro: lekeler yumuşatılır, gri damar çekirdeği + altın hale ———
    m1 = load("Marble001")
    g1 = grade(m1, sat=0.0, contrast=1.12, bright=0.03)
    duz = mix(g1, gaussian_filter(g1, (30, 30, 0)), np.full(g1.shape[:2], 0.55, np.float32))
    v = vein_mask(g1, 0.035, 0.2)
    oro = duz * rgb("#fbf8f2")
    hale = np.clip(gaussian_filter(v, 6) * 1.6, 0, 1)
    oro = mix(oro, rgb("#dcc08a"), hale * 0.35)
    oro = mix(oro, rgb("#7b7670"), np.clip(v**0.9, 0, 1) * 0.85)
    save(oro, "calacatta-oro", (1200, 1200))

    # ——— Calacatta Viola: Onyx015'in dalgalı damarları ametist renk geçişine eşlenir ———
    on = load("Onyx015")
    L = lum(on)
    lw, ld = np.percentile(L, 97), np.percentile(L, 2)
    t = np.clip((lw - L) / (lw - ld), 0, 1)
    stops = [(0, "#fdfbfc"), (0.45, "#f3ebf4"), (0.72, "#caa9d4"), (0.9, "#6f2e82"), (1, "#401353")]
    xs = np.array([a for a, _ in stops], np.float32)
    cs = np.stack([rgb(c) for _, c in stops])
    tg = t**2.4
    viola = np.stack([np.interp(tg, xs, cs[:, k]) for k in range(3)], -1).astype(np.float32)
    viola *= (0.95 + 0.05 * (1 - t))[..., None]  # zeminde hafif bulut dokusu
    koyu = np.clip((tg - 0.6) / 0.3, 0, 1)
    altin = np.clip(gaussian_filter(koyu, 1.5) - gaussian_filter(koyu, 5), 0, 1) * 1.8
    viola = mix(viola, rgb("#caa24c"), np.clip(altin, 0, 0.5))
    save(viola, "calacatta-viola", (1200, 1200))
    save(wide(viola, 0.3), "hero-viola", (2048, 1152))

    # ——— Nero Marquina: siyah zemin, damarlar beyaza parlatılır ———
    m6 = load("Marble006")
    nero = grade(m6, sat=0.3, contrast=1.1, bright=-0.03)
    vl = vein_mask(nero, 0.03, 0.22, dark_veins=False)
    nero = mix(nero, rgb("#efe9e1"), np.clip(vl**0.9, 0, 1) * 0.75)
    save(nero, "nero-marquina", (1200, 1200))
    # vitrin: damarlar metnin arkasında kaybolmasın diye daha parlak
    hn = grade(gaussian_filter(m6, (0.8, 0.8, 0)), sat=0.3, contrast=1.1, bright=-0.03)
    vh = gaussian_filter(vein_mask(hn, 0.035, 0.2, dark_veins=False), 1.2)
    hn = mix(hn, rgb("#efe9e1"), np.clip(vh, 0, 1) * 0.75)
    save(wide(np.rot90(hn, -1).copy(), 0.5), "hero-nero", (2048, 1152))

    # ——— Statuario: mavi tonu alınmış, hafif sıcak gri damar ———
    m12 = load("Marble012")
    stat = grade(m12, sat=0.25, warm=0.02, contrast=1.05, bright=0.06)
    save(stat, "statuario-grey", (1200, 1200))

    # ——— Travertino: damar kesim ———
    t9 = load("Travertine009")
    trav = grade(t9, sat=0.9, warm=0.01, contrast=1.04)
    save(trav, "travertino-beige", (1200, 1200))
    save(wide(trav, 0.4), "hero-travertino", (2048, 1152))


if __name__ == "__main__":
    main()
