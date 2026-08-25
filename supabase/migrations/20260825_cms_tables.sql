-- ====================================================================
-- ZAAD (زاد) LUXURY E-COMMERCE - CMS SCHEMA MIGRATION
-- Provider: Supabase PostgreSQL (Production-Ready & Fully Idempotent)
-- ====================================================================

-- 1. Ensure extensions exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CMS BLOCKS / SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.cms_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    subtitle_ar VARCHAR(255),
    headline_ar TEXT,
    body_ar TEXT,
    cta_text_ar VARCHAR(100),
    cta_link VARCHAR(255),
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. CMS MEDIA REGISTRY TABLE
CREATE TABLE IF NOT EXISTS public.cms_media (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    folder VARCHAR(50) DEFAULT 'general' NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_cms_blocks_key ON public.cms_blocks(key);
CREATE INDEX IF NOT EXISTS idx_cms_media_folder ON public.cms_media(folder);
CREATE INDEX IF NOT EXISTS idx_cms_media_created ON public.cms_media(created_at DESC);

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.cms_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;

-- 6. RLS POLICIES FOR CMS BLOCKS
DROP POLICY IF EXISTS "Public can view active cms_blocks" ON public.cms_blocks;
CREATE POLICY "Public can view active cms_blocks"
ON public.cms_blocks FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage cms_blocks" ON public.cms_blocks;
CREATE POLICY "Admins can manage cms_blocks"
ON public.cms_blocks FOR ALL
USING (
    public.is_admin() OR auth.role() = 'service_role'
)
WITH CHECK (
    public.is_admin() OR auth.role() = 'service_role'
);

-- 7. RLS POLICIES FOR CMS MEDIA
DROP POLICY IF EXISTS "Public can view cms_media" ON public.cms_media;
CREATE POLICY "Public can view cms_media"
ON public.cms_media FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage cms_media" ON public.cms_media;
CREATE POLICY "Admins can manage cms_media"
ON public.cms_media FOR ALL
USING (
    public.is_admin() OR auth.role() = 'service_role'
)
WITH CHECK (
    public.is_admin() OR auth.role() = 'service_role'
);

-- 8. SEED INITIAL MASTER CMS ROW
INSERT INTO public.cms_blocks (
    key,
    title_ar,
    subtitle_ar,
    headline_ar,
    body_ar,
    metadata,
    is_active,
    updated_at
) VALUES (
    'master_cms_settings',
    'إعدادات المحتوى الشامل (Master CMS)',
    'هوية ومحتوى الموقع المعتمد لدار زاد',
    'زاد... حيث يلتقي النقاء بالفخامة',
    'نظام إدارة المحتوى الشامل بدون كود',
    '{"initialized": true, "version": 1}'::jsonb,
    true,
    NOW()
)
ON CONFLICT (key) DO NOTHING;
