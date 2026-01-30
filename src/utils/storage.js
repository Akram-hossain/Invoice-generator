/**
 * Storage Utility
 * Handles localStorage operations for invoice data
 */

const STORAGE_KEY = 'invoiceGenerator_invoices';
const INVOICE_SEQUENCE_KEY = 'invoiceGenerator_sequence';

export const storage = {
  getLastInvoiceNumber() {
    try {
      const sequence = localStorage.getItem(INVOICE_SEQUENCE_KEY);
      return sequence ? parseInt(sequence, 10) : 0;
    } catch (error) {
      console.error('Error reading invoice sequence:', error);
      return 0;
    }
  },

  saveInvoiceNumber(number) {
    try {
      localStorage.setItem(INVOICE_SEQUENCE_KEY, number.toString());
      return true;
    } catch (error) {
      console.error('Error saving invoice sequence:', error);
      return false;
    }
  },

  generateNextInvoiceNumber() {
    const lastNumber = this.getLastInvoiceNumber();
    const nextNumber = lastNumber + 1;
    this.saveInvoiceNumber(nextNumber);

    // Format as GP-0001, GP-0002, etc.
    return `GP-${String(nextNumber).padStart(4, '0')}`;
  },

  getCurrentInvoiceNumber() {
    const lastNumber = this.getLastInvoiceNumber();
    const currentNumber = lastNumber + 1;

    // Format as GP-0001, GP-0002, etc.
    return `GP-${String(currentNumber).padStart(4, '0')}`;
  },

  getAllInvoices() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from storage:', error);
      return [];
    }
  },

  getInvoiceById(invoiceId) {
    const invoices = this.getAllInvoices();
    return invoices.find(inv => inv.id === invoiceId) || null;
  },

  saveInvoice(invoiceData) {
    const invoices = this.getAllInvoices();

    const newInvoice = {
      id: this.generateId(),
      templateId: invoiceData.templateId || 1,
      data: invoiceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    invoices.push(newInvoice);
    this.saveToStorage(invoices);

    return newInvoice;
  },

  updateInvoice(invoiceId, invoiceData) {
    const invoices = this.getAllInvoices();
    const index = invoices.findIndex(inv => inv.id === invoiceId);

    if (index === -1) {
      console.warn('Invoice not found:', invoiceId);
      return false;
    }

    invoices[index].data = invoiceData;
    invoices[index].updatedAt = new Date().toISOString();
    this.saveToStorage(invoices);

    return true;
  },

  deleteInvoice(invoiceId) {
    const invoices = this.getAllInvoices();
    const filtered = invoices.filter(inv => inv.id !== invoiceId);

    if (filtered.length === invoices.length) {
      console.warn('Invoice not found:', invoiceId);
      return false;
    }

    this.saveToStorage(filtered);
    return true;
  },

  searchInvoices(criteria) {
    const invoices = this.getAllInvoices();

    return invoices.filter(invoice => {
      let match = true;

      if (criteria.invoiceNumber) {
        match = match && invoice.data.invoiceNumber?.toLowerCase().includes(criteria.invoiceNumber.toLowerCase());
      }

      if (criteria.clientName) {
        match = match && invoice.data.invoiceForName?.toLowerCase().includes(criteria.clientName.toLowerCase());
      }

      if (criteria.startDate) {
        match = match && new Date(invoice.createdAt) >= new Date(criteria.startDate);
      }

      if (criteria.endDate) {
        match = match && new Date(invoice.createdAt) <= new Date(criteria.endDate);
      }

      return match;
    });
  },

  getStatistics() {
    const invoices = this.getAllInvoices();

    return {
      total: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => {
        return sum + (parseFloat(inv.data.total) || 0);
      }, 0),
      lastCreated: invoices.length > 0 ? invoices[invoices.length - 1].createdAt : null
    };
  },

  exportToJSON() {
    const invoices = this.getAllInvoices();
    return JSON.stringify(invoices, null, 2);
  },

  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);

      if (!Array.isArray(data)) {
        throw new Error('Invalid format: expected array');
      }

      this.saveToStorage(data);
      return true;
    } catch (error) {
      console.error('Error importing invoices:', error);
      return false;
    }
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  },

  saveToStorage(invoices) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    } catch (error) {
      console.error('Error saving to storage:', error);
      if (error.name === 'QuotaExceededError') {
        alert('Storage quota exceeded. Please delete some old invoices.');
      }
    }
  },

  generateId() {
    return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};
