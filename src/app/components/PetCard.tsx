import { Link } from "react-router";
import { Heart, MapPin, Calendar } from "lucide-react";
import { useState } from "react";
import { api, type Pet } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(pet.isFavorited || false);
  const [loading, setLoading] = useState(false);

  const listingType = pet.listingType || pet.listing_type;
  const ownerName = pet.ownerName || "Bilinmiyor";
  const createdAt = pet.createdAt || pet.created_at;

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      if (favorited) {
        await api.favorites.remove(pet.id);
        setFavorited(false);
      } else {
        await api.favorites.add(pet.id);
        setFavorited(true);
      }
    } catch (err) {
      console.error("Favorite error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/pets/${pet.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={pet.images?.[0] || "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800"}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
          {listingType === "adoption" ? "Sahiplendirme" : "Çiftleştirme"}
        </div>
        <button
          onClick={handleFavorite}
          disabled={loading}
          className={`absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors ${loading ? "opacity-50" : ""}`}
        >
          <Heart className={`w-4 h-4 transition-colors ${favorited ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-orange-500 transition-colors">
          {pet.name}
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            {pet.breed} • {pet.age} yaşında • {pet.gender === "male" ? "Erkek" : "Dişi"}
          </p>

          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{pet.city}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{ownerName}</span>
          </div>
        </div>

        {pet.featured && (
          <div className="mt-3 inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-medium">
            ⭐ Öne Çıkan
          </div>
        )}
      </div>
    </Link>
  );
}
