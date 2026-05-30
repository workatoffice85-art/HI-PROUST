-- ==========================================================================
-- HI PROUST (هاي بروست) RESTAURANT SYSTEM - DATABASE SCHEMA SETUP
-- SQL script to create the orders table in Supabase.
-- Paste this script into your Supabase SQL Editor and click "Run".
-- ==========================================================================

-- 1. Create the orders database table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT NOT NULL PRIMARY KEY, -- Unique order code (e.g. P101, P102)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL, -- Auto date/time stamp
  table_number INT2 NOT NULL, -- Selected customer table (1 to 8)
  customer_name TEXT NOT NULL, -- Customer profile name
  phone_number TEXT NOT NULL, -- Customer verified mobile number
  items JSONB NOT NULL, -- JSON block storing bought food items array
  subtotal NUMERIC(10, 2) NOT NULL, -- Subtotal sum
  tax NUMERIC(10, 2) NOT NULL, -- VAT 15% tax
  total NUMERIC(10, 2) NOT NULL, -- Gross total amount
  notes TEXT, -- Special prep notes
  delivery_type TEXT NOT NULL, -- Delivery type: 'dine-in' or 'takeaway'
  status TEXT DEFAULT 'new'::text NOT NULL, -- Order status: 'new', 'preparing', 'ready', 'completed'
  payment_status TEXT DEFAULT 'unpaid'::text NOT NULL, -- Payment status: 'unpaid' or 'paid'
  payment_method TEXT, -- Payment method: 'cash', 'mada', 'apple' (nullable until paid)
  audit_log JSONB DEFAULT '[]'::jsonb -- Dynamic operational audit trail log array
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Create a public read/write policy for fast frictionless client prototypes
-- In production, restrict this based on authenticated users.
DROP POLICY IF EXISTS "Allow all public operations" ON public.orders;
CREATE POLICY "Allow all public operations"
ON public.orders
FOR ALL
USING (true)
WITH CHECK (true);

-- ==========================================================================
-- IMPORTANT CRITICAL STEP:
-- To enable real-time updates (Realtime Database Changes Sync):
-- 1. Go to your Supabase Sidebar.
-- 2. Navigate to Database -> Replication.
-- 3. Find the "supabase_realtime" publication and click "Edit".
-- 4. Toggle the active switch next to the "orders" table to ON (Active).
-- ==========================================================================

-- ==========================================================================
-- 4. DATABASE MIGRATION FOR MULTI-USER AUDIT TRAIL
-- Run this if your orders table is already created:
-- ==========================================================================
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS audit_log JSONB DEFAULT '[]'::jsonb;
NOTIFY pgrst, 'reload schema';

-- ==========================================================================
-- 5. CREATE CATEGORIES & PRODUCTS TABLES
-- ==========================================================================

-- A. Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT NOT NULL PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL
);

-- Enable RLS on categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Allow all operations for public prototypes
DROP POLICY IF EXISTS "Allow all public operations on categories" ON public.categories;
CREATE POLICY "Allow all public operations on categories"
ON public.categories
FOR ALL
USING (true)
WITH CHECK (true);

-- B. Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT NOT NULL PRIMARY KEY,
  category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_spicy BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow all operations for public prototypes
DROP POLICY IF EXISTS "Allow all public operations on products" ON public.products;
CREATE POLICY "Allow all public operations on products"
ON public.products
FOR ALL
USING (true)
WITH CHECK (true);

-- Seed default categories if empty
INSERT INTO public.categories (id, name_ar, name_en)
VALUES 
  ('broast', 'بروستد مقرمش', 'Crispy Broast'),
  ('burgers', 'برجر وميجا', 'Mighty Burgers'),
  ('buckets', 'وجبات عائلية', 'Family Buckets'),
  ('rice', 'الأرز والستربس', 'Rice & Strips'),
  ('sides', 'الصوصات والجانبيات', 'Sides & Sauces'),
  ('beverages', 'المشروبات المنعشة', 'Cold Drinks')
ON CONFLICT (id) DO NOTHING;

-- Seed default products if empty
INSERT INTO public.products (id, category_id, name_ar, name_en, description_ar, description_en, price, is_spicy, is_bestseller, image_url)
VALUES 
  ('br-01', 'broast', 'هاي بروستد عادي (٤ قطع)', 'Hi Broast Normal (4 Pcs)', '٤ قطع دجاج بروستد ذهبي مقرمش مع البطاطس، خبز، وثوميتنا الفاخرة', '4 pieces of golden crispy broast chicken served with fries, bun bread, and garlic dip', 24.00, false, true, NULL),
  ('br-02', 'broast', 'هاي بروستد حار سبايسي (٤ قطع)', 'Hi Broast Spicy (4 Pcs)', '٤ قطع دجاج بروستد مقرمش متبل بخلطتنا الحارة المشتعلة مع بطاطس وثومية', '4 pieces of fire-spicy crispy broast chicken served with golden fries and premium garlic dip', 25.00, true, true, NULL),
  ('bk-01', 'buckets', 'وجبة عائلية سوبر (٨ قطع)', 'Super Family Bucket (8 Pcs)', '٨ قطع دجاج مقرمش (عادي/حار) مع بطاطس حجم عائلي، 3 خبز كايزر، و٣ صوص ثومية', '8 pieces of crispy chicken with family-size fries, 3 buns, and 3 garlic sauce dips', 48.00, false, false, NULL),
  ('bk-02', 'buckets', 'وجبة عائلية ديلاكس (١٢ قطعة)', 'Deluxe Family Bucket (12 Pcs)', '١٢ قطعة دجاج مقرمش حار وعادي، بطاطس عائلي ضخم، 4 كايزر، كول سلو وصوصات منوعة', '12 pieces of crispy chicken, giant fries, 4 buns, large coleslaw, and mixed dipping sauces', 68.00, false, true, NULL),
  ('bg-01', 'burgers', 'ساندوتش دجاج كريسبي ميجا', 'Mighty Crispy Chicken Burger', 'صدر دجاج كريسبي مقلي عملاق مع خس، جبنة شيدر سائحة، مايونيز، وخبز البطاطس اللذيذ', 'Giant crispy chicken breast fillet with melted cheddar cheese, lettuce, mayo, in potato bun', 18.00, false, true, NULL),
  ('bg-02', 'burgers', 'ساندوتش فيليه دجاج سبايسي زinger', 'Hi Proust Spicy Zinger Fillet', 'فيليه دجاج مقلي مشتعل بالبهارات الحارة، هلابينو، جبنة شيدر، خس وصوص سبايسي مدمر', 'Fire-hot crispy chicken breast fillet with jalapenos, cheddar cheese, and spicy dyno sauce', 20.00, true, false, NULL),
  ('rc-01', 'rice', 'أرز ريزو مع قطع ستربس مقرمشة', 'Rizo Rice with Chicken Strips', 'طبق أرز مبهر على طريقة هاي بروست، مغطى بقطع الدجاج المقرمش وصوص باربكيو مدخن حلو', 'Premium spiced rice topped with crispy golden strips and a rich sweet & smoky BBQ sauce drizzle', 15.00, false, true, NULL),
  ('rc-02', 'rice', 'وجبة ستربس دجاج مقلي (٥ قطع)', 'Crispy Strips Meal (5 Pcs)', '٥ قطع أصابع دجاج فيليه مقرمشة خالية من العظم، بطاطس مقلية، كول سلو وثومية', '5 pieces of boneless crispy chicken breast strips served with golden fries and creamy coleslaw', 22.00, false, false, NULL),
  ('sd-01', 'sides', 'بطاطس مقلية ذهبية سوبر', 'Golden French Fries Super', 'أصابع بطاطس مقلية مقرمشة ومملحة بالتتبيلة السرية الخاصة بنا', 'Super crispy golden french fries tossed in our signature potato seasoning', 7.00, false, false, NULL),
  ('sd-02', 'sides', 'علبة ثومية هاي بروست إضافية', 'Extra Special Garlic Dip', 'صلصة الثوم الفاخرة والكثيفة المحضرة يومياً لتغليف قطع البروستد الساخنة', 'Our famous thick & creamy garlic sauce dip prepared fresh daily', 3.00, false, false, NULL),
  ('bv-01', 'beverages', 'بيبسي بارد ومنعش', 'Pepsi Cold & Refreshing', 'علبة بيبسي مثلجة لإطفاء حرارة قرمشة البروستد المشتعل', 'Ice-cold Pepsi can to perfectly balance your hot crispy broast meal', 4.00, false, false, NULL),
  ('bv-02', 'beverages', 'ماء نقي ومبرد', 'Pure Cold Water', 'زجاجة مياه معدنية طبيعية باردة', 'Refreshing bottled natural mineral water', 2.00, false, false, NULL)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================================
-- 6. CREATE SETTINGS TABLE (For restaurant parameters like active tables)
-- ==========================================================================

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT NOT NULL PRIMARY KEY,
  value TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow all public operations for prototypes
DROP POLICY IF EXISTS "Allow all public settings operations" ON public.settings;
CREATE POLICY "Allow all public settings operations"
ON public.settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Seed default total tables setting (12 tables)
INSERT INTO public.settings (key, value)
VALUES ('total_tables', '12')
ON CONFLICT (key) DO NOTHING;

-- 7. DATABASE MIGRATION FOR PENDING CUSTOMER EDITS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pending_update JSONB DEFAULT NULL;


