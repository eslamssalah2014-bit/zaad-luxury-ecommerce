-- ====================================================================
-- ZAAD (زاد) LUXURY E-COMMERCE - PRODUCT BENEFITS & INSTRUCTIONS MIGRATION
-- Provider: Supabase PostgreSQL (Idempotent & Safe)
-- ====================================================================

-- 1. Ensure health_benefits_ar, usage_instructions_ar, and storage_instructions_ar exist on products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS usage_instructions_ar TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS storage_instructions_ar TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS health_benefits_ar JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS pairing_suggestions_ar JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS attributes JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tabs JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_shipping_message VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_vat_message VARCHAR(255);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS custom_trust_badge_text VARCHAR(255);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products(is_available);
