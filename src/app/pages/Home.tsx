import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PetCard } from "../components/PetCard";
import { Search, Heart, CheckCircle, Shield, Users, Home as HomeIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { api, type Pet, type Shelter } from "../lib/api";

export function Home() {
  const [featuredPets, setFeaturedPets] = useState<Pet[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    api.pets.list({ featured: "true" }).then(setFeaturedPets).catch(() => {});
    api.shelters.list().then(s => setShelters(s.slice(0, 4))).catch(() => {});
  }, []);

  const slides = [
    {
      id: 1,
      title: "Evcil Hayvanlar",
      subtitle: "İçin Sıcak Bir Yuva",
      description: "Sahiplenme ve çiftleştirme için güvenilir platform",
      image: "https://images.unsplash.com/photo-1618527445891-0b86bd4e0abe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGdvbGRlbiUyMHJldHJpZXZlciUyMHB1cHB5JTIwaG9tZXxlbnwxfHx8fDE3NzQ2OTExOTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-orange-500 via-pink-500 to-purple-500"
    },
    {
      id: 2,
      title: "Sevgi Dolu Dostlar",
      subtitle: "Seni Bekliyor",
      description: "Binlerce hayvan yeni bir yuva arıyor",
      image: "https://images.unsplash.com/photo-1769685706570-d3050e372dcd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwa2l0dGVuJTIwYWRvcHRpb258ZW58MXx8fHwxNzc0NjkxMTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-blue-500 via-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Mutluluğa",
      subtitle: "Bir Pati Uzaklıkta",
      description: "Hayalindeki dostu hemen bul",
      image: "https://images.unsplash.com/photo-1760204473280-6d04fb55b5e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjBwdXBweSUyMHBsYXlpbmclMjBmYW1pbHl8ZW58MXx8fHwxNzc0NjkxMTkyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-green-500 via-teal-500 to-blue-500"
    },
    {
      id: 4,
      title: "Güvenli Platform",
      subtitle: "Doğrulanmış İlanlar",
      description: "Barınaklar ve bireysel kullanıcılar bir arada",
      image: "https://images.unsplash.com/photo-1720705313994-12cd7930da3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaGVsdGVyJTIwYWRvcHRpb24lMjBoYXBweXxlbnwxfHx8fDE3NzQ2OTExOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      gradient: "from-pink-500 via-rose-500 to-orange-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0">
              <img src={slides[currentSlide].image} alt={slides[currentSlide].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1 }}
              className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} mix-blend-multiply`}
            ></motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="inline-block mb-6">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/30">🐾 PetConnect</div>
                </motion.div>
                <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-5xl md:text-7xl font-bold mb-4 text-white">
                  {slides[currentSlide].title}<br />
                  <span className={`bg-gradient-to-r ${slides[currentSlide].gradient} bg-clip-text text-transparent`}>{slides[currentSlide].subtitle}</span>
                </motion.h1>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl md:text-2xl text-white/90 mb-8">
                  {slides[currentSlide].description}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4">
                  <Link to="/explore" className="group px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold hover:shadow-2xl transition-all inline-flex items-center justify-center gap-2 hover:scale-105">
                    <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Hayvan Ara
                  </Link>
                  <Link to="/dashboard/create" className="group px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-semibold hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:scale-105">
                    <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    İlan Ver
                  </Link>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute inset-y-0 left-4 right-4 flex items-center justify-between pointer-events-none">
          <button onClick={prevSlide} className="pointer-events-auto w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 group">
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <button onClick={nextSlide} className="pointer-events-auto w-12 h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 group">
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} className={`transition-all ${index === currentSlide ? "w-12 h-3 bg-white" : "w-3 h-3 bg-white/50 hover:bg-white/70"} rounded-full`} />
          ))}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-200 rounded-full blur-3xl opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-4">⚡ Basit & Hızlı</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">Nasıl Çalışır?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">3 basit adımda hayalindeki dostu bul</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200"></div>
            {[
              { num: 1, icon: Search, color: "orange", title: "Ara & Keşfet", desc: "Şehrinizde, sevdiğiniz türde hayvanları filtreleyin ve keşfedin" },
              { num: 2, icon: Heart, color: "pink", title: "İletişim Kur", desc: "Beğendiğiniz hayvana mesaj gönderin, detayları öğrenin", mt: true },
              { num: 3, icon: CheckCircle, color: "purple", title: "Sahiplen", desc: "Süreci tamamlayın ve yeni dostunuzla hayatınıza devam edin" },
            ].map(({ num, icon: Icon, color, title, desc, mt }) => (
              <div key={num} className={`group relative ${mt ? "md:mt-8" : ""}`}>
                <div className={`bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-${color}-200 hover:-translate-y-2`}>
                  <div className={`absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg rotate-12 group-hover:rotate-0 transition-transform`}>{num}</div>
                  <div className={`w-20 h-20 bg-gradient-to-br from-${color}-400 to-${color}-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-center">{title}</h3>
                  <p className="text-gray-600 text-center leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Öne Çıkan İlanlar</h2>
              <p className="text-gray-600">Hemen yuva bekleyen dostlar</p>
            </div>
            <Link to="/explore" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Tümünü Gör →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPets.slice(0, 4).map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Onaylı Barınaklar</h2>
              <p className="text-gray-600">Güvenilir barınaklardan sahiplenme fırsatı</p>
            </div>
            <Link to="/shelters" className="text-orange-500 font-medium hover:text-orange-600 transition-colors">Tüm Barınaklar →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {shelters.map((shelter) => (
              <Link key={shelter.id} to={`/shelters/${shelter.id}`} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <HomeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-orange-500 transition-colors">{shelter.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{shelter.city}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{shelter.total_pets || shelter.totalPets || 0} hayvan</span>
                </div>
                {shelter.verified && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    Doğrulanmış
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-orange-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="text-4xl font-bold mb-2">500+</div><div className="text-orange-100">Mutlu Sahiplendirme</div></div>
            <div><div className="text-4xl font-bold mb-2">1000+</div><div className="text-orange-100">Aktif İlan</div></div>
            <div><div className="text-4xl font-bold mb-2">50+</div><div className="text-orange-100">Kayıtlı Barınak</div></div>
            <div><div className="text-4xl font-bold mb-2">10K+</div><div className="text-orange-100">Kullanıcı</div></div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-16 h-16 text-orange-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Güvenli ve Kontrollü Sahiplendirme</h2>
          <p className="text-xl text-gray-600 mb-8">
            PetConnect, sahipsiz hayvanların güvenli bir şekilde yuva bulabildiği, kullanıcıların ihtiyaç duydukları tüm süreçlere kolay erişebildiği bir platformdur.
          </p>
          <Link to="/explore" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-xl transition-shadow">
            Hemen Başla
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
