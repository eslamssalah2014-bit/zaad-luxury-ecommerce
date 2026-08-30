-- ==============================================================================
-- DATABASE MIGRATION: Make origin_region_ar and origin_region_en nullable
-- ==============================================================================
-- Description: Drops NOT NULL constraints on origin_region_ar and origin_region_en
-- in the public.products table, setting default values to empty string ''.
-- ==============================================================================

-- 1. Alter origin_region_ar
ALTER TABLE IF EXISTS public.products 
  ALTER COLUMN origin_region_ar DROP NOT NULL,
  ALTER COLUMN origin_region_ar SET DEFAULT '';

-- 2. Alter origin_region_en
ALTER TABLE IF EXISTS public.products 
  ALTER COLUMN origin_region_en DROP NOT NULL,
  ALTER COLUMN origin_region_en SET DEFAULT '';

-- 3. Update any existing NULL or legacy values to empty string
UPDATE public.products 
SET 
  origin_region_ar = COALESCE(origin_region_ar, ''),
  origin_region_en = COALESCE(origin_region_en, '');
