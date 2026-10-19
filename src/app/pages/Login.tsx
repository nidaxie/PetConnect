import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PawPrint, Mail, Lock, User as UserIcon, Phone, MapPin, Building, FileText, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export function Login() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    userType: "user" as "user" | "shelter",
    shelterName: "",
    shelterPhone: "",
    shelterAddress: "",
    shelterCity: "",
    shelterDistrict: "",
    shelterDescription: "",
    shelterCapacity: "",
    taxNumber: "",
  });

  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);

  useEffect(() => {
    api.meta.options()
      .then((options) => setCities(options.cities))
      .catch(() => setCities([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        navigate("/dashboard");
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          userType: formData.userType,
          shelterName: formData.shelterName,
          shelterPhone: formData.shelterPhone,
          shelterAddress: formData.shelterAddress,
          shelterCity: formData.shelterCity,
          shelterDistrict: formData.shelterDistrict,
          shelterDescription: formData.shelterDescription,
          shelterCapacity: formData.shelterCapacity,
          taxNumber: formData.taxNumber,
        });
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    setUploadedDocuments((current) => [...current, ...files.map(file => file.name)].slice(0, 5));
    event.target.value = "";
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`w-full ${formData.userType === "shelter" && !isLogin ? "max-w-4xl" : "max-w-md"}`}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <PawPrint className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? "Hoş Geldiniz" : "Hesap Oluştur"}
            </h2>
            <p className="text-gray-600">
              {isLogin ? "Hesabınıza giriş yapın" : "PetConnect'e katılın"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hesap Türü</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: "user" })}
                        className={`px-4 py-3 rounded-lg font-medium border-2 transition-colors ${
                          formData.userType === "user"
                            ? "border-orange-500 bg-orange-50 text-orange-600"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        👤 Bireysel
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, userType: "shelter" })}
                        className={`px-4 py-3 rounded-lg font-medium border-2 transition-colors ${
                          formData.userType === "shelter"
                            ? "border-orange-500 bg-orange-50 text-orange-600"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        🏠 Barınak
                      </button>
                    </div>
                  </div>

                  {formData.userType === "user" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Ad Soyad</label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="Ad Soyad"
                        />
                      </div>
                    </div>
                  )}

                  {formData.userType === "shelter" && (
                    <div className="space-y-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Building className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-blue-900 mb-1">Barınak Kaydı</h4>
                            <p className="text-sm text-blue-700">
                              Barınak olarak kayıt olmak için resmi belgelerinizi yüklemeniz gerekmektedir.
                              Başvurunuz incelendikten sonra onaylanacaktır.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Barınak Adı *</label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={formData.shelterName}
                              onChange={(e) => setFormData({ ...formData, shelterName: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Örn: İstanbul Pati Barınağı"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Yetkili Adı Soyadı *</label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Yetkili kişinin adı"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Telefon *</label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              required
                              value={formData.shelterPhone}
                              onChange={(e) => setFormData({ ...formData, shelterPhone: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="+90 XXX XXX XX XX"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Şehir *</label>
                          <select
                            required
                            value={formData.shelterCity}
                            onChange={(e) => setFormData({ ...formData, shelterCity: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          >
                            <option value="">Seçiniz</option>
                            {cities.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">İlçe *</label>
                          <input
                            type="text"
                            required
                            value={formData.shelterDistrict}
                            onChange={(e) => setFormData({ ...formData, shelterDistrict: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="İlçe adı"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Adres *</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <textarea
                              required
                              rows={2}
                              value={formData.shelterAddress}
                              onChange={(e) => setFormData({ ...formData, shelterAddress: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                              placeholder="Tam adres"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Kapasite</label>
                          <input
                            type="number"
                            value={formData.shelterCapacity}
                            onChange={(e) => setFormData({ ...formData, shelterCapacity: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Toplam hayvan kapasitesi"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Vergi Numarası</label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={formData.taxNumber}
                              onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              placeholder="Opsiyonel"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Barınak Hakkında</label>
                          <textarea
                            rows={3}
                            value={formData.shelterDescription}
                            onChange={(e) => setFormData({ ...formData, shelterDescription: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            placeholder="Barınağınız hakkında kısa bilgi..."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Resmi Belgeler</label>
                        <input
                          id="shelter-documents"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          multiple
                          onChange={handleDocumentUpload}
                          className="hidden"
                        />
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <p className="text-sm text-gray-600 mb-3">
                            Ruhsat, dernek tescil belgesi veya resmi kurum onay belgesi yükleyin
                          </p>
                          <button
                            type="button"
                            onClick={() => document.getElementById("shelter-documents")?.click()}
                            className="px-4 py-2 bg-orange-100 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                          >
                            Belge Yükle
                          </button>
                        </div>
                        {uploadedDocuments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                                <span className="text-sm text-gray-700">📄 {doc}</span>
                                <button type="button" onClick={() => removeDocument(index)} className="text-red-500 hover:text-red-700">
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-2">En az 8 karakter içermelidir</p>
                )}
              </div>

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                    <span className="text-gray-600">Beni hatırla</span>
                  </label>
                  <a href="#" className="text-orange-500 hover:text-orange-600">Şifremi unuttum</a>
                </div>
              )}

              {!isLogin && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" required className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 mt-0.5" />
                    <span className="text-sm text-gray-700">
                      <Link to="/terms" className="text-orange-500 hover:text-orange-600 font-medium">Kullanım Koşulları</Link>
                      {" "}ve{" "}
                      <Link to="/privacy" className="text-orange-500 hover:text-orange-600 font-medium">Gizlilik Politikası</Link>
                      'nı okudum ve kabul ediyorum
                    </span>
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Lütfen bekleyin...</>
                ) : (
                  isLogin ? "Giriş Yap" : formData.userType === "shelter" ? "Barınak Başvurusu Gönder" : "Kayıt Ol"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Hesabınız yok mu?" : "Zaten hesabınız var mı?"}{" "}
                <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-orange-500 font-medium hover:text-orange-600">
                  {isLogin ? "Kayıt Ol" : "Giriş Yap"}
                </button>
              </p>
            </div>
          </div>

          {!isLogin && formData.userType === "shelter" && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
              <strong>ℹ️ Not:</strong> Barınak başvurunuz incelendikten sonra e-posta ile bilgilendirileceksiniz.
              Onay süreci genellikle 2-3 iş günü sürmektedir.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
