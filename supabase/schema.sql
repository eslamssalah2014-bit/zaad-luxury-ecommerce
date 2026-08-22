-- ====================================================================
-- ZAAD (زاد) LUXURY E-COMMERCE - ENTERPRISE POSTGRESQL SCHEMA (REFACTORED)
-- Provider: Supabase PostgreSQL (Production-Ready & Fully Idempotent)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES (Idempotent creation via DO blocks)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'operations', 'customer_support', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'awaiting_verification', 'paid', 'preparing', 'packed', 'shipped', 'delivered', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('bank_transfer', 'instapay', 'vodafone_cash', 'mada_card', 'apple_pay');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('unpaid', 'proof_submitted', 'approved', 'rejected', 'reupload_requested');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE inventory_movement_type AS ENUM ('sale_reservation', 'sale_fulfillment', 'restock_batch', 'return_restock', 'damage_loss', 'audit_adjustment');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ====================================================================
-- 3. CORE TABLES DEFINITION
-- ====================================================================

-- 3.1 USERS & PROFILES TABLE (Direct 1-to-1 sync with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'customer' NOT NULL,
    avatar_url TEXT,
    vip_tier VARCHAR(50) DEFAULT 'Standard' NOT NULL,
    loyalty_points INTEGER DEFAULT 0 NOT NULL,
    total_spent NUMERIC(12, 2) DEFAULT 0.00 NOT NULL,
    orders_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.2 CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description_ar TEXT,
    image_url TEXT,
    sort_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.3 PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    tagline_ar VARCHAR(500),
    price NUMERIC(10, 2) NOT NULL,
    compare_at_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'SAR' NOT NULL,
    stock_quantity INTEGER DEFAULT 0 NOT NULL,
    reserved_stock INTEGER DEFAULT 0 NOT NULL,
    low_stock_threshold INTEGER DEFAULT 5 NOT NULL,
    weight_grams INTEGER DEFAULT 500 NOT NULL,
    origin_region_ar VARCHAR(255) NOT NULL,
    origin_region_en VARCHAR(255),
    floral_source_ar VARCHAR(255) NOT NULL,
    floral_source_en VARCHAR(255),
    short_desc_ar TEXT NOT NULL,
    full_story_ar TEXT NOT NULL,
    health_benefits_ar JSONB DEFAULT '[]'::jsonb NOT NULL,
    pairing_suggestions_ar JSONB DEFAULT '[]'::jsonb NOT NULL,
    storage_instructions_ar TEXT,
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    sensory_profile JSONB DEFAULT '{}'::jsonb NOT NULL,
    badge VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.4 PRODUCT BATCHES & LAB CERTIFICATION TABLE
CREATE TABLE IF NOT EXISTS public.product_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    batch_number VARCHAR(100) UNIQUE NOT NULL,
    harvest_season VARCHAR(100) NOT NULL,
    harvest_date DATE NOT NULL,
    tested_date DATE NOT NULL,
    lab_name VARCHAR(255) NOT NULL,
    moisture_percentage NUMERIC(4, 2) NOT NULL, -- Standard < 20%
    hmf_level NUMERIC(5, 2) NOT NULL,           -- Standard < 80 mg/kg
    diastase_activity NUMERIC(5, 2) NOT NULL,   -- Standard > 8
    sucrose_percentage NUMERIC(4, 2) NOT NULL,  -- Standard < 5%
    pollen_purity_percentage NUMERIC(5, 2) NOT NULL,
    certificate_pdf_url TEXT,
    lab_seal_image_url TEXT,
    initial_jars_count INTEGER NOT NULL,
    remaining_jars_count INTEGER NOT NULL,
    is_active_batch BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.5 ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    shipping_address JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    shipping_fee NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    luxury_gift_box_included BOOLEAN DEFAULT FALSE NOT NULL,
    luxury_gift_message TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'SAR' NOT NULL,
    status order_status DEFAULT 'pending' NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'unpaid' NOT NULL,
    tracking_number VARCHAR(255),
    courier_name VARCHAR(255),
    admin_notes TEXT,
    status_timeline JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.6 ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL,
    product_name_ar VARCHAR(255) NOT NULL,
    product_slug VARCHAR(255) NOT NULL,
    product_image TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total NUMERIC(10, 2) NOT NULL,
    weight_grams INTEGER NOT NULL
);

-- 3.7 PAYMENT PROOFS TABLE
CREATE TABLE IF NOT EXISTS public.payment_proofs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    receipt_image_url TEXT NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_phone VARCHAR(50),
    sender_bank VARCHAR(255),
    transaction_reference VARCHAR(255) NOT NULL,
    transfer_date DATE DEFAULT CURRENT_DATE NOT NULL,
    amount_transferred NUMERIC(10, 2) NOT NULL,
    status payment_status DEFAULT 'proof_submitted' NOT NULL,
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.8 INVENTORY MOVEMENTS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    batch_id UUID REFERENCES public.product_batches(id) ON DELETE SET NULL,
    movement_type inventory_movement_type NOT NULL,
    quantity_changed INTEGER NOT NULL,
    quantity_after INTEGER NOT NULL,
    reference_id VARCHAR(255),
    reason VARCHAR(500) NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.9 CUSTOMER ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(100) DEFAULT 'عنواني الملكي' NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    building_or_villa VARCHAR(255),
    postal_code VARCHAR(50),
    is_default BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.10 REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_avatar TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    comment_ar TEXT NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT TRUE NOT NULL,
    helpful_count INTEGER DEFAULT 0 NOT NULL,
    status review_status DEFAULT 'approved' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.11 WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- 3.12 COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    max_discount_amount NUMERIC(10, 2),
    usage_limit INTEGER,
    times_used INTEGER DEFAULT 0 NOT NULL,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.13 CMS BLOCKS TABLE
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

-- 3.14 AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role user_role NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(255) NOT NULL,
    details_ar TEXT NOT NULL,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.15 EMAIL LOGS TABLE
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_email VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL,
    subject_ar VARCHAR(255) NOT NULL,
    resend_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'delivered' NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb NOT NULL,
    sent_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3.16 NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    message_ar TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    link_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- 4. PERFORMANCE INDEXES (Complete & Optimized)
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_product_batches_batch_num ON public.product_batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_product_batches_product_id ON public.product_batches(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_status ON public.payment_proofs(status);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_order ON public.payment_proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_customer_addresses_user_id ON public.customer_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- ====================================================================
-- 5. HELPER SECURITY DEFINER FUNCTIONS (Accurate Role Extraction)
-- ====================================================================

-- Check if current authenticated user has administrative privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin', 'admin', 'operations'))
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role' IN ('super_admin', 'admin', 'operations'))
        OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operations')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current authenticated user is staff (including customer support)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        (auth.jwt() -> 'app_metadata' ->> 'role' IN ('super_admin', 'admin', 'operations', 'customer_support'))
        OR
        (auth.jwt() -> 'user_metadata' ->> 'role' IN ('super_admin', 'admin', 'operations', 'customer_support'))
        OR
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operations', 'customer_support')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================================
-- 6. ROW LEVEL SECURITY (RLS) - ENABLE ALL 16 TABLES
-- ====================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ====================================================================
-- 7. GRANULAR RLS POLICIES (Idempotent: Drop then Create)
-- ====================================================================

-- 7.1 USERS POLICIES
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id OR public.is_staff());

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Staff full access users" ON public.users;
CREATE POLICY "Staff full access users" ON public.users
    FOR ALL USING (public.is_staff());

-- 7.2 CATEGORIES POLICIES
DROP POLICY IF EXISTS "Public categories view" ON public.categories;
CREATE POLICY "Public categories view" ON public.categories
    FOR SELECT USING (is_active = true OR public.is_staff());

DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admin manage categories" ON public.categories
    FOR ALL USING (public.is_admin());

-- 7.3 PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public products view" ON public.products;
CREATE POLICY "Public products view" ON public.products
    FOR SELECT USING (is_available = true OR public.is_staff());

DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Admin manage products" ON public.products
    FOR ALL USING (public.is_admin());

-- 7.4 PRODUCT BATCHES POLICIES
DROP POLICY IF EXISTS "Public batches view" ON public.product_batches;
CREATE POLICY "Public batches view" ON public.product_batches
    FOR SELECT USING (is_active_batch = true OR public.is_staff());

DROP POLICY IF EXISTS "Admin manage batches" ON public.product_batches;
CREATE POLICY "Admin manage batches" ON public.product_batches
    FOR ALL USING (public.is_admin());

-- 7.5 ORDERS POLICIES (Secured: No guest data exposure)
DROP POLICY IF EXISTS "Customer view own orders" ON public.orders;
CREATE POLICY "Customer view own orders" ON public.orders
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND auth.uid() = customer_id)
        OR public.is_staff()
    );

DROP POLICY IF EXISTS "Allow order creation" ON public.orders;
CREATE POLICY "Allow order creation" ON public.orders
    FOR INSERT WITH CHECK (
        customer_id IS NULL OR auth.uid() = customer_id OR public.is_staff()
    );

DROP POLICY IF EXISTS "Staff manage orders" ON public.orders;
CREATE POLICY "Staff manage orders" ON public.orders
    FOR ALL USING (public.is_staff());

-- 7.6 ORDER ITEMS POLICIES
DROP POLICY IF EXISTS "Customer view own order items" ON public.order_items;
CREATE POLICY "Customer view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.customer_id = auth.uid() OR public.is_staff())
        )
    );

DROP POLICY IF EXISTS "Allow order items creation" ON public.order_items;
CREATE POLICY "Allow order items creation" ON public.order_items
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff manage order items" ON public.order_items;
CREATE POLICY "Staff manage order items" ON public.order_items
    FOR ALL USING (public.is_staff());

-- 7.7 PAYMENT PROOFS POLICIES
DROP POLICY IF EXISTS "Customer view own payment proof" ON public.payment_proofs;
CREATE POLICY "Customer view own payment proof" ON public.payment_proofs
    FOR SELECT USING (
        (auth.uid() IS NOT NULL AND auth.uid() = customer_id)
        OR public.is_staff()
    );

DROP POLICY IF EXISTS "Customer submit payment proof" ON public.payment_proofs;
CREATE POLICY "Customer submit payment proof" ON public.payment_proofs
    FOR INSERT WITH CHECK (
        customer_id IS NULL OR auth.uid() = customer_id OR public.is_staff()
    );

DROP POLICY IF EXISTS "Admin manage payment proofs" ON public.payment_proofs;
CREATE POLICY "Admin manage payment proofs" ON public.payment_proofs
    FOR ALL USING (public.is_admin());

-- 7.8 INVENTORY MOVEMENTS POLICIES
DROP POLICY IF EXISTS "Admin full access inventory movements" ON public.inventory_movements;
CREATE POLICY "Admin full access inventory movements" ON public.inventory_movements
    FOR ALL USING (public.is_admin());

-- 7.9 CUSTOMER ADDRESSES POLICIES
DROP POLICY IF EXISTS "Customer manage own addresses" ON public.customer_addresses;
CREATE POLICY "Customer manage own addresses" ON public.customer_addresses
    FOR ALL USING (auth.uid() = user_id OR public.is_staff())
    WITH CHECK (auth.uid() = user_id OR public.is_staff());

-- 7.10 REVIEWS POLICIES
DROP POLICY IF EXISTS "Public reviews view" ON public.reviews;
CREATE POLICY "Public reviews view" ON public.reviews
    FOR SELECT USING (status = 'approved' OR public.is_staff());

DROP POLICY IF EXISTS "Customer insert review" ON public.reviews;
CREATE POLICY "Customer insert review" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Admin manage reviews" ON public.reviews;
CREATE POLICY "Admin manage reviews" ON public.reviews
    FOR ALL USING (public.is_admin());

-- 7.11 WISHLISTS POLICIES
DROP POLICY IF EXISTS "Customer manage own wishlist" ON public.wishlists;
CREATE POLICY "Customer manage own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7.12 COUPONS POLICIES
DROP POLICY IF EXISTS "Public view active coupons" ON public.coupons;
CREATE POLICY "Public view active coupons" ON public.coupons
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;
CREATE POLICY "Admin manage coupons" ON public.coupons
    FOR ALL USING (public.is_admin());

-- 7.13 CMS BLOCKS POLICIES
DROP POLICY IF EXISTS "Public view active CMS blocks" ON public.cms_blocks;
CREATE POLICY "Public view active CMS blocks" ON public.cms_blocks
    FOR SELECT USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "Admin manage CMS blocks" ON public.cms_blocks;
CREATE POLICY "Admin manage CMS blocks" ON public.cms_blocks
    FOR ALL USING (public.is_admin());

-- 7.14 AUDIT LOGS POLICIES
DROP POLICY IF EXISTS "Admin view audit logs" ON public.audit_logs;
CREATE POLICY "Admin view audit logs" ON public.audit_logs
    FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Allow audit log insertion" ON public.audit_logs;
CREATE POLICY "Allow audit log insertion" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- 7.15 EMAIL LOGS POLICIES
DROP POLICY IF EXISTS "Admin view email logs" ON public.email_logs;
CREATE POLICY "Admin view email logs" ON public.email_logs
    FOR ALL USING (public.is_admin());

-- 7.16 NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id OR public.is_staff())
    WITH CHECK (auth.uid() = user_id OR public.is_staff());

-- ====================================================================
-- 8. AUTOMATIC AUTH USER PROFILE SYNC TRIGGER
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_app_meta_data->>'role')::public.user_role, 'customer')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
