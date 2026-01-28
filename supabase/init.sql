-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read-only access" ON public.products
    FOR SELECT USING (true);

-- Allow public write access (for development/simple admin dashboard)
-- CAUTION: In a production app with real auth, you'd restrict this to authenticated users.
CREATE POLICY "Allow public insert access" ON public.products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON public.products
    FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access" ON public.products
    FOR DELETE USING (true);

-- Initial Data (Sample)
INSERT INTO public.products (name, brand, price, original_price, images, tag, category, notes, seasons)
VALUES 
    ('Pack you intensely/my slf plus decant gratuit', 'AGFRAGRANCES', 240.00, NULL, ARRAY['https://picsum.photos/seed/perfume1/600/600'], NULL, 'pack', ARRAY['Cardamome', 'Lavande', 'Vanille'], '{"winter": 70, "spring": 40, "summer": 20, "fall": 60}'::jsonb),
    ('Pack strong with you/azzaro plus decant gratuit', 'AGFRAGRANCES', 240.00, NULL, ARRAY['https://picsum.photos/seed/perfume2/600/600'], NULL, 'pack', ARRAY['Cannelle', 'Tabac', 'Cèdre'], '{"winter": 80, "spring": 30, "summer": 10, "fall": 70}'::jsonb),
    ('Pack scandal/dior sauvage plus decant gratuit', 'AGFRAGRANCES', 240.00, NULL, ARRAY['https://picsum.photos/seed/perfume3/600/600'], NULL, 'pack', ARRAY['Bergamote', 'Poivre', 'Ambroxan'], '{"winter": 50, "spring": 70, "summer": 60, "fall": 50}'::jsonb),
    ('Pack spicebomb/ultramal plus decant gratuit', 'AGFRAGRANCES', 240.00, NULL, ARRAY['https://picsum.photos/seed/perfume4/600/600'], NULL, 'pack', ARRAY['Épices', 'Tabac', 'Cuir'], '{"winter": 90, "spring": 40, "summer": 10, "fall": 80}'::jsonb),
    ('Pack le male elixir/one million elixir plus decant gratuit', 'AGFRAGRANCES', 240.00, NULL, ARRAY['https://picsum.photos/seed/perfume5/600/600'], NULL, 'pack', ARRAY['Miel', 'Tabac', 'Fève Tonka'], '{"winter": 85, "spring": 40, "summer": 15, "fall": 70}'::jsonb),
    ('Coffret you intensely 100ML + 15ML', 'AGFRAGRANCES', 220.00, NULL, ARRAY['https://picsum.photos/seed/perfume6/600/600'], NULL, 'coffret', ARRAY['Poivre Rose', 'Sauge', 'Vanille'], '{"winter": 75, "spring": 50, "summer": 20, "fall": 65}'::jsonb),
    ('Coffret may way 100ML + 15ML', 'AGFRAGRANCES', 220.00, NULL, ARRAY['https://picsum.photos/seed/perfume7/600/600'], NULL, 'coffret', ARRAY['Fleur d''Oranger', 'Tubéreuse', 'Vanille'], '{"winter": 50, "spring": 80, "summer": 70, "fall": 60}'::jsonb),
    ('Coffret scandal 100ML + 15ML', 'AGFRAGRANCES', 220.00, 300.00, ARRAY['https://picsum.photos/seed/perfume8/600/600'], 'ECONOMISEZ 80.00 DH', 'coffret', ARRAY['Miel', 'Gardénia', 'Patchouli'], '{"winter": 80, "spring": 60, "summer": 30, "fall": 70}'::jsonb);
