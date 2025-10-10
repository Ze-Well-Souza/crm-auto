// Types para Image Library Module
export type StorageType = 'supabase' | 'url';
export type ImageCategory = 'logo' | 'banner' | 'product' | 'icon' | 'background' | 'other';
export type TemplateCategory = 'email' | 'social' | 'ad' | 'document' | 'other';

export interface ImageLibraryItem {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  storage_type: StorageType;
  storage_url: string;
  thumbnail_url?: string;
  file_size?: number;
  width?: number;
  height?: number;
  format?: string;
  category: ImageCategory;
  tags?: string[];
  collection_id?: string;
  usage_count: number;
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
