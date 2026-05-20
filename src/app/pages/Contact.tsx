import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Mesajınız başarıyla gönderildi!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">
              💬 İletişim
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Bize Ulaşın</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Email */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">E-posta</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    7/24 e-posta desteği
                  </p>
                  <a
                    href="mailto:info@petconnect.com"
                    className="text-orange-500 font-medium hover:text-orange-600"
                  >
                    info@petconnect.com
                  </a>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Phone className="w-6 h-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Telefon</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Hafta içi 09:00 - 18:00
                  </p>
                  <a
                    href="tel:+902125550000"
                    className="text-blue-500 font-medium hover:text-blue-600"
                  >
                    +90 212 555 0000
                  </a>
                </div>

                {/* Address */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Adres</h3>
                  <p className="text-gray-600 text-sm">
                    Maslak Mahallesi<br />
                    Büyükdere Caddesi No: 123<br />
                    Sarıyer / İstanbul
                  </p>
                </div>

                {/* Working Hours */}
                <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Çalışma Saatleri</h3>
                  <div className="space-y-2 text-sm text-orange-100">
                    <div className="flex justify-between">
                      <span>Pazartesi - Cuma</span>
                      <span>09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cumartesi</span>
                      <span>10:00 - 16:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pazar</span>
                      <span>Kapalı</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Mesaj Gönderin</h2>
                      <p className="text-gray-600">Size en kısa sürede dönüş yapacağız</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Adınız Soyadınız *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Adınızı girin"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          E-posta Adresiniz *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Konu *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Konu seçin</option>
                        <option value="general">Genel Bilgi</option>
                        <option value="support">Teknik Destek</option>
                        <option value="shelter">Barınak Başvurusu</option>
                        <option value="report">Şikayet / Rapor</option>
                        <option value="partnership">İş Birliği</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Mesajı Gönder
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Quick Contact */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="font-semibold mb-2">💡 Hızlı Çözüm</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Çoğu sorunun cevabını SSS bölümümüzde bulabilirsiniz
                    </p>
                    <a
                      href="/faq"
                      className="text-blue-600 font-medium text-sm hover:text-blue-700"
                    >
                      SSS'ye Git →
                    </a>
                  </div>

                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="font-semibold mb-2">📚 Rehber</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Platform kullanımı hakkında detaylı bilgi
                    </p>
                    <a
                      href="/how-it-works"
                      className="text-green-600 font-medium text-sm hover:text-green-700"
                    >
                      Nasıl Çalışır? →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Ofis Konumumuz</h2>
              <p className="text-gray-600">Bizi ziyaret etmek isterseniz</p>
            </div>
            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3007.8359674894644!2d29.01523!3d41.08287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzU4LjMiTiAyOcKwMDAnNTQuOCJF!5e0!3m2!1str!2str!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
