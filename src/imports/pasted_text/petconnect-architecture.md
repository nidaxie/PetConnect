🐾 PETCONNECT – WEB PLATFORM MİMARİSİ
Aşağıda sistem 4 ana parçaya ayrılır:
1.	🌍 Genel Site (Public) 
2.	👤 Kullanıcı Paneli 
3.	🏠 Barınak Paneli 
4.	🛠️ Admin Paneli 
________________________________________
🌍 1. GENEL SİTE (Herkese açık)
🏠 Ana Sayfa (Home)
Amaç: Kullanıcıyı içeri çekmek
İçerik:
•	Hero alanı (slogan) 
•	“Sahiplen” / “İlan Ver” CTA butonları 
•	Öne çıkan hayvan ilanları 
•	Nasıl çalışır (3 adım) 
•	Barınaklardan gelen ilanlar 
•	Başarı hikayeleri 
•	Footer 
________________________________________
🔍 İlanlar Sayfası (Explore Pets)
En kritik sayfa 🔥
Filtreler:
•	Tür (kedi, köpek) 
•	Cins 
•	Yaş 
•	Cinsiyet 
•	Şehir 
•	Sahiplendirme / çiftleştirme 
İçerik:
•	Kart yapısı: 
o	foto 
o	isim 
o	yaş 
o	şehir 
•	“Detay Gör” butonu 
________________________________________
🐶 Hayvan Detay Sayfası
İçerik:
•	Büyük görseller (slider) 
•	Tüm bilgiler: 
o	yaş, cins, sağlık 
•	Açıklama 
•	Sahibi / barınak bilgisi 
•	“Mesaj Gönder” butonu 
•	“Sahiplenmek İstiyorum” butonu 
________________________________________
🏠 BARINAKLAR SAYFASI (Shelters Page)
🎯 Amaç
•	Platformdaki barınakları listelemek 
•	Kullanıcılara güven vermek 
•	Barınak hayvanlarının sahiplendirilmesini artırmak 
Barınaklar Listesi
📌 URL
/shelters
🧱 Sayfa Yapısı
🔍 Üst Kısım (Filtreler)
•	Şehir seçimi 
•	İlçe (opsiyonel) 
•	Kapasite (opsiyonel) 
•	Arama (isimle) 
🏢 Barınak Kartı (Card Design)
Her barınak kartında:
•	🖼️ Kapak fotoğrafı 
•	🏷️ Barınak adı 
•	📍 Şehir 
•	🐾 Toplam hayvan sayısı 
•	✅ Doğrulanmış rozet (opsiyonel) 
•	🔘 “Detay Gör” butonu 
 SAYFA: Barınak Detay Sayfası
📌 URL
/shelters/:id
🧱 İçerik
🖼️ Üst Alan
•	Büyük kapak fotoğrafı 
•	Barınak adı 
•	Şehir / adres 
•	İletişim bilgisi 

📄 Hakkında
•	Açıklama (barınak tanıtımı) 

🐾 Hayvanlar (EN ÖNEMLİ)
•	Bu barınağa ait ilanlar 
•	Grid kart yapısı 

📊 Bilgiler
•	Toplam hayvan 
•	Sahiplendirilen sayısı (opsiyonel) 
•	Katılım tarihi 

💬 Aksiyonlar
•	“Mesaj Gönder” 
•	“Ziyaret Et” (opsiyonel) 

________________________________________
🔐 Giriş / Kayıt
•	Email + şifre 
•	(opsiyonel) Google login 
•	Rol seçimi: 
o	Kullanıcı 
o	Barınak 
________________________________________
👤 2. KULLANICI PANELİ
📊 Dashboard
•	Kendi ilanların 
•	Gelen mesajlar 
•	Sahiplendirme durumları 
________________________________________
🐾 İlanlarım
•	Eklediğin hayvanlar 
•	Düzenle / sil 
•	Durum: 
o	aktif 
o	sahiplendirildi 
________________________________________
➕ Yeni İlan Oluştur
Form:
•	isim 
•	tür 
•	cins 
•	yaş 
•	açıklama 
•	foto upload 
•	şehir 
•	sahiplendirme / çiftleştirme seçimi 
________________________________________
💬 Mesajlar
•	WhatsApp gibi yapı 
•	Sol: konuşmalar 
•	Sağ: mesaj içerikleri 
________________________________________
❤️ Favoriler
•	Beğendiğin hayvanlar 
________________________________________
👤 Profil
•	Ad, şehir 
•	Profil fotoğrafı 
•	Şifre güncelleme 
________________________________________
🏠 3. BARINAK PANELİ
Kullanıcı paneline benzer ama daha gelişmiş:
📊 Dashboard
•	Toplam hayvan sayısı 
•	Sahiplendirilenler 
•	Bekleyen talepler 
________________________________________
🐕 Hayvan Yönetimi
•	Toplu ilan ekleme 
•	Excel / CSV upload (ileri aşama) 
•	Durum takibi 
________________________________________
📥 Sahiplendirme Talepleri
•	Kim sahiplenmek istiyor 
•	Onayla / reddet 
________________________________________
💬 Mesajlar
•	Kullanıcılarla iletişim 
________________________________________
🏢 Barınak Profili
•	Adres 
•	telefon 
•	açıklama 
•	fotoğraflar 
________________________________________
🛠️ 4. ADMIN PANELİ
📊 Dashboard
•	toplam kullanıcı 
•	toplam ilan 
•	aktif barınaklar 
________________________________________
👥 Kullanıcı Yönetimi
•	kullanıcıları banla 
•	rol değiştir 
________________________________________
🐾 İlan Moderasyonu
•	ilan onay sistemi 
•	uygunsuz içerik kontrolü 
________________________________________
🏠 Barınak Onayı
•	başvuruları incele 
•	doğrulama 
________________________________________
🚨 Raporlar
•	kullanıcı şikayetleri 
________________________________________
🔄 SİSTEM AKIŞI (ÇOK ÖNEMLİ)
1.	Kullanıcı kayıt olur 
2.	İlan oluşturur 
3.	Diğer kullanıcı ilanı görür 
4.	Mesaj atar 
5.	Sahiplendirme talebi gönderir 
6.	Sahip/barınak onaylar 
________________________________________
🎯 MVP’de YAPMAN GEREKENLER
İlk versiyon için SADELEŞTİR:
✅ Yapılacaklar
•	Auth sistemi 
•	İlan oluşturma 
•	Listeleme + filtre 
•	Detay sayfası 
•	Mesajlaşma (basic) 
❌ Şimdilik yapma
•	AI öneri sistemi 
•	Blockchain 
•	Gelişmiş analitik 
________________________________________
🧠 UX Tavsiyesi (çok kritik)
•	Instagram + Sahibinden karışımı düşün 
•	Kullanıcı:
→ 3 tıkta hayvan bulmalı 
