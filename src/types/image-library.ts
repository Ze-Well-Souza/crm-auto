// Types para Image Library Module
export type StorageType = 'supabase' | 'url';
export type ImageCategory = 'logo' | 'banner' | 'product' | 'icon' | 'background' | 'other';
export type TemplateCategory = 'email' | 'social' | 'ad' | 'document' | 'other';

export interface ImageLibraryItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  alt_text?: string;
  storage_type: StorageType;
  file_path?: string;
  external_url?: string;
  thumbnail_url?: string;
  file_size?: number;
  file_type?: string;
  width?: number;
  height?: number;
  category: ImageCategory;
  tags?: string[];
  dominant_colors?: any;
  collection_id?: string;
  is_favorite: boolean;
  is_public: boolean;
  usage_count: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ImageCollection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  thumbnail_url?: string;
  image_count: number;
  created_at: string;
  updated_at: string;
}

export interface ImageTemplate {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  template_data: Record<string, any>;
  category: TemplateCategory;
  thumbnail_url?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ImageUsageLog {
  id: string;
  image_id: string;
  user_id: string;
  used_in: string;
  context?: Record<string, any>;
  created_at: string;
}

export interface ImageFilters {
  category?: ImageCategory;
  collection_id?: string;
  tags?: string[];
  search?: string;
  storage_type?: StorageType;
}
