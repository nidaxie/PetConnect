import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PetCard } from "../components/PetCard";
import { Heart } from "lucide-react";
import { api, type Pet } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function Favorites() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [favoritePets, setFavoritePets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) { navigate("/login"); return; }
    if (isAuthenticated) {
      api.favorites.list()
        .then(pets => setFavoritePets(pets.map(p => ({ ...p, isFavorited: true }))))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, navigate]);

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Favorilerim</h1>
          <p className="text-gray-600">Beğendiğiniz {favoritePets.length} ilan</p>
        </div>

        {favoritePets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {favoritePets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Henüz favori yok</h3>
            <p className="text-gray-600 mb-6">Beğendiğiniz ilanları favorilere ekleyerek burada görebilirsiniz</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
