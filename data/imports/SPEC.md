# Marka ürün içe aktarma formatı

Her marka için `data/imports/<marka>.json` — bir JSON dizi (array). Her öğe:

```json
{
  "brand": "VitrA",
  "slug": "vitra-<model-adi>-<urun-kodu>",          // küçük harf, ascii, tire; benzersiz, marka önekli
  "sku": "7041B003-0075",                            // markanın ürün kodu (yoksa model adı)
  "name": "VitrA Sento Asma Klozet",                 // Türkçe, sitede görünen ad (marka adıyla başlar)
  "category": "klozet",                              // AŞAĞIDAKİ listeden biri
  "collection": "Sento",                             // seri / koleksiyon adı (varsa)
  "summary": "Kısa tek cümle (en çok ~110 karakter).",
  "description": "1-3 cümle Türkçe açıklama (markanın kendi metninden özetle).",
  "specs": { "Ölçü": "36×54 cm", "Renk": "Beyaz", "Montaj": "Asma" },   // markanın teknik bilgileri, Türkçe etiket
  "images": ["/urunler/vitra/vitra-sento-asma-klozet-1.webp"],        // 1-3 görsel, yerel yol
  "sourceUrl": "https://www.vitra.com.tr/...",
  "unit": "adet",                                    // karolar: "m2"; vitrifiye/armatür: "adet"; set: "takim"

  // —— yalnız karolar için (yoksa alanı hiç yazma) ——
  "size": "60×120",                                  // cm, "×" karakteri ile
  "surface": "parlak",                               // parlak | mat | lappato | kaymaz | sirli
  "look": "mermer",                                  // mermer | dogal-tas | beton | ahsap | duz | dekor | mozaik
  "colorName": "Beyaz",
  "thickness": "9 mm",
  "usage": ["banyo", "ic-mekan"]                     // banyo | mutfak | ic-mekan | dis-mekan | havuz
}
```

**category** değerleri (yalnız bunlar):
`porselen-karo`, `duvar-karosu`, `dis-mekan-havuz`, `klozet`, `lavabo`, `rezervuar`, `kuvet-dus-teknesi`,
`banyo-mobilyasi`, `armatur` (batarya, duş seti, duş sistemi), `aksesuar`, `yapi-kimyasallari`

**Görseller:** `public/urunler/<marka>/` altına, `magick <kaynak> -auto-orient -resize "1200x1200>" -quality 82 <hedef>.webp`
ile. Dosya adı = slug + `-1.webp`, `-2.webp`. Ürünün kendi fotoğrafı (beyaz zeminli ürün ya da uygulama fotoğrafı);
logo, ikon, ölçü çizimi, banner kullanma. Görselde başka marka filigranı olmasın.

**Fiyat yazma.** (Seravit kendi fiyatını verecek.)
