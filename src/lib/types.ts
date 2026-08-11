// ============================================================
// KaelThrift Type Definitions
// ============================================================

export type ProductCategory =
  | 'dresses'
  | 'tops'
  | 'jeans'
  | 'shoes'
  | 'bags'
  | 'accessories';

export type ProductCondition = 'New with tags' | 'Excellent' | 'Good';

export type ProductStatus = 'available' | 'reserved' | 'sold';

export interface ProductMeasurements {
  bust?: string;
  waist?: string;
  length?: string;
  hips?: string;
  inseam?: string;
  shoulders?: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  size: string;
  price: number;
  condition: ProductCondition;
  quantity: number;
  measurements: ProductMeasurements;
  description: string | null;
  status: ProductStatus;
  images: string[];
  sold_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductInsert = Omit<Product, 'id' | 'sku' | 'sold_at' | 'created_at' | 'updated_at'>;
export type ProductUpdate = Partial<ProductInsert>;

// Supabase Database type for type-safe client
export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'sku' | 'created_at' | 'updated_at' | 'sold_at'> & {
          id?: string;
          sku?: string;
          created_at?: string;
          updated_at?: string;
          sold_at?: string | null;
        };
        Update: Partial<Omit<Product, 'id' | 'sku' | 'created_at' | 'updated_at'>>;
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          product_id: string | null;
          created_at: string;
        };
        Insert: {
          event_type: string;
          product_id?: string | null;
        };
        Update: never;
      };
    };
  };
}

// Filter/Sort types for catalog
export interface ProductFilters {
  category?: ProductCategory | '';
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition | '';
  search?: string;
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc';

// Admin stats
export interface DashboardStats {
  total: number;
  available: number;
  soldThisWeek: number;
  reserved: number;
}
