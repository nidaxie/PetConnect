import { Link, useNavigate } from "react-router";
import { Users, Building2, List, TrendingUp, Search, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import { api, type Shelter } from "../../lib/api";

export function AdminShelters() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchShelters = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const data = await api.admin.shelters(params);
      setShelters(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    if (!authLoading && !isAdmin) { navigate("/"); return; }
    if (isAdmin) fetchShelters();
  }, [isAdmin, authLoading, navigate, fetchShelters]);

  const handleApprove = async (id: string) => {
    setActionLoading(id + "_approve");
    try {
      await api.admin.approveShelter(id);
      setShelters(prev => prev.map(s => s.id === id ? { ...s, status: "approved", verified: true } : s));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "_reject");
    try {
      await api.admin.rejectShelter(id);
      setShelters(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" } : s));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const statusBadge = (status: string | undefined) => {
    if (status === "approved") return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" />Onaylı</span>;
    if (status === "rejected") return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" />Reddedildi</span>;
    return <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3" />Bekliyor</span>;
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
            <Link to="/admin/shelters" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium"><Building2 className="w-5 h-5" />Barınaklar</Link>
            <Link to="/admin/listings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"><List className="w-5 h-5" />İlanlar</Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Barınaklar</h2>
            <p className="text-gray-600">{shelters.length} barınak</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Barınak adı ile ara..."
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
                <option value="pending">Bekleyen</option>
                <option value="approved">Onaylı</option>
                <option value="rejected">Reddedilen</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-500">Yükleniyor...</div>
            ) : shelters.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center text-gray-500">Barınak bulunamadı</div>
            ) : shelters.map((shelter) => (
              <div key={shelter.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{shelter.name}</h3>
                      {statusBadge(shelter.status)}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>Yetkili: {shelter.applicant_name}</span>
                      <span>E-posta: {shelter.applicant_email}</span>
                      <span>{shelter.city}{shelter.district && `, ${shelter.district}`}</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4" />{shelter.joined_date ? new Date(shelter.joined_date).toLocaleDateString("tr-TR") : ""}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-t border-b border-gray-100">
                  <div><span className="text-xs text-gray-500">Telefon</span><p className="text-sm font-medium">{shelter.phone}</p></div>
                  <div><span className="text-xs text-gray-500">E-posta</span><p className="text-sm font-medium truncate">{shelter.email}</p></div>
                  <div><span className="text-xs text-gray-500">Kapasite</span><p className="text-sm font-medium">{shelter.capacity || "-"}</p></div>
                  <div><span className="text-xs text-gray-500">Vergi No</span><p className="text-sm font-medium">{shelter.tax_number || "-"}</p></div>
                </div>
                {shelter.description && (
                  <p className="text-sm text-gray-600 mb-4">{shelter.description}</p>
                )}
                {shelter.status === "pending" && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(shelter.id)}
                      disabled={actionLoading === shelter.id + "_approve"}
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {actionLoading === shelter.id + "_approve" ? "Onaylanıyor..." : "Onayla"}
                    </button>
                    <button
                      onClick={() => handleReject(shelter.id)}
                      disabled={actionLoading === shelter.id + "_reject"}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      {actionLoading === shelter.id + "_reject" ? "..." : "Reddet"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
