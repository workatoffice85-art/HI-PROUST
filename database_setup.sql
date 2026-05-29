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
  payment_method TEXT -- Payment method: 'cash', 'mada', 'apple' (nullable until paid)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Create a public read/write policy for fast frictionless client prototypes
-- In production, restrict this based on authenticated users.
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
