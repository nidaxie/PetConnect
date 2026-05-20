import { Link } from "react-router";
import { Users, Building2, List, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api, type AdminStats, type Shelter } from "../../lib/api";

export function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingShelters, setPendingShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAdmin) { navigate("/"); return; }
    if (isAdmin) {
      Promise.all([
        api.admin.stats(),
        api.admin.shelters({ status: "pending" })
      ]).then(([s, shelters]) => {
        setStats(s);
        setPendingShelters(shelters.slice(0, 3));
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [isAdmin, authLoading, navigate]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.admin.approveShelter(id);
      setPendingShelters(prev => prev.filter(s => s.id !== id));
      if (stats) setStats({ ...stats, pendingShelters: stats.pendingShelters - 1 });
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + "_reject");
    try {
      await api.admin.rejectShelter(id);
      setPendingShelters(prev => prev.filter(s => s.id !== id));
      if (stats) setStats({ ...stats, pendingShelters: stats.pendingShelters - 1 });
    } catch (err) { console.error(err); }
    finally { setActionLoading(null); }
  };

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-500">PetConnect Yönetim Sistemi</p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium">Siteye Dön</Link>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">A</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-16">
          <nav className="p-4 space-y-2">
            <Link to="/admin" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-medium">
              <TrendingUp className="w-5 h-5" />Dashboard
            </Link>
            <Link to="/admin/users" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <Users className="w-5 h-5" />Kullanıcılar
            </Link>
            <Link to="/admin/shelters" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <Building2 className="w-5 h-5" />
              Barınaklar
              {stats && stats.pendingShelters > 0 && (
                <span className="ml-auto px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">{stats.pendingShelters}</span>
              )}
            </Link>
            <Link to="/admin/listings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
              <List className="w-5 h-5" />İlanlar
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Toplam Kullanıcı</div>
                <div className="text-xs text-gray-500 mt-2">{stats.activeUsers} aktif</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center"><Building2 className="w-6 h-6 text-purple-600" /></div>
                  <span className="text-xs text-orange-600 font-medium">{stats.pendingShelters} bekliyor</span>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalShelters}</div>
                <div className="text-sm text-gray-600">Toplam Barınak</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center"><List className="w-6 h-6 text-orange-600" /></div>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalListings}</div>
                <div className="text-sm text-gray-600">Toplam İlan</div>
                <div className="text-xs text-gray-500 mt-2">{stats.activeListings} aktif</div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalAdoptions}</div>
                <div className="text-sm text-gray-600">Sahiplendirme</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-bold text-lg">Onay Bekleyen Barınaklar</h2>
                  <Link to="/admin/shelters" className="text-sm text-orange-500 font-medium hover:text-orange-600">Tümünü Gör →</Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingShelters.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Onay bekleyen barınak yok</div>
                  ) : pendingShelters.map((shelter) => (
                    <div key={shelter.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{shelter.name}</h3>
                          <p className="text-sm text-gray-600">Yetkili: {shelter.applicant_name} • {shelter.city}</p>
                        </div>
                        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">Bekliyor</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{shelter.joined_date ? new Date(shelter.joined_date).toLocaleDateString("tr-TR") : ""}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(shelter.id)}
                          disabled={actionLoading === shelter.id}
                          className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {actionLoading === shelter.id ? "Onaylanıyor..." : "Onayla"}
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
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="font-bold text-lg">Son Aktiviteler</h2>
                </div>
                <div className="p-6 space-y-4">
                  {stats?.activities?.slice(0, 8).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'user' ? 'bg-blue-500' : activity.type === 'shelter' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.entity_name}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(activity.created_at).toLocaleDateString("tr-TR")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
