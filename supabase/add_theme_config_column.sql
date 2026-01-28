-- Add theme_config column for storing pack-specific theme settings
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{}'::jsonb;
