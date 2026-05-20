export type PetType = "dog" | "cat";
export type ListingType = "adoption" | "mating";
export type Gender = "male" | "female";

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  gender: Gender;
  city: string;
  description: string;
  images: string[];
  listingType: ListingType;
  healthStatus: string;
  vaccinated: boolean;
  neutered: boolean;
  ownerId: string;
  ownerName: string;
  ownerType: "user" | "shelter";
  ownerPhone?: string;
  ownerEmail?: string;
  createdAt: string;
  featured?: boolean;
}

export interface Shelter {
  id: string;
  name: string;
  city: string;
  district?: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  coverImage: string;
  totalPets: number;
  adoptedCount: number;
  verified: boolean;
  joinedDate: string;
}

export const mockPets: Pet[] = [
  {
    id: "1",
    name: "Pamuk",
    type: "dog",
    breed: "Golden Retriever",
    age: 2,
    gender: "male",
    city: "İstanbul",
    description: "Çok sevecen ve oyuncu bir arkadaş. Çocuklarla harika geçiniyor.",
    images: ["https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800"],
    listingType: "adoption",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: true,
    ownerId: "shelter1",
    ownerName: "İstanbul Pati Barınağı",
    ownerType: "shelter",
    ownerPhone: "+90 212 555 0101",
    ownerEmail: "info@patibarinak.com",
    createdAt: "2026-03-20T10:00:00Z",
    featured: true,
  },
  {
    id: "2",
    name: "Minnoş",
    type: "cat",
    breed: "Scottish Fold",
    age: 1,
    gender: "female",
    city: "Ankara",
    description: "Sakin ve sevimli bir kedi. Apartman yaşamına uygun.",
    images: ["https://images.unsplash.com/photo-1573865526739-10c1dd69c13a?w=800"],
    listingType: "adoption",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: false,
    ownerId: "user1",
    ownerName: "Ayşe Yılmaz",
    ownerType: "user",
    ownerPhone: "+90 532 123 4567",
    ownerEmail: "ayse.yilmaz@email.com",
    createdAt: "2026-03-19T14:00:00Z",
    featured: true,
  },
  {
    id: "3",
    name: "Karabaş",
    type: "dog",
    breed: "Kangal",
    age: 3,
    gender: "male",
    city: "İzmir",
    description: "Bahçeli ev için uygun, koruma içgüdüsü güçlü.",
    images: ["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800"],
    listingType: "mating",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: false,
    ownerId: "user2",
    ownerName: "Mehmet Demir",
    ownerType: "user",
    ownerPhone: "+90 535 234 5678",
    ownerEmail: "mehmet.demir@email.com",
    createdAt: "2026-03-18T09:00:00Z",
  },
  {
    id: "4",
    name: "Luna",
    type: "cat",
    breed: "British Shorthair",
    age: 2,
    gender: "female",
    city: "Ankara",
    description: "Çok tatlı ve uysal bir kedi. İdeal bir yuva arıyoruz.",
    images: ["https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800"],
    listingType: "adoption",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: true,
    ownerId: "shelter2",
    ownerName: "Ankara Minik Patiler",
    ownerType: "shelter",
    ownerPhone: "+90 312 555 0202",
    ownerEmail: "info@minikpatiler.org",
    createdAt: "2026-03-17T11:00:00Z",
    featured: true,
  },
  {
    id: "5",
    name: "Max",
    type: "dog",
    breed: "Labrador",
    age: 4,
    gender: "male",
    city: "İstanbul",
    description: "Aktif ve enerjik, günlük uzun yürüyüşler gerektirir.",
    images: ["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800"],
    listingType: "mating",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: false,
    ownerId: "user3",
    ownerName: "Can Öztürk",
    ownerType: "user",
    ownerPhone: "+90 533 345 6789",
    ownerEmail: "can.ozturk@email.com",
    createdAt: "2026-03-16T15:00:00Z",
  },
  {
    id: "6",
    name: "Boncuk",
    type: "cat",
    breed: "Van Kedisi",
    age: 1,
    gender: "female",
    city: "Van",
    description: "Beyaz tüylü, farklı renk gözlü, çok özel bir arkadaş.",
    images: ["https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800"],
    listingType: "adoption",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: true,
    ownerId: "shelter3",
    ownerName: "Van Kedisi Koruma Merkezi",
    ownerType: "shelter",
    ownerPhone: "+90 432 555 0303",
    ownerEmail: "info@vankedi.org",
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "7",
    name: "Şila",
    type: "dog",
    breed: "Husky",
    age: 2,
    gender: "female",
    city: "İzmir",
    description: "Mavi gözlü güzellik, aktif bir aile arıyoruz.",
    images: ["https://images.unsplash.com/photo-1568572933382-74d440642117?w=800"],
    listingType: "adoption",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: true,
    ownerId: "shelter1",
    ownerName: "İstanbul Pati Barınağı",
    ownerType: "shelter",
    ownerPhone: "+90 212 555 0101",
    ownerEmail: "info@patibarinak.com",
    createdAt: "2026-03-14T12:00:00Z",
  },
  {
    id: "8",
    name: "Çıtır",
    type: "cat",
    breed: "Tekir",
    age: 1,
    gender: "male",
    city: "Bursa",
    description: "Sokaktan kurtarıldı, şimdi sıcak bir yuva arıyor.",
    images: ["https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800"],
    listingType: "adoption",
    healthStatus: "Sağlıklı",
    vaccinated: true,
    neutered: true,
    ownerId: "user4",
    ownerName: "Zeynep Kaya",
    ownerType: "user",
    ownerPhone: "+90 534 456 7890",
    ownerEmail: "zeynep.kaya@email.com",
    createdAt: "2026-03-13T16:00:00Z",
  },
];

export const mockShelters: Shelter[] = [
  {
    id: "shelter1",
    name: "İstanbul Pati Barınağı",
    city: "İstanbul",
    district: "Sarıyer",
    address: "Sarıyer Mahallesi, Pati Sokak No:5",
    phone: "+90 212 555 0101",
    email: "info@patibarinak.com",
    description: "2015 yılından beri faaliyet gösteren, 200+ hayvana ev sahipliği yapan modern barınak tesisi.",
    coverImage: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
    totalPets: 45,
    adoptedCount: 120,
    verified: true,
    joinedDate: "2015-06-15",
  },
  {
    id: "shelter2",
    name: "Ankara Minik Patiler",
    city: "Ankara",
    district: "Çankaya",
    address: "Çankaya Mahallesi, Sevgi Caddesi No:12",
    phone: "+90 312 555 0202",
    email: "info@minikpatiler.org",
    description: "Özellikle kedilere odaklanan, gönüllü destekli bir barınak.",
    coverImage: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800",
    totalPets: 32,
    adoptedCount: 85,
    verified: true,
    joinedDate: "2018-03-20",
  },
  {
    id: "shelter3",
    name: "Van Kedisi Koruma Merkezi",
    city: "Van",
    district: "İpekyolu",
    address: "İpekyolu Mahallesi, Van Gölü Caddesi No:8",
    phone: "+90 432 555 0303",
    email: "info@vankedi.org",
    description: "Van kedilerinin korunması ve çoğaltılmasına odaklı özel barınak.",
    coverImage: "https://images.unsplash.com/photo-1503777119540-ce54b422baff?w=800",
    totalPets: 28,
    adoptedCount: 52,
    verified: true,
    joinedDate: "2020-01-10",
  },
  {
    id: "shelter4",
    name: "İzmir Dostlar Barınağı",
    city: "İzmir",
    district: "Bornova",
    address: "Bornova Mahallesi, Umut Sokak No:18",
    phone: "+90 232 555 0404",
    email: "info@dostlar.com",
    description: "Köpeklere özel geniş oyun alanları olan, veteriner hizmeti sunan barınak.",
    coverImage: "https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800",
    totalPets: 38,
    adoptedCount: 95,
    verified: true,
    joinedDate: "2017-09-05",
  },
];

export const cities = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Van",
  "Mersin",
];

export const dogBreeds = [
  "Golden Retriever",
  "Labrador",
  "Kangal",
  "Husky",
  "German Shepherd",
  "Poodle",
  "Beagle",
  "Bulldog",
  "Melez",
];

export const catBreeds = [
  "Scottish Fold",
  "British Shorthair",
  "Van Kedisi",
  "Persian",
  "Tekir",
  "Siyam",
  "Maine Coon",
  "Melez",
];
