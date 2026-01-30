/**
 * Supabase Database Service
 * Handles all database operations for invoices
 */

import { supabase } from '../supabase/client';

export const supabaseService = {
  /**
   * Save a new invoice
   */
  async saveInvoice(invoiceData) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          template_id: invoiceData.templateId || 1,
          currency: invoiceData.currency,
          invoice_number: invoiceData.invoiceNumber,
          payment_date: invoiceData.paymentDate,
          invoice_for_name: invoiceData.invoiceForName,
          invoice_for_company: invoiceData.invoiceForCompany || null,
          transfer_method: invoiceData.transferMethod || null,
          transaction_id: invoiceData.transactionId || null,
          status: invoiceData.status || 'Pending',
          notes: invoiceData.notes || null,
          amount_in_words: invoiceData.amountInWords || null,
          discount: parseFloat(invoiceData.discount) || 0,
          subtotal: parseFloat(invoiceData.subtotal) || 0,
          total: parseFloat(invoiceData.total) || 0,
          line_items: invoiceData.lineItems || []
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving invoice:', error);
      throw error;
    }
  },

  /**
   * Get all invoices
   */
  async getAllInvoices() {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  },

  /**
   * Get a single invoice by ID
   */
  async getInvoiceById(id) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  },

  /**
   * Update an existing invoice
   */
  async updateInvoice(id, invoiceData) {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .update({
          template_id: invoiceData.templateId || 1,
          currency: invoiceData.currency,
          invoice_number: invoiceData.invoiceNumber,
          payment_date: invoiceData.paymentDate,
          invoice_for_name: invoiceData.invoiceForName,
          invoice_for_company: invoiceData.invoiceForCompany || null,
          transfer_method: invoiceData.transferMethod || null,
          transaction_id: invoiceData.transactionId || null,
          status: invoiceData.status || 'Pending',
          notes: invoiceData.notes || null,
          amount_in_words: invoiceData.amountInWords || null,
          discount: parseFloat(invoiceData.discount) || 0,
          subtotal: parseFloat(invoiceData.subtotal) || 0,
          total: parseFloat(invoiceData.total) || 0,
          line_items: invoiceData.lineItems || [],
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating invoice:', error);
      throw error;
    }
  },

  /**
   * Delete an invoice
   */
  async deleteInvoice(id) {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw error;
    }
  },

  /**
   * Search/filter invoices
   */
  async searchInvoices(filters) {
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.invoiceNumber) {
        query = query.ilike('invoice_number', `%${filters.invoiceNumber}%`);
      }

      if (filters.clientName) {
        query = query.ilike('invoice_for_name', `%${filters.clientName}%`);
      }

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching invoices:', error);
      throw error;
    }
  },

  /**
   * Get statistics
   */
  async getStatistics() {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('id, total, created_at');

      if (error) throw error;

      return {
        total: data?.length || 0,
        totalAmount: data?.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0) || 0,
        lastCreated: data?.length > 0 ? data[0].created_at : null
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  },

  /**
   * Get last invoice number
   */
  async getLastInvoiceNumber() {
    try {
      // Get all invoice numbers that start with GP-
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .ilike('invoice_number', 'GP-%')
        .order('invoice_number', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        // Find the highest numeric value from all GP-XXXX numbers
        let maxNumber = 0;
        for (const invoice of data) {
          const match = invoice.invoice_number.match(/GP-(\d+)/);
          if (match) {
            const number = parseInt(match[1], 10);
            if (number > maxNumber) {
              maxNumber = number;
            }
          }
        }
        return maxNumber;
      }

      return 0; // Start from 0 if no invoices found
    } catch (error) {
      console.error('Error getting last invoice number:', error);
      return 0;
    }
  },

  /**
   * Save invoice sequence number
   */
  async saveInvoiceSequence(number) {
    // For now, we'll track the last number in the database
    // You could create a separate table for sequences if needed
    console.log('Sequence number saved:', number);
    return true;
  }
};
