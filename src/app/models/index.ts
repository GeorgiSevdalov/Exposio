// User interface (from Supabase Auth)
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

// Base interface for common fields
export interface BaseRecord {
  id: string;
  title: string;
  description?: string;
  images: string[];
  created_by: string;
  created_at: string;
  likes: number;
  dislikes: number;
  comments: Comment[];
}

// Exposition interface
export interface Exposition extends BaseRecord {
}

// Sale Ad interface
export interface SaleAd extends BaseRecord {
  price: number;
}

// Comment interface for JSONB structure
export interface Comment {
  id: string;
  user_id: string;
  username: string;
  comment: string;
  created_at: string;
}

// DTOs for creating/updating records
export interface CreateExpositionDto {
  title: string;
  description?: string;
  images: string[];
}

export interface UpdateExpositionDto {
  title?: string;
  description?: string;
  images?: string[];
}

export interface CreateSaleAdDto {
  title: string;
  description?: string;
  images: string[];
  price: number;
}

export interface UpdateSaleAdDto {
  title?: string;
  description?: string;
  images?: string[];
  price?: number;
}

// Response interfaces
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

// Auth related interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}