/**
 * Supabase Client Configuration
 * Handles connection to Supabase database
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL and Anon Key are required. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Database Schema SQL for Supabase
 * Run this in Supabase SQL Editor:
 *
 * -- Create invoices table
 * CREATE TABLE invoices (
 *   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *   template_id INTEGER DEFAULT 1,
 *   currency VARCHAR(10) DEFAULT '৳',
 *   invoice_number VARCHAR(50) UNIQUE NOT NULL,
 *   payment_date DATE NOT NULL,
 *   invoice_for_name VARCHAR(255) NOT NULL,
 *   invoice_for_company VARCHAR(255),
 *   transfer_method VARCHAR(100),
 *   transaction_id VARCHAR(255),
 *   status VARCHAR(50) DEFAULT 'Pending',
 *   notes TEXT,
 *   amount_in_words TEXT,
 *   discount DECIMAL(10, 2) DEFAULT 0,
 *   subtotal DECIMAL(10, 2) DEFAULT 0,
 *   total DECIMAL(10, 2) DEFAULT 0,
 *   line_items JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 *
 * -- Create index for faster queries
 * CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
 * CREATE INDEX idx_invoices_status ON invoices(status);
 * CREATE INDEX idx_invoices_created_at ON invoices(created_at DESC);
 *
 * -- Enable Row Level Security
 * ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
 *
 * -- Allow all operations (you can restrict later if needed)
 * CREATE POLICY "Enable all access for invoices" ON invoices
 *   FOR ALL
 *   USING (true)
 *   WITH CHECK (true);
 */
