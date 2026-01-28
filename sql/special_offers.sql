-- Special Offers Table Schema
-- Add to your existing Supabase database

CREATE TABLE IF NOT EXISTS special_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Offer content
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    details TEXT,
    
    -- Activation control
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    -- Product eligibility (array of product IDs)
    applicable_products JSONB DEFAULT '[]'::jsonb,
    
    -- Display priority (higher = shown first if multiple active)
    priority INTEGER DEFAULT 0
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_special_offers_active ON special_offers(is_active, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_special_offers_priority ON special_offers(priority DESC);

-- Updated_at trigger (reusing existing function)
CREATE TRIGGER update_special_offers_updated_at
    BEFORE UPDATE ON special_offers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS policies
ALTER TABLE special_offers ENABLE ROW LEVEL SECURITY;

-- Public can only read active offers within date range
DROP POLICY IF EXISTS "Public read active offers" ON special_offers;
CREATE POLICY "Public read active offers" ON special_offers
    FOR SELECT 
    USING (
        is_active = true 
        AND NOW() >= start_date 
        AND NOW() <= end_date
    );

-- Authenticated users (admin) have full access
DROP POLICY IF EXISTS "Authenticated full access to offers" ON special_offers;
CREATE POLICY "Authenticated full access to offers" ON special_offers
    FOR ALL 
    USING (true);

-- Insert example Valentine offer
INSERT INTO special_offers (
    title, 
    summary, 
    details, 
    start_date, 
    end_date, 
    applicable_products,
    priority
) VALUES (
    'Offre Spéciale Saint-Valentin 💝',
    'Profitez de notre pack exclusif pour célébrer l''amour',
    'Ce pack inclut une sélection premium de parfums romantiques, un coffret cadeau élégant, et une carte personnalisée. Parfait pour surprendre votre moitié avec une fragrance inoubliable.

**Inclus dans le pack :**
- Parfum premium 30ml
- Bague ajustable
- Carte d''amour personnalisée
- Coffret cadeau luxueux

Offre valable jusqu''à la Saint-Valentin. Stocks limités.',
    '2026-01-28T00:00:00Z',
    '2026-02-14T23:59:59Z',
    '[]'::jsonb,  -- Empty = applies to all products, or specify IDs like: '["valentine-pack-2026"]'
    100
);

-- Verification queries
-- Check active offers right now
SELECT * FROM special_offers 
WHERE is_active = true 
AND NOW() BETWEEN start_date AND end_date
ORDER BY priority DESC;

-- Check all offers
SELECT 
    title,
    is_active,
    start_date,
    end_date,
    CASE 
        WHEN NOW() < start_date THEN 'Upcoming'
        WHEN NOW() > end_date THEN 'Expired'
        WHEN is_active THEN 'Active'
        ELSE 'Inactive'
    END as status
FROM special_offers
ORDER BY priority DESC, created_at DESC;
