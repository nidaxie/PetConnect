import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ChevronDown, Search } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Genel",
    question: "PetConnect nedir?",
    answer: "PetConnect, evcil hayvan sahiplendirme ve çiftleştirme işlemlerini kolaylaştıran güvenilir bir platformdur. Bireysel kullanıcılar ve barınaklar bir arada hizmet vermektedir."
  },
  {
    category: "Genel",
    question: "Platform ücretsiz mi?",
    answer: "Evet, PetConnect tamamen ücretsiz kullanılabilir. İlan verme, arama ve mesajlaşma gibi tüm temel özellikler ücretsizdir."
  },
  {
    category: "Genel",
    question: "Hangi şehirlerde hizmet veriyorsunuz?",
    answer: "PetConnect Türkiye'nin tüm şehirlerinde hizmet vermektedir. İlanları filtreleyerek kendi şehrinizde bulunan hayvanları görebilirsiniz."
  },
  {
    category: "Sahiplendirme",
    question: "Nasıl hayvan sahiplenebilirim?",
    answer: "Öncelikle platforma kayıt olun. Ardından filtreleri kullanarak size uygun hayvanları bulun. Beğendiğiniz ilan için ilan sahibi ile iletişime geçin ve sahiplendirme sürecini başlatın."
  },
  {
    category: "Sahiplendirme",
    question: "Sahiplendirme ücretsiz mi?",
    answer: "İlanın türüne göre değişir. Barınaklardan sahiplenme genellikle ücretsizdir, ancak bazı aşı ve sağlık masrafları olabilir. Bireysel kullanıcılar kendi koşullarını belirler."
  },
  {
    category: "Sahiplendirme",
    question: "Sahiplendirme süreci ne kadar sürer?",
    answer: "Süreç, ilan sahibi ve sahiplenen kişinin anlaşmasına göre değişir. Genellikle 1-2 hafta içinde tamamlanır. Bu süre hayvanı tanıma, evrak işlemleri ve teslimat için gereklidir."
  },
  {
    category: "Sahiplendirme",
    question: "Hangi belgeler gereklidir?",
    answer: "Genellikle kimlik belgesi, ikametgah belgesi ve bazı durumlarda veteriner raporu istenir. Barınaklar ek belgeler talep edebilir. Detaylar ilan sahibi ile görüşülmelidir."
  },
  {
    category: "İlan Verme",
    question: "Nasıl ilan verebilirim?",
    answer: "Hesabınıza giriş yaptıktan sonra 'İlan Ver' butonuna tıklayın. Formda hayvanınızın fotoğraflarını, detaylı bilgilerini ve sağlık durumunu ekleyin. İlanınız onaylandıktan sonra yayınlanacaktır."
  },
  {
    category: "İlan Verme",
    question: "İlan verirken nelere dikkat etmeliyim?",
    answer: "Kaliteli ve net fotoğraflar kullanın. Hayvanın yaş, cins, sağlık durumu ve karakteri hakkında detaylı bilgi verin. Dürüst ve açık olun. İletişim bilgilerinizi güncel tutun."
  },
  {
    category: "İlan Verme",
    question: "İlanım ne kadar süre yayında kalır?",
    answer: "İlanlar varsayılan olarak 60 gün boyunca yayında kalır. Bu süre sonunda yenileyebilir veya silebilirsiniz. İlan durumunu istediğiniz zaman aktif/pasif yapabilirsiniz."
  },
  {
    category: "İlan Verme",
    question: "İlanımı nasıl düzenlerim veya silerim?",
    answer: "Panelim > İlanlarım bölümünden ilanlarınızı görüntüleyebilir, düzenleyebilir veya silebilirsiniz. Değişiklikler anında yansır."
  },
  {
    category: "Barınaklar",
    question: "Barınak olarak nasıl kayıt olabilirim?",
    answer: "Kayıt formunda 'Barınak' seçeneğini işaretleyin ve barınağınızın resmi bilgilerini girin. Doğrulama için gerekli belgeleri yükleyin. Onay sonrası barınak özel özelliklerinden faydalanabilirsiniz."
  },
  {
    category: "Barınaklar",
    question: "Barınak doğrulaması nedir?",
    answer: "Barınak doğrulaması, barınağınızın resmi ve güvenilir olduğunu gösteren bir rozettir. Resmi belgelerinizi yükleyerek başvurabilirsiniz. Doğrulanan barınaklar öncelikli görünürlük kazanır."
  },
  {
    category: "Barınaklar",
    question: "Toplu ilan nasıl eklerim?",
    answer: "Barınak hesapları için özel toplu ilan ekleme özelliği sunuyoruz. Excel veya CSV formatında hazırladığınız hayvan listesini yükleyerek aynı anda birden fazla ilan oluşturabilirsiniz."
  },
  {
    category: "Güvenlik",
    question: "Platformunuz güvenli mi?",
    answer: "Evet, kullanıcı bilgileriniz şifrelenerek saklanır. İlanlar moderasyon sürecinden geçer. Ancak yine de kişisel görüşme yapmanız ve hayvanı yerinde görmeniz önerilir."
  },
  {
    category: "Güvenlik",
    question: "Dolandırıcılıktan nasıl korunurum?",
    answer: "Asla ön ödeme yapmayın. Hayvanı mutlaka görün. Belgeleri kontrol edin. Şüpheli durumları platformumuza bildirin. Doğrulanmış kullanıcı ve barınaklarla çalışın."
  },
  {
    category: "Teknik",
    question: "Hesabımı nasıl silerim?",
    answer: "Profil ayarlarından hesap silme talebinde bulunabilirsiniz. İlanlarınız ve mesajlarınız da silinecektir. Bu işlem geri alınamaz."
  },
  {
    category: "Teknik",
    question: "Şifremi unuttum, ne yapmalıyım?",
    answer: "Giriş ekranında 'Şifremi Unuttum' bağlantısına tıklayın. E-posta adresinize şifre sıfırlama bağlantısı gönderilecektir."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");

  const categories = ["Tümü", ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tümü" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              ❓ Yardım
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sıkça Sorulan Sorular</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              PetConnect hakkında merak ettikleriniz
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Soru ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredFAQs.length > 0 ? (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1 pr-4">
                        <span className="text-xs font-medium text-orange-500 mb-1 block">
                          {faq.category}
                        </span>
                        <h3 className="font-semibold text-lg">{faq.question}</h3>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          openIndex === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Aradığınız kriterlere uygun soru bulunamadı.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-gradient-to-br from-orange-500 to-pink-500 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Cevabını Bulamadınız mı?</h2>
            <p className="text-xl text-orange-100 mb-8">
              Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-2xl transition-shadow"
            >
              İletişime Geç
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
