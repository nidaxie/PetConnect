import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Search, Heart, CheckCircle, MessageCircle, UserPlus, FileText, Shield, Star } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              📖 Rehber
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nasıl Çalışır?</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              PetConnect'i kullanarak hayvan sahiplendirme ve çiftleştirme sürecini kolayca yönetin
            </p>
          </div>
        </section>

        {/* For Pet Seekers */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Hayvan Sahiplenmek İsteyenler İçin</h2>
              <p className="text-gray-600">4 basit adımda yeni dostunuzu bulun</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h3 className="font-bold text-lg mb-3">Kayıt Olun</h3>
                <p className="text-gray-600 text-sm">
                  E-posta adresiniz ile ücretsiz hesap oluşturun ve profilinizi tamamlayın
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Search className="w-10 h-10 text-white" />
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h3 className="font-bold text-lg mb-3">Ara & Filtrele</h3>
                <p className="text-gray-600 text-sm">
                  Şehir, tür, cins, yaş gibi filtreleri kullanarak size uygun hayvanları bulun
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h3 className="font-bold text-lg mb-3">İletişime Geçin</h3>
                <p className="text-gray-600 text-sm">
                  İlan sahibi veya barınak ile iletişime geçin, detayları öğrenin
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  4
                </div>
                <h3 className="font-bold text-lg mb-3">Sahiplenin</h3>
                <p className="text-gray-600 text-sm">
                  Gerekli belgeleri tamamlayın ve yeni dostunuzu evinize götürün
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For Pet Owners */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Hayvan Sahiplendirmek İsteyenler İçin</h2>
              <p className="text-gray-600">Hızlı ve güvenli ilan verme süreci</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">1. İlan Oluşturun</h3>
                <p className="text-gray-600 mb-4">
                  Hayvanınızın fotoğraflarını ve detaylı bilgilerini ekleyerek ilan oluşturun
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Fotoğraf yükleme
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Detaylı açıklama
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    Sağlık bilgileri
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">2. Başvuruları İnceleyin</h3>
                <p className="text-gray-600 mb-4">
                  İlgilenenlerin mesajlarını okuyun ve uygun kişiyi seçin
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Mesaj yönetimi
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Başvuru filtreleme
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    Görüşme ayarlama
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-xl mb-3">3. Teslim Edin</h3>
                <p className="text-gray-600 mb-4">
                  Hayvanınızı yeni sahibine güvenli şekilde teslim edin
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Belge kontrolü
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Güvenli teslimat
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    Takip desteği
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* For Shelters */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Barınaklar İçin</h2>
              <p className="text-gray-600">Toplu ilan yönetimi ve gelişmiş özellikler</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-8 border border-orange-200">
                <Shield className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-bold text-xl mb-3">Barınak Doğrulaması</h3>
                <p className="text-gray-700 mb-4">
                  Resmi belgelerinizi yükleyerek barınağınızı doğrulayın ve güvenilir rozet kazanın
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Resmi belge doğrulaması
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Doğrulanmış rozeti
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Öncelikli görünürlük
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
                <Star className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl mb-3">Gelişmiş Özellikler</h3>
                <p className="text-gray-700 mb-4">
                  Barınaklar için özel tasarlanmış yönetim araçlarından faydalanın
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Toplu ilan ekleme
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    İstatistik ve raporlama
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Başvuru yönetim sistemi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="py-16 bg-gradient-to-br from-orange-500 to-pink-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">İpuçları</h2>
              <p className="text-orange-100">Başarılı sahiplendirme için öneriler</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-lg mb-3">📸 Kaliteli Fotoğraflar</h3>
                <p className="text-orange-100 text-sm">
                  Net, aydınlık ve hayvanın karakterini yansıtan fotoğraflar kullanın
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-lg mb-3">📝 Detaylı Açıklama</h3>
                <p className="text-orange-100 text-sm">
                  Hayvanın karakteri, alışkanlıkları ve özel ihtiyaçlarını açıkça belirtin
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="font-bold text-lg mb-3">⚡ Hızlı Yanıt</h3>
                <p className="text-orange-100 text-sm">
                  İlgilenen kişilere hızlı geri dönüş yaparak güven oluşturun
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
