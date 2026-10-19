import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || 'Bir hata oluştu';
    return Promise.reject(new Error(message));
  }
);

export const api = {
  auth: {
    login: (email: string, password: string) =>
      client.post<never, { token: string; user: User }>('/auth/login', { email, password }),
    register: (body: Record<string, string | boolean>) =>
      client.post<never, { token: string; user: User }>('/auth/register', body),
    me: () => client.get<never, { user: User; shelter: Shelter | null }>('/auth/me'),
  },

  pets: {
    list: (params?: Record<string, string>) =>
      client.get<never, Pet[]>('/pets', { params }),
    get: (id: string) =>
      client.get<never, Pet>(`/pets/${id}`),
    create: (body: Partial<Pet> & { images?: string[] }) =>
      client.post<never, Pet>('/pets', body),
    update: (id: string, body: Partial<Pet> & { images?: string[] }) =>
      client.put<never, Pet>(`/pets/${id}`, body),
    delete: (id: string) =>
      client.delete<never, { success: boolean }>(`/pets/${id}`),
    myListings: () =>
      client.get<never, Pet[]>('/pets/user/my-listings'),
  },

  shelters: {
    list: (params?: Record<string, string>) =>
      client.get<never, Shelter[]>('/shelters', { params }),
    get: (id: string) =>
      client.get<never, Shelter>(`/shelters/${id}`),
    update: (id: string, body: Partial<Shelter>) =>
      client.put<never, Shelter>(`/shelters/${id}`, body),
  },

  favorites: {
    list: () =>
      client.get<never, Pet[]>('/favorites'),
    add: (petId: string) =>
      client.post<never, { favorited: boolean }>(`/favorites/${petId}`),
    remove: (petId: string) =>
      client.delete<never, { favorited: boolean }>(`/favorites/${petId}`),
    check: (petId: string) =>
      client.get<never, { favorited: boolean }>(`/favorites/check/${petId}`),
  },

  admin: {
    stats: () =>
      client.get<never, AdminStats>('/admin/stats'),
    users: (params?: Record<string, string>) =>
      client.get<never, User[]>('/admin/users', { params }),
    updateUser: (id: string, body: Partial<User>) =>
      client.put<never, User>(`/admin/users/${id}`, body),
    shelters: (params?: Record<string, string>) =>
      client.get<never, Shelter[]>('/admin/shelters', { params }),
    approveShelter: (id: string) =>
      client.put<never, { success: boolean }>(`/admin/shelters/${id}/approve`),
    rejectShelter: (id: string) =>
      client.put<never, { success: boolean }>(`/admin/shelters/${id}/reject`),
    listings: (params?: Record<string, string>) =>
      client.get<never, Pet[]>('/admin/listings', { params }),
    updateListing: (id: string, body: Record<string, unknown>) =>
      client.put<never, Pet>(`/admin/listings/${id}`, body),
    deleteListing: (id: string) =>
      client.delete<never, { success: boolean }>(`/admin/listings/${id}`),
  },

  contact: {
    submit: (body: { name: string; email: string; subject?: string; message: string }) =>
      client.post<never, { success: boolean; message: string }>('/contact', body),
  },

  meta: {
    options: () =>
      client.get<never, MetaOptions>('/meta/options'),
    stats: () =>
      client.get<never, PublicStats>('/meta/stats'),
  },
};

export type PetType = 'dog' | 'cat';
export type ListingType = 'adoption' | 'mating';
export type Gender = 'male' | 'female';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'shelter' | 'admin';
  phone?: string;
  city?: string;
  avatar_url?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  age_unit?: 'month' | 'year';
  gender: Gender;
  color?: string;
  weight?: number;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  city: string;
  district?: string;
  description: string;
  listing_type: string;
  listingType?: string;
  health_status: string;
  healthStatus?: string;
  vaccinated: boolean;
  neutered: boolean;
  microchipped?: boolean;
  pedigree?: boolean;
  child_friendly?: boolean;
  pet_friendly?: boolean;
  contact_phone?: string;
  contact_email?: string;
  owner_id: string;
  owner_type: 'user' | 'shelter';
  ownerType?: string;
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  status: string;
  featured: boolean;
  view_count: number;
  images: string[];
  isFavorited?: boolean;
  createdAt?: string;
  created_at?: string;
}

export interface Shelter {
  id: string;
  user_id?: string;
  name: string;
  city: string;
  district?: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description: string;
  cover_image?: string;
  coverImage?: string;
  logo_url?: string;
  social_facebook?: string;
  social_instagram?: string;
  working_hours?: string;
  founded_year?: number;
  total_pets?: number;
  totalPets?: number;
  live_pets?: number;
  adopted_count?: number;
  adoptedCount?: number;
  capacity?: number;
  tax_number?: string;
  status?: string;
  verified: boolean;
  joined_date?: string;
  joinedDate?: string;
  applicant_name?: string;
  applicant_email?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalShelters: number;
  pendingShelters: number;
  totalListings: number;
  activeListings: number;
  totalAdoptions: number;
  activities: { id: number; type: string; action: string; entity_name: string; created_at: string }[];
}

export interface MetaOptions {
  cities: string[];
  breeds: Record<PetType, string[]>;
}

export interface PublicStats {
  totalAdoptions: number;
  activeListings: number;
  approvedShelters: number;
  activeUsers: number;
}
