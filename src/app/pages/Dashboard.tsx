import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PlusCircle, List, Heart, TrendingUp, Eye, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api, type Pet } from "../lib/api";

export function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myListings, setMyListings] = useState<Pet[]>([]);
  const [favCount, setFavCount] = useState(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    if (isAuthenticated) {
      Promise.all([
        api.pets.myListings().catch(() => []),
        api.favorites.list().catch(() => [])
      ]).then(([listings, favs]) => {
        setMyListings(listings);
        setFavCount(favs.length);
        setDataLoading(false);
      });
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || dataLoading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <Footer />
    </div>
  );

  const totalViews = myListings.reduce((sum, p) => sum + (p.view_count || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {user?.name?.split(" ")[0]}! 👋</h1>
          <p className="text-gray-600">İlanlarınızı yönetin ve favorilerinizi kontrol edin</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <List className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-sm text-gray-500">Toplam</span>
            </div>
            <div className="text-2xl font-bold mb-1">{myListings.length}</div>
            <div className="text-sm text-gray-600">Aktif İlan</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-sm text-gray-500">Toplam</span>
            </div>
            <div className="text-2xl font-bold mb-1">{totalViews}</div>
            <div className="text-sm text-gray-600">Görüntülenme</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <span className="text-sm text-gray-500">Toplam</span>
            </div>
            <div className="text-2xl font-bold mb-1">{favCount}</div>
            <div className="text-sm text-gray-600">Favori</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Son İlanlarım</h2>
                <Link to="/dashboard/listings" className="text-sm text-orange-500 font-medium hover:text-orange-600">Tümünü Gör →</Link>
              </div>

              {myListings.length > 0 ? (
                <div className="space-y-4">
                  {myListings.slice(0, 3).map((pet) => (
                    <Link key={pet.id} to={`/pets/${pet.id}`} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                      <img src={pet.images?.[0] || ''} alt={pet.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1">{pet.name}</h3>
                        <p className="text-sm text-gray-600">{pet.breed} • {pet.city}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium mb-2">
                          <CheckCircle className="w-3 h-3" />
                          Aktif
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{pet.view_count || 0}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-4">Henüz ilan oluşturmadınız</p>
                </div>
              )}

              <Link to="/dashboard/create" className="mt-6 w-full px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Yeni İlan Ekle
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold mb-4">Hızlı Erişim</h3>
              <div className="space-y-2">
                <Link to="/dashboard/create" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                  <span className="font-medium">Yeni İlan</span>
                </Link>
                <Link to="/dashboard/listings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors">
                  <List className="w-5 h-5" />
                  <span className="font-medium">İlanlarım</span>
                </Link>
                <Link to="/dashboard/favorites" className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 text-gray-700 hover:text-orange-600 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Favoriler</span>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-6 text-white">
              <TrendingUp className="w-10 h-10 mb-4 opacity-80" />
              <h3 className="font-semibold mb-2">İlan Verin!</h3>
              <p className="text-sm text-orange-100 mb-4">Hayvanınız için hızlıca ilan oluşturun ve sahiplendirilmesine yardımcı olun.</p>
              <Link to="/dashboard/create" className="inline-block px-4 py-2 bg-white text-orange-500 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
