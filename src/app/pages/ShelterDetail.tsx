import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PetCard } from "../components/PetCard";
import { MapPin, Phone, Mail, CheckCircle, Users, Calendar, ArrowLeft, AlertCircle, Shield } from "lucide-react";
import { api, type Shelter, type Pet } from "../lib/api";

export function ShelterDetail() {
  const { id } = useParams();
  const [shelter, setShelter] = useState<Shelter | null>(null);
  const [shelterPets, setShelterPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.shelters.get(id),
      api.pets.list({ ownerId: id, ownerType: "shelter" })
    ]).then(([s, pets]) => {
      setShelter(s);
      setShelterPets(pets);
      setLoading(false);
    }).catch(() => {
      setNotFound(true);
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
      <Footer />
    </div>
  );

  if (notFound || !shelter) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Barınak Bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız barınak mevcut değil.</p>
          <Link to="/shelters" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600">Barınaklara Dön</Link>
        </div>
      </div>
      <Footer />
    </div>
  );

  const coverImage = shelter.cover_image || shelter.coverImage;
  const totalPets = shelter.total_pets || shelter.totalPets || 0;
  const adoptedCount = shelter.adopted_count || shelter.adoptedCount || 0;
  const joinedDate = shelter.joined_date || shelter.joinedDate;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <div className="flex-1">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/shelters" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Barınaklara Dön
            </Link>
          </div>
        </div>

        <div className="relative h-80 bg-gray-200">
          <img src={coverImage || ''} alt={shelter.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-white">{shelter.name}</h1>
                {shelter.verified && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Doğrulanmış
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{shelter.city}{shelter.district && `, ${shelter.district}`}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4">Hakkında</h2>
                <p className="text-gray-700 leading-relaxed">{shelter.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-orange-500 mb-2">{totalPets}</div>
                  <div className="text-sm text-gray-600">Toplam Hayvan</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-green-500 mb-2">{adoptedCount}</div>
                  <div className="text-sm text-gray-600">Sahiplendirilen</div>
                </div>
                <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-200">
                  <div className="text-3xl font-bold text-blue-500 mb-2">{joinedDate ? new Date(joinedDate).getFullYear() : "-"}</div>
                  <div className="text-sm text-gray-600">Kuruluş Yılı</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Sahiplendirme İlanları</h2>
                  <span className="text-gray-600">{shelterPets.length} ilan</span>
                </div>
                {shelterPets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {shelterPets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Bu barınağın henüz aktif ilanı bulunmuyor</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 sticky top-24">
                <h3 className="text-lg font-bold mb-4">İletişim Bilgileri</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div><p className="text-sm text-gray-600 mb-1">Adres</p><p className="font-medium">{shelter.address}</p></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div><p className="text-sm text-gray-600 mb-1">Telefon</p><a href={`tel:${shelter.phone}`} className="font-medium text-orange-500 hover:text-orange-600">{shelter.phone}</a></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                    <div><p className="text-sm text-gray-600 mb-1">E-posta</p><a href={`mailto:${shelter.email}`} className="font-medium text-orange-500 hover:text-orange-600">{shelter.email}</a></div>
                  </div>
                  {joinedDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div><p className="text-sm text-gray-600 mb-1">Katılım Tarihi</p><p className="font-medium">{new Date(joinedDate).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}</p></div>
                    </div>
                  )}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Doğrulanmış Barınak</p>
                      <p className="text-xs text-blue-700 leading-relaxed">Bu barınak PetConnect tarafından doğrulanmış ve güvenilir bir kurumdur.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
