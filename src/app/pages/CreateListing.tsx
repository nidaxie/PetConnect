import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { cities, dogBreeds, catBreeds, type PetType, type ListingType, type Gender } from "../data/mockData";
import { Upload, X, CheckCircle } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function CreateListing() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    type: "" as PetType | "",
    breed: "",
    age: "",
    gender: "" as Gender | "",
    city: "",
    description: "",
    listingType: "" as ListingType | "",
    healthStatus: "",
    vaccinated: false,
    neutered: false,
  });
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate("/login");
  }, [isAuthenticated, authLoading, navigate]);

  const breeds = formData.type === "dog" ? dogBreeds : formData.type === "cat" ? catBreeds : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.pets.create({
        name: formData.name,
        type: formData.type as PetType,
        breed: formData.breed,
        age: parseInt(formData.age) as unknown as number,
        gender: formData.gender as Gender,
        city: formData.city,
        description: formData.description,
        listingType: formData.listingType,
        healthStatus: formData.healthStatus,
        vaccinated: formData.vaccinated,
        neutered: formData.neutered,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800'],
      } as Parameters<typeof api.pets.create>[0]);
      navigate("/dashboard/listings");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = () => {
    const mockImages = [
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
      "https://images.unsplash.com/photo-1573865526739-10c1dd69c13a?w=800",
      "https://images.unsplash.com/photo-1568572933382-74d440642117?w=800",
    ];
    if (images.length < 5) {
      setImages([...images, mockImages[images.length % mockImages.length]]);
    }
  };

  const removeImage = (index: number) => setImages(images.filter((_, i) => i !== index));

  if (authLoading) return (
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

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yeni İlan Oluştur</h1>
          <p className="text-gray-600">Hayvanınız için detaylı bir ilan oluşturun</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Temel Bilgiler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">İlan Türü *</label>
                <select required value={formData.listingType} onChange={(e) => setFormData({ ...formData, listingType: e.target.value as ListingType })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Seçiniz</option>
                  <option value="adoption">Sahiplendirme</option>
                  <option value="mating">Çiftleştirme</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">İsim *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Örn: Pamuk" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hayvan Türü *</label>
                <select required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as PetType, breed: "" })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Seçiniz</option>
                  <option value="dog">Köpek</option>
                  <option value="cat">Kedi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cins *</label>
                <select required value={formData.breed} onChange={(e) => setFormData({ ...formData, breed: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" disabled={!formData.type}>
                  <option value="">Seçiniz</option>
                  {breeds.map((breed) => <option key={breed} value={breed}>{breed}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Yaş *</label>
                <input type="number" required min="0" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Yaşını giriniz" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Cinsiyet *</label>
                <select required value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value as Gender })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Seçiniz</option>
                  <option value="male">Erkek</option>
                  <option value="female">Dişi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Şehir *</label>
                <select required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option value="">Seçiniz</option>
                  {cities.map((city) => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sağlık Durumu</label>
                <input type="text" value={formData.healthStatus} onChange={(e) => setFormData({ ...formData, healthStatus: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Örn: Sağlıklı" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Açıklama *</label>
              <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none" placeholder="Hayvanınız hakkında detaylı bilgi verin..." />
            </div>

            <div className="mt-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.vaccinated} onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })} className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                <span className="text-sm font-medium">Aşıları yapılmış</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.neutered} onChange={(e) => setFormData({ ...formData, neutered: e.target.checked })} className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500" />
                <span className="text-sm font-medium">Kısırlaştırılmış</span>
              </label>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Fotoğraflar</h2>
            <p className="text-sm text-gray-600 mb-4">En fazla 5 fotoğraf yükleyebilirsiniz (Demo: örnek görseller eklenir)</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square group">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={handleImageUpload} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-500 hover:bg-orange-50 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500">Yükle</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="button" onClick={() => navigate("/dashboard/listings")} className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
              İptal
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />İlan Oluşturuluyor...</>
              ) : (
                <><CheckCircle className="w-5 h-5" />İlanı Yayınla</>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
