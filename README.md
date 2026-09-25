# Seravit — Seramik Vitrifiye

Bodrum Mumcular showroom + perakende + toptan/proje tedariği web sitesi.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

`.env.example` → `.env.local` olarak kopyalayın.

## Yayın (GitHub Pages)

`main` dalına her push'ta `.github/workflows/pages.yml` siteyi statik olarak derleyip
`https://<kullanıcı>.github.io/seravit/` adresinde yayınlar. Yerelde aynı çıktıyı almak için:

```bash
GITHUB_PAGES=true NEXT_PUBLIC_BASE_PATH=/seravit npx next build   # → out/
```

Sunucu olmadığı için formlar tarayıcıda doğrulanır ve talep **WhatsApp mesajı** olarak açılır.
E-posta/Sheets'e düşmesi için depo ayarlarında `LEAD_ENDPOINT` değişkeni (Settings → Variables)
olarak bir Formspree / Make / n8n adresi tanımlayın.

## Yapı

```
src/
├─ config/site.ts            # İletişim, adres, saatler, menü — TODO alanları doldurulmalı
├─ lib/
│  ├─ types.ts               # Product, Category, QuoteItem…
│  ├─ catalog/data.ts        # ÖRNEK ürün verisi (CMS/DB ile değiştirilecek)
│  ├─ catalog/index.ts       # Katalog erişim katmanı (sayfalar yalnız bunu kullanır)
│  ├─ pricing.ts             # Fiyat biçimi, birimler, toptan kademe indirimi
│  ├─ validation.ts          # Form şemaları (zod)
│  └─ leads.ts               # Form taleplerini webhook'a ya da WhatsApp'a iletir
├─ app/
│  ├─ page.tsx               # Ana sayfa (iskelet)
│  ├─ urunler/               # Katalog + kategori (arama, sıralama, showroom filtresi)
│  ├─ urun/[slug]/           # Ürün detay, toptan kademe tablosu, teklife ekle
│  ├─ showroom/              # Showroom + randevu formu
│  ├─ toptan/                # B2B / proje tedariği + bayi başvurusu
│  ├─ teklif/                # Teklif listesi (sepet) + teklif formu
│  ├─ iletisim/ hakkimizda/ kvkk/
│  └─ sitemap.ts robots.ts icon.png
└─ components/
   ├─ brand/Logo.tsx         # Orijinal PDF'ten vektör wordmark + mürekkep lekesi
   ├─ layout/ product/ forms/ quote/ seo/
```

## Satış modeli

| Kanal | Akış |
|---|---|
| Showroom | `/showroom` randevu formu, ürünlerde "Showroom'da sergileniyor" etiketi, `?showroom=1` filtresi |
| Perakende | KDV dahil birim fiyat, kutu (m²) bazlı miktar, teklif listesi / WhatsApp |
| Toptan & proje | Ürün bazında kademe indirimi, teklif listesinde müşteri tipi, bayi/proje hesabı başvurusu |

Online ödeme yok — satış teklif → onay akışıyla ilerler (sektör standardı). Gerekirse sonradan iyzico/PayTR eklenebilir.

## Tasarım referansları

| Site | Alınan desen | Nerede |
|---|---|---|
| Güral Seramik | Geniş aralıklı serif başlıklar, koyu bantlar, dikey dev yazı, koleksiyon hikâyesi + üst üste numune kompozisyonu, mega menü (görünüm/yüzey/ebat/kullanım), ürün sayfasında teknik tablo, ebat/yüzey/renk varyantları, özellik ikonları | Ana sayfa, header, `/urun/[slug]` |
| VitrA | Duyuru çubuğu, header'da arama, keşif hizmeti bandı, çok satanlar (ürün kodu + indirimli fiyat), güven/hizmet satırı, zengin footer, yüzen "Banyomu yenilemek istiyorum" butonu | Header, ana sayfa, footer |
| Qua | Tam genişlik vitrin slaytı + koleksiyon/ebat alt yazısı, bayi girişi bağlantısı | Hero, duyuru çubuğu |
| Bien | Karolar / Banyo "iki dünya" kartları, kullanım alanı bento ızgarası, daire içinde ok düğmeleri | Ana sayfa |

## Görseller

Tüm karo dokuları [ambientCG](https://ambientcg.com) gerçek malzeme fotoğraflarıdır — **CC0**
(ticari kullanım serbest, atıf gerekmez). Renk / damar işleme: `scripts/prepare-photo-textures.py`.

| Doku | Kaynak |
|---|---|
| calacatta-oro | Marble001 |
| calacatta-viola, hero-viola | Onyx015 (damarlar ametist renk geçişine eşlendi) |
| nero-marquina, hero-nero | Marble006 |
| statuario-grey | Marble012 |
| travertino-beige, hero-travertino | Travertine009 |
| beton-grey, mat-beyaz | Concrete034 |
| antrasit | Concrete042A |
| bodrum-stone | Concrete040 |
| terrazzo-krem | Terrazzo012 |
| mese-dogal | WoodFloor051 |
| zellige-blanc | Tiles133B |
| aegean-mozaik | Tiles020 |

**Banyo ürün fotoğrafları** (`public/urunler/`) — hepsi **CC0**, [Openverse](https://openverse.org) üzerinden:

| Ürün | Kaynak |
|---|---|
| Rimless Asma Klozet | [rawpixel #5903477](https://www.rawpixel.com/image/5903477) |
| Oval Tezgâh Üstü Lavabo | [WordPress Photos — Michael Burridge](https://wordpress.org/photos/photo/251622a36c/) |
| Lavabo Dolabı 80 cm Meşe | [rawpixel #6042742](https://www.rawpixel.com/image/6042742) |
| Ankastre Duş Seti | rawpixel (Openverse 1ae747f0) |
| Lavabo Bataryası — Altın | [StockSnap — Studio 7042](https://stocksnap.io/photo/taps-gold-WIFG1MZOKJ) |
| Banyo Aksesuar Seti | [rawpixel #5941214](https://www.rawpixel.com/image/5941214) (kırpıldı) |
| Flex Seramik Yapıştırıcı | [Wikimedia — Ekeleme Ijeoma, "Cements bags"](https://commons.wikimedia.org/w/index.php?curid=188549364) |
| Derz Dolgu | ambientCG Tiles135A (yakın plan) |

Bunlar temsilî görsellerdir; gerçek ürün fotoğrafları geldiğinde aynı dosya adlarıyla değiştirilmesi yeterli.

## Marka

Logodan türetilen token'lar `src/app/globals.css` içinde: ink `#0B0809`, ametist `#813E91 / #9660A4 / #C09FC8`, mist `#F5F0F6`, altın `#DDB222`.
Fontlar: Bodoni Moda (başlık, logodaki didone serif), Jost (metin, geniş aralıklı alt yazı).

## Yapılacaklar

- [ ] `config/site.ts` gerçek adres, telefon, WhatsApp, koordinat
- [x] Referans sitelere göre tasarım (Güral, VitrA, Qua, Bien)
- [ ] Gerçek ürün ve showroom fotoğrafları
- [ ] Ana sayfa "Profesyonellere özel" rakamlarını doğrulama
- [ ] Ürün verisi kaynağı (Sanity / Payload CMS veya ERP entegrasyonu) + gerçek görseller
- [ ] `LEAD_ENDPOINT` depo değişkeni (e-posta / Sheets) — tanımlanmazsa formlar WhatsApp'a gider
- [ ] KVKK metni, Google Maps, analitik
