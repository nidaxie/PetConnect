import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PlusCircle, Edit, Trash2, Eye, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { api, type Pet } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function MyListings() {
  const [activeTab, setActiveTab] = useState<"all" | "adoption" | "mating">("all");
  const [myListings, setMyListings] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { navigate("/login"); return; }
    if (isAuthenticated) {
      api.pets.myListings()
        .then(setMyListings)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleDelete = async (petId: string) => {
    if (!confirm("Bu ilanı silmek istediğinizden emin misiniz?")) return;
    setDeleting(petId);
    try {
      await api.pets.delete(petId);
      setMyListings(prev => prev.filter(p => p.id !== petId));
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (pet: Pet) => {
    const newStatus = pet.status === "active" ? "inactive" : "active";
    try {
      await api.pets.update(pet.id, { status: newStatus });
      setMyListings(prev => prev.map(p => p.id === pet.id ? { ...p, status: newStatus } : p));
    } catch (err) {
      console.error("Status toggle error:", err);
    }
  };

  const filteredListings = activeTab === "all"
    ? myListings
    : myListings.filter((pet) => (pet.listing_type || pet.listingType) === activeTab);

  if (authLoading || loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">İlanlarım</h1>
            <p className="text-gray-600">{filteredListings.length} ilan bulundu</p>
          </div>
          <Link to="/dashboard/create" className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Yeni İlan
          </Link>
        </div>

        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 mb-6 inline-flex">
          {(["all", "adoption", "mating"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${activeTab === tab ? "bg-orange-500 text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              {tab === "all" ? "Tümü" : tab === "adoption" ? "Sahiplendirme" : "Çiftleştirme"}
            </button>
          ))}
        </div>

        {filteredListings.length > 0 ? (
          <div className="space-y-4">
            {filteredListings.map((pet) => (
              <div key={pet.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  <Link to={`/pets/${pet.id}`} className="flex-shrink-0">
                    <img src={pet.images?.[0] || ''} alt={pet.name} className="w-full md:w-48 h-48 rounded-xl object-cover hover:opacity-90 transition-opacity" />
                  </Link>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link to={`/pets/${pet.id}`} className="text-xl font-bold mb-2 hover:text-orange-500 transition-colors inline-block">{pet.name}</Link>
                        <p className="text-gray-600">{pet.breed} • {pet.age} yaşında • {pet.gender === "male" ? "Erkek" : "Dişi"}</p>
                        <p className="text-sm text-gray-500 mt-1">{pet.city}</p>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${pet.status === "active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        <CheckCircle className="w-4 h-4" />
                        {pet.status === "active" ? "Aktif" : "Pasif"}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-2">{pet.description}</p>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Eye className="w-4 h-4" />
                        <span>{pet.view_count || 0} görüntülenme</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <Link to="/messages" className="hover:text-orange-500">Mesajlar</Link>
                      </div>
                      <div className="text-sm text-gray-500">
                        {pet.created_at ? new Date(pet.created_at).toLocaleDateString("tr-TR") : ""}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/pets/${pet.id}`} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Görüntüle
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(pet)}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        {pet.status === "active" ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                      <button
                        onClick={() => handleDelete(pet.id)}
                        disabled={deleting === pet.id}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deleting === pet.id ? "Siliniyor..." : "Sil"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <PlusCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz ilan yok</h3>
            <p className="text-gray-600 mb-6">İlk ilanınızı oluşturarak başlayın</p>
            <Link to="/dashboard/create" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
              <PlusCircle className="w-5 h-5" />
              Yeni İlan Oluştur
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
