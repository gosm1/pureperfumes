-- Run this in your Supabase SQL Editor to add the missing column
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS theme TEXT;
