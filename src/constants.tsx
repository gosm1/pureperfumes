import { supabase } from './lib/supabase';
import { Product } from './types';


const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    name: 'Bleu Élégance',
    brand: 'Chanel',
    price: 150.00,
    originalPrice: undefined,
    images: ['/assets/hommes.jpg'],
    tag: 'BEST SELLER',
    category: 'homme',
    description: 'Un parfum boisé aromatique pour l\'homme qui défie les conventions.',
    notes: ['Citrus', 'Amber', 'Cedar'],
    seasons: { winter: 60, spring: 80, summer: 60, fall: 70 }
  },
  {
    id: 'mock-2',
    name: 'Vie Est Belle',
    brand: 'Lancome',
    price: 120.00,
    originalPrice: 140.00,
    images: ['/assets/femmes2.jpg'],
    category: 'femme',
    description: 'Un bouquet de fleurs nobles.',
    notes: ['Iris', 'Patchouli', 'Vanilla'],
    seasons: { winter: 50, spring: 90, summer: 40, fall: 60 }
  },
  {
    id: 'mock-3',
    name: 'Discovery Set',
    brand: 'Pure Perfumes',
    price: 250.00,
    originalPrice: 300.00,
    images: ['/assets/pak.jpg'],
    category: 'pack',
    description: 'La collection ultime pour découvrir nos meilleures essences.',
    notes: ['Mixed'],
    seasons: { winter: 50, spring: 50, summer: 50, fall: 50 }
  },
  {
    id: 'mock-4',
    name: 'Sauvage Spirit',
    brand: 'Dior',
    price: 140.00,
    originalPrice: 160.00,
    images: ['/assets/hommes.jpg'],
    category: 'homme',
    description: 'Une fraîcheur radicale, brute et noble à la fois.',
    notes: ['Bergamot', 'Pepper', 'Amberwood'],
    seasons: { winter: 70, spring: 70, summer: 50, fall: 80 }
  }
];

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Map Supabase fields to our Product type
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      brand: item.brand,
      price: Number(item.price),
      originalPrice: item.original_price ? Number(item.original_price) : undefined,
      images: item.images || [],
      tag: item.tag,
      category: item.category,
      description: item.description,
      notes: item.notes || [],
      seasons: item.seasons,
      theme: item.theme,
      theme_config: item.theme_config
    }));
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    return [];
  }
}

export const BRANDS = [
  'Jean Paul Gaultier', 'Xerjoff', 'Valentino', 'Acqua di Gio', 'Dior', 'YSL'
];
