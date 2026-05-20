import { Link } from "react-router";
import { PawPrint, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center">
                <PawPrint className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PetConnect</span>
            </Link>
            <p className="text-sm text-gray-400">
              Evcil hayvanlar için güvenilir sahiplendirme ve çiftleştirme platformu.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-sm hover:text-orange-400 transition-colors">
                  İlanlar
                </Link>
              </li>
              <li>
                <Link to="/shelters" className="text-sm hover:text-orange-400 transition-colors">
                  Barınaklar
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm hover:text-orange-400 transition-colors">
                  Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-sm hover:text-orange-400 transition-colors">
                  Nasıl Çalışır?
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-orange-400 transition-colors">
                  SSS
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-orange-400 transition-colors">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@petconnect.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4" />
                <span>+90 212 555 0000</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2026 PetConnect. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}