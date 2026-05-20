import { useState, useEffect, useCallback } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PetCard } from "../components/PetCard";
import { cities, dogBreeds, catBreeds, type PetType, type ListingType, type Gender } from "../data/mockData";
import { SlidersHorizontal } from "lucide-react";
import { api, type Pet } from "../lib/api";

export function ExplorePets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: "" as PetType | "",
    breed: "",
    city: "",
    gender: "" as Gender | "",
    listingType: "" as ListingType | "",
    minAge: "",
    maxAge: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  const fetchPets = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (filters.type) params.type = filters.type;
      if (filters.breed) params.breed = filters.breed;
      if (filters.city) params.city = filters.city;
      if (filters.gender) params.gender = filters.gender;
      if (filters.listingType) params.listingType = filters.listingType;
      if (filters.minAge) params.minAge = filters.minAge;
      if (filters.maxAge) params.maxAge = filters.maxAge;
      const data = await api.pets.list(params);
      setPets(data);
    } catch (err) {
      console.error("Fetch pets error:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const breeds = filters.type === "dog" ? dogBreeds : filters.type === "cat" ? catBreeds : [];

  const clearFilters = () => {
    setFilters({ type: "", breed: "", city: "", gender: "", listingType: "", minAge: "", maxAge: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tüm İlanlar</h1>
          <p className="text-gray-600">{loading ? "Yükleniyor..." : `${pets.length} ilan bulundu`}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-80 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" />
                  Filtreler
                </h2>
                <button onClick={clearFilters} className="text-sm text-orange-500 hover:text-orange-600">Temizle</button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">İlan Türü</label>
                  <select value={filters.listingType} onChange={(e) => setFilters({ ...filters, listingType: e.target.value as ListingType | "" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Tümü</option>
                    <option value="adoption">Sahiplendirme</option>
                    <option value="mating">Çiftleştirme</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hayvan Türü</label>
                  <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value as PetType | "", breed: "" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Tümü</option>
                    <option value="dog">Köpek</option>
                    <option value="cat">Kedi</option>
                  </select>
                </div>

                {filters.type && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Cins</label>
                    <select value={filters.breed} onChange={(e) => setFilters({ ...filters, breed: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                      <option value="">Tümü</option>
                      {breeds.map((breed) => <option key={breed} value={breed}>{breed}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Şehir</label>
                  <select value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Tümü</option>
                    {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cinsiyet</label>
                  <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value as Gender | "" })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Tümü</option>
                    <option value="male">Erkek</option>
                    <option value="female">Dişi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Yaş Aralığı</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minAge} onChange={(e) => setFilters({ ...filters, minAge: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" min="0" />
                    <input type="number" placeholder="Max" value={filters.maxAge} onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" min="0" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden mb-4 w-full px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center justify-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filtreleri {showFilters ? "Gizle" : "Göster"}
            </button>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 mb-4">Filtrelere uygun ilan bulunamadı</p>
                <button onClick={clearFilters} className="text-orange-500 font-medium hover:text-orange-600">Filtreleri Temizle</button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
