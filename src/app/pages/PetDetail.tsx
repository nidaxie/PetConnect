import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapPin, Calendar, Heart, Share2, CheckCircle, AlertCircle, ArrowLeft, Shield, Phone, Mail } from "lucide-react";
import { api, type Pet } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.pets.get(id)
      .then(p => {
        setPet(p);
        setFavorited(p.isFavorited || false);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  const handleFavorite = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (favLoading || !pet) return;
    setFavLoading(true);
    try {
      if (favorited) {
        await api.favorites.remove(pet.id);
        setFavorited(false);
      } else {
        await api.favorites.add(pet.id);
        setFavorited(true);
      }
    } catch (err) { console.error(err); }
    finally { setFavLoading(false); }
  };

  const handleMessage = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!pet) return;
    try {
      const conv = await api.messages.createConversation(pet.id);
      navigate(`/messages?conv=${conv.id}`);
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('kendi')) {
        alert(err.message);
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <Footer />
    </div>
  );

  if (notFound || !pet) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">İlan Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız ilan mevcut değil.</p>
          <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">İlanlara Dön</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  const listingType = pet.listingType || pet.listing_type;
  const healthStatus = pet.healthStatus || pet.health_status;
  const ownerType = pet.ownerType || pet.owner_type;
  const ownerId = pet.ownerId || pet.owner_id;
  const createdAt = pet.createdAt || pet.created_at;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/explore" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              İlanlara Dön
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img src={pet.images?.[currentImageIndex] || ''} alt={pet.name} className="w-full h-full object-cover" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button onClick={handleFavorite} disabled={favLoading} className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Heart className={`w-5 h-5 transition-colors ${favorited ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
                    </button>
                    <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                      <Share2 className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
                {pet.images?.length > 1 && (
                  <div className="p-4 flex gap-2">
                    {pet.images.map((image, index) => (
                      <button key={index} onClick={() => setCurrentImageIndex(index)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index ? "border-orange-500" : "border-gray-200 hover:border-gray-300"}`}>
                        <img src={image} alt={`${pet.name} ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
                <h2 className="text-xl font-bold mb-4">Açıklama</h2>
                <p className="text-gray-700 leading-relaxed">{pet.description}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mt-6">
                <h2 className="text-xl font-bold mb-4">Detaylar</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600 mb-1">Tür</p><p className="font-medium">{pet.type === "dog" ? "Köpek" : "Kedi"}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Cins</p><p className="font-medium">{pet.breed}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Yaş</p><p className="font-medium">{pet.age} yaşında</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Cinsiyet</p><p className="font-medium">{pet.gender === "male" ? "Erkek" : "Dişi"}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Sağlık Durumu</p><p className="font-medium">{healthStatus}</p></div>
                  <div><p className="text-sm text-gray-600 mb-1">Şehir</p><p className="font-medium flex items-center gap-1"><MapPin className="w-4 h-4" />{pet.city}</p></div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-3">
                    {pet.vaccinated && <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm"><CheckCircle className="w-4 h-4" />Aşılı</div>}
                    {pet.neutered && <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm"><CheckCircle className="w-4 h-4" />Kısırlaştırılmış</div>}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm">
                      <Shield className="w-4 h-4" />
                      {listingType === "adoption" ? "Sahiplendirme" : "Çiftleştirme"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
                <h3 className="text-2xl font-bold mb-4">{pet.name}</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm">
                      {createdAt ? new Date(createdAt).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }) : ""}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">İlan Sahibi</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {pet.ownerName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-semibold">{pet.ownerName}</p>
                      <p className="text-sm text-gray-600">{ownerType === "shelter" ? "Barınak" : "Bireysel"}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900">İletişim Bilgileri</h3>

                  {ownerType === "shelter" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">Detaylı iletişim bilgileri için barınak sayfasını ziyaret edin.</p>
                      <Link to={`/shelters/${ownerId}`} className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5" />
                        Barınak Sayfasına Git
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pet.ownerPhone && (
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 mb-1">Telefon</p>
                            <a href={`tel:${pet.ownerPhone}`} className="font-medium text-orange-500 hover:text-orange-600">{pet.ownerPhone}</a>
                          </div>
                        </div>
                      )}
                      {pet.ownerEmail && (
                        <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
                          <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 mb-1">E-posta</p>
                            <a href={`mailto:${pet.ownerEmail}`} className="font-medium text-orange-500 hover:text-orange-600 break-all">{pet.ownerEmail}</a>
                          </div>
                        </div>
                      )}
                      <button onClick={handleMessage} className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                        Mesaj Gönder
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Güvenli Sahiplendirme</p>
                      <p className="text-xs text-blue-700">Lütfen sahiplendirme öncesi hayvanı ziyaret edin ve gerekli kontrolleri yapın.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
