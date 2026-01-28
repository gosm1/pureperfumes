import { supabase } from './supabase';
import { SpecialOffer } from '@/types';

/**
 * Fetch all active special offers that are currently valid
 */
export async function getActiveOffers(): Promise<SpecialOffer[]> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('special_offers')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('priority', { ascending: false });

    if (error) {
        console.error('Error fetching offers:', error);
        return [];
    }

    return data || [];
}

/**
 * Check if an offer is currently valid
 */
export function isOfferValid(offer: SpecialOffer): boolean {
    if (!offer.is_active) return false;

    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);

    return now >= startDate && now <= endDate;
}

/**
 * Check if a product is eligible for an offer
 */
export function isProductEligible(productId: string, offer: SpecialOffer): boolean {
    // Empty array means offer applies to all products
    if (!offer.applicable_products || offer.applicable_products.length === 0) {
        return true;
    }

    return offer.applicable_products.includes(productId);
}

/**
 * Get offer status badge
 */
export function getOfferStatus(offer: SpecialOffer): 'active' | 'upcoming' | 'expired' | 'inactive' {
    if (!offer.is_active) return 'inactive';

    const now = new Date();
    const startDate = new Date(offer.start_date);
    const endDate = new Date(offer.end_date);

    if (now < startDate) return 'upcoming';
    if (now > endDate) return 'expired';
    return 'active';
}
