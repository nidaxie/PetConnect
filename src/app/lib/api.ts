const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Bir hata oluştu');
  return data as T;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (body: Record<string, string | boolean>) =>
      request<{ token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    me: () => request<{ user: User; shelter: Shelter | null }>('/auth/me'),
  },

  pets: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<Pet[]>(`/pets${qs}`);
    },
    get: (id: string) => request<Pet>(`/pets/${id}`),
    create: (body: Partial<Pet> & { images?: string[] }) =>
      request<Pet>('/pets', { method: 'POST', body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Pet> & { images?: string[] }) =>
      request<Pet>(`/pets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (id: string) => request<{ success: boolean }>(`/pets/${id}`, { method: 'DELETE' }),
    myListings: () => request<Pet[]>('/pets/user/my-listings'),
  },

  shelters: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<Shelter[]>(`/shelters${qs}`);
    },
    get: (id: string) => request<Shelter>(`/shelters/${id}`),
    update: (id: string, body: Partial<Shelter>) =>
      request<Shelter>(`/shelters/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  },

  favorites: {
    list: () => request<Pet[]>('/favorites'),
    add: (petId: string) => request<{ favorited: boolean }>(`/favorites/${petId}`, { method: 'POST' }),
    remove: (petId: string) => request<{ favorited: boolean }>(`/favorites/${petId}`, { method: 'DELETE' }),
    check: (petId: string) => request<{ favorited: boolean }>(`/favorites/check/${petId}`),
  },

  messages: {
    conversations: () => request<Conversation[]>('/messages/conversations'),
    getMessages: (convId: string) => request<Message[]>(`/messages/conversations/${convId}`),
    createConversation: (petId: string) =>
      request<{ id: string }>('/messages/conversations', { method: 'POST', body: JSON.stringify({ petId }) }),
    sendMessage: (convId: string, text: string) =>
      request<Message>(`/messages/conversations/${convId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ text }),
      }),
  },

  admin: {
    stats: () => request<AdminStats>('/admin/stats'),
    users: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<User[]>(`/admin/users${qs}`);
    },
    updateUser: (id: string, body: Partial<User>) =>
      request<User>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    shelters: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<Shelter[]>(`/admin/shelters${qs}`);
    },
    approveShelter: (id: string) =>
      request<{ success: boolean }>(`/admin/shelters/${id}/approve`, { method: 'PUT' }),
    rejectShelter: (id: string) =>
      request<{ success: boolean }>(`/admin/shelters/${id}/reject`, { method: 'PUT' }),
    listings: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request<Pet[]>(`/admin/listings${qs}`);
    },
    updateListing: (id: string, body: Record<string, unknown>) =>
      request<Pet>(`/admin/listings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    deleteListing: (id: string) =>
      request<{ success: boolean }>(`/admin/listings/${id}`, { method: 'DELETE' }),
  },

  contact: {
    submit: (body: { name: string; email: string; subject?: string; message: string }) =>
      request<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },
};

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'shelter' | 'admin';
  is_active?: number;
  created_at?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat';
  breed: string;
  age: number;
  gender: 'male' | 'female';
  city: string;
  description: string;
  listing_type: string;
  listingType?: string;
  health_status: string;
  healthStatus?: string;
  vaccinated: boolean;
  neutered: boolean;
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
  description: string;
  cover_image?: string;
  coverImage?: string;
  total_pets?: number;
  totalPets?: number;
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

export interface Conversation {
  id: string;
  petName: string;
  petId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  senderName?: string;
  timestamp: string;
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
