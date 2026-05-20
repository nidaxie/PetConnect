import { Link, useNavigate } from "react-router";
import { Users, Building2, List, TrendingUp, Search, CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { api, type Pet } from "../../lib/api";

export function AdminListings() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (search) params.search = search;
      const data = await api.admin.listings(params);
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter, search]);

  useEffect(() => {
    if (!authLoading && !isAdmin) { navigate("/"); return; }
    if (isAdmin) fetchListings();
  }, [isAdmin, authLoading, navigate, fetchListings]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ilanı silmek istediğinizden emin misiniz?")) return;
    setActionLoading(id + "_del");
    try {
      await api.admin.deleteListing(id);
      setListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (listing: Pet) => {
    const newStatus = listing.status === "active" ? "inactive" : "active";
    setActionLoading(listing.id + "_status");
    try {
      await api.admin.updateListing(listing.id, { status: newStatus });
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (listing: Pet) => {
    setActionLoading(listing.id + "_feat");
    try {
      await api.admin.updateListing(listing.id, { featured: !listing.featured });
      setListings(prev => prev.map(l => l.id === listing.id ? { ...l, featured: !l.featured } : l));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">PetConnect Yönetim Sistemi</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Siteye Dön</Link>
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
          <nav className="p-4 space-y-2">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"><TrendingUp className="w-5 h-5" />Dashboard</Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"><Users className="w-5 h-5" />Kullanıcılar</Link>
            <Link to="/admin/shelters" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"><Building2 className="w-5 h-5" />Barınaklar</Link>
            <Link to="/admin/listings" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium"><List className="w-5 h-5" />İlanlar</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">İlanlar</h2>
            <p className="text-gray-600">{listings.length} ilan</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="İlan adı ile ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
                <option value="adopted">Sahiplenildi</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Tüm Türler</option>
                <option value="dog">Köpek</option>
                <option value="cat">Kedi</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İlan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür / Cins</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Görüntülenme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Yükleniyor...</td></tr>
                ) : listings.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">İlan bulunamadı</td></tr>
                ) : listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={listing.images?.[0] || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200'}
                          alt={listing.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{listing.name}</p>
                            {listing.featured && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                          </div>
                          <p className="text-sm text-gray-500">{listing.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{listing.type === 'dog' ? 'Köpek' : 'Kedi'}</div>
                      <div className="text-gray-400">{listing.breed}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${listing.status === 'active' ? 'bg-green-100 text-green-700' : listing.status === 'adopted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {listing.status === 'active' ? <><CheckCircle className="w-3 h-3" />Aktif</> : listing.status === 'adopted' ? <>Sahiplenildi</> : <><XCircle className="w-3 h-3" />Pasif</>}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{listing.view_count || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFeatured(listing)}
                          disabled={actionLoading === listing.id + "_feat"}
                          title={listing.featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                          className={`p-1.5 rounded-lg transition-colors ${listing.featured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'} hover:opacity-80 disabled:opacity-50`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(listing)}
                          disabled={actionLoading === listing.id + "_status"}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${listing.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                        >
                          {actionLoading === listing.id + "_status" ? "..." : listing.status === 'active' ? "Pasif" : "Aktif"}
                        </button>
                        <button
                          onClick={() => handleDelete(listing.id)}
                          disabled={actionLoading === listing.id + "_del"}
                          className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
