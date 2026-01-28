
export interface Seasons {
  winter: number;
  spring: number;
  summer: number;
  fall: number;
}


export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    buttonBg: string;
    buttonText: string;
    cardBg: string;
  };
  typography: {
    fontFamily: string; // e.g., 'Playfair Display', 'Inter'
    headingSize: string; // e.g., 'text-4xl'
    bodySize: string; // e.g., 'text-base'
  };
  visuals: {
    backgroundImage?: string;
    overlayOpacity: number; // 0 to 1
    buttonShape: 'rounded' | 'square' | 'pill';
    gradientOverlay: boolean;
  };
  content: {
    tagline?: string;
    ctaText?: string;
    countdownTarget?: string; // ISO date string
    features?: string[];
  };
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  tag?: string;
  category: 'homme' | 'femme' | 'pack' | 'coffret';
  description?: string;
  notes?: string[];
  seasons?: Seasons;
  theme?: string; // Kept for backward compatibility (simple bg image)
  theme_config?: ThemeConfig;
}

export interface ProductCustomization {
  ringSize?: number;              // e.g., 6, 7, 8, 9, 10, 11, 12
  perfumeType?: string;            // 'miss-dior' | 'jadore' | 'la-vie-est-belle' | 'other'
  customPerfumeName?: string;      // Only if perfumeType === 'other'
  loveLetterEnabled?: boolean;     // Whether love letter was requested
  loveLetterRecipientName?: string; // Only if loveLetterEnabled === true
}

export interface CartItem extends Product {
  quantity: number;
  customization?: ProductCustomization; // Optional for backward compatibility
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  other_city?: string;
  address: string;
  cart_items: CartItem[];
  total_price: number;
  status: OrderStatus;
}

export interface SpecialOffer {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  summary: string;
  details?: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  applicable_products: string[];
  priority: number;
}
