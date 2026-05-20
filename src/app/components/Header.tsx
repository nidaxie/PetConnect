import { Link, useLocation, useNavigate } from "react-router";
import { Heart, User, PawPrint, Home, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              PetConnect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                isActive("/") ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
            <Link
              to="/explore"
              className={`text-sm font-medium transition-colors ${
                isActive("/explore") ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              İlanlar
            </Link>
            <Link
              to="/shelters"
              className={`text-sm font-medium transition-colors ${
                isActive("/shelters") ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Barınaklar
            </Link>
            <Link
              to="/how-it-works"
              className={`text-sm font-medium transition-colors ${
                isActive("/how-it-works") ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Nasıl Çalışır?
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive("/dashboard") ? "text-orange-500" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Panelim
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard/favorites"
                  className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                  title="Favoriler"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name.split(" ")[0]}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-medium capitalize">
                          {user?.role === 'admin' ? 'Admin' : user?.role === 'shelter' ? 'Barınak' : 'Kullanıcı'}
                        </span>
                      </div>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                        <User className="w-4 h-4" /> Panelim
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                          <Settings className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
                <Link
                  to="/dashboard/create"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                >
                  İlan Ver
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:block">Giriş</span>
                </Link>
                <Link
                  to="/dashboard/create"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                >
                  İlan Ver
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
