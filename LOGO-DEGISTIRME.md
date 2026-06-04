# Logo Nasıl Değiştirilir?

Logo, sitenin tek bir dosyasından gelir: **`assets/images/dinamik-logo.svg`**
Bu dosya 14 sayfada birden kullanılır (üst menü, açılış animasyonu, footer, sekme ikonu).
Yani **dosyayı değiştirince tüm site otomatik güncellenir** — başka hiçbir şey yapmaya gerek yok.

## Adımlar

1. Yeni logoyu hazırla.
   - Tercihen **SVG** formatında olsun (her boyutta net görünür).
   - SVG yoksa PNG de olur, ama o zaman aşağıdaki "PNG kullanıyorsan" notuna bak.

2. Yeni dosyayı **tam olarak şu isimle** kaydet:
   ```
   dinamik-logo.svg
   ```
   (İsim birebir aynı olmalı — büyük/küçük harf dahil.)

3. Bu dosyayı şu klasördeki **eski dosyanın üzerine** koy:
   ```
   assets/images/dinamik-logo.svg
   ```
   "Değiştir / Üzerine yaz" de.

4. Değişikliği yayına al (deploy):
   ```
   git add assets/images/dinamik-logo.svg
   git commit -m "Logo güncellendi"
   git push
   ```
   Birkaç dakika içinde canlı sitede yeni logo görünür.

## PNG kullanıyorsan (SVG değil)

İsmi `dinamik-logo.svg` yapsan bile içi PNG olursa tarayıcı açamaz. PNG kullanacaksan
bana (Claude'a) **"logoyu şu PNG ile değiştir"** de; dosya referanslarını PNG'ye göre
güncelleyeyim. Tek başına PNG'yi `dinamik-logo.svg` adıyla koymak **çalışmaz.**

## Tarayıcıda eski logoyu görüyorsan

Tarayıcı önbelleği eski dosyayı tutuyor olabilir:
- Chrome: `Cmd+Shift+R` (sayfayı önbelleksiz yenile)
- Safari: Develop menüsü → **Empty Caches**, sonra yenile

## Not

Logo, bilinçli olarak admin paneline eklenmedi (nadiren değişir, dosya değişimi en
sağlam yöntem). Sık değişen bilgiler (telefon, sosyal medya, slogan) ise **Admin →
Ayarlar** sekmesinden, kod bilgisi gerektirmeden güncellenebilir.
