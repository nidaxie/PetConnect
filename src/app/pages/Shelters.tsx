import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { MapPin, Users, CheckCircle, Home, Search } from "lucide-react";
import { api, type Shelter } from "../lib/api";

export function Shelters() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    api.meta.options()
      .then((options) => setCities(options.cities))
      .catch((err) => console.error("Fetch options error:", err));
  }, []);

  const fetchShelters = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (selectedCity) params.city = selectedCity;
      if (searchQuery) params.search = searchQuery;
      const data = await api.shelters.list(params);
      setShelters(data);
    } catch (err) {
      console.error("Fetch shelters error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCity]);

  useEffect(() => {
    const timeout = setTimeout(fetchShelters, 300);
    return () => clearTimeout(timeout);
  }, [fetchShelters]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1">
        <div className="bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Kayıtlı Barınaklar</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Güvenilir ve onaylı barınaklardan hayvan sahiplenme fırsatı</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Barınak adı ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tüm Şehirler</option>
                {cities.map((city) => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="mb-6">
            <p className="text-gray-600">{loading ? "Yükleniyor..." : `${shelters.length} barınak bulundu`}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : shelters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shelters.map((shelter) => (
                <Link key={shelter.id} to={`/shelters/${shelter.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
                  <div className="relative h-48 overflow-hidden">
                    <img src={shelter.cover_image || shelter.coverImage || ''} alt={shelter.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {shelter.verified && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Doğrulanmış
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-500 transition-colors">{shelter.name}</h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{shelter.city}{shelter.district && `, ${shelter.district}`}</span></div>
                      <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{shelter.total_pets || 0} hayvan</span></div>
                      <div className="flex items-center gap-2"><Home className="w-4 h-4" /><span>{shelter.adopted_count || 0} sahiplendirme</span></div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{shelter.description}</p>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="text-orange-500 font-medium text-sm group-hover:text-orange-600">Detayları Gör →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Arama kriterlerine uygun barınak bulunamadı</p>
              <button onClick={() => { setSearchQuery(""); setSelectedCity(""); }} className="text-orange-500 font-medium hover:text-orange-600">Filtreleri Temizle</button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
