/**
 * Custom Hook: useInvoiceForm
 * Manages invoice form state and calculations
 */

import { useState, useEffect } from 'react';

export const useInvoiceForm = () => {
  const [formData, setFormData] = useState({
    currency: '৳',
    invoiceNumber: '',
    paymentDate: new Date().toISOString().split('T')[0],
    invoiceForName: '',
    invoiceForCompany: '',
    transferMethod: '',
    transactionId: '',
    status: 'Pending',
    notes: 'All payments are non refundable',
    amountInWords: '',
    discount: 0
  });

  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', price: 0 }
  ]);

  const [totals, setTotals] = useState({
    subtotal: 0,
    discount: 0,
    total: 0
  });

  // Calculate totals whenever line items or discount changes
  useEffect(() => {
    calculateTotals();
  }, [lineItems, formData.discount]);

  // Auto-update amount in words when total changes
  useEffect(() => {
    if (totals.total && parseFloat(totals.total) > 0) {
      const amountInWords = `In Words: ${numberToWords(parseFloat(totals.total))} Only.`;
      setFormData(prev => ({
        ...prev,
        amountInWords: amountInWords
      }));
    }
  }, [totals.total]);

  const generateInvoiceNumber = () => {
    // This function is kept for manual overrides if needed
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const invoiceNumber = `INV${timestamp}${random}`;

    setFormData(prev => ({
      ...prev,
      invoiceNumber
    }));
  };

  const incrementInvoiceNumber = () => {
    import('../utils/storage.js').then(({ storage }) => {
      const newInvoiceNumber = storage.generateNextInvoiceNumber(); // Now uses 4 digits
      setFormData(prev => ({
        ...prev,
        invoiceNumber: newInvoiceNumber
      }));
    });
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const discount = parseFloat(formData.discount) || 0;
    const total = Math.max(0, subtotal - discount);

    setTotals({
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    });
  };

  const updateFormField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLineItem = (id, field, value) => {
    setLineItems(prev => prev.map(item =>
      item.id === id
        ? { ...item, [field]: value }
        : item
    ));
  };

  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id), 0) + 1;
    setLineItems(prev => [...prev, { id: newId, description: '', price: 0 }]);
  };

  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id));
    } else {
      // Clear values if it's the last item
      setLineItems(prev => prev.map(item =>
        item.id === id
          ? { ...item, description: '', price: 0 }
          : item
      ));
    }
  };

  const getInvoiceData = () => {
    const validLineItems = lineItems.filter(
      item => item.description.trim() || (parseFloat(item.price) || 0) > 0
    );

    return {
      ...formData,
      lineItems: validLineItems,
      ...totals
    };
  };

  const resetForm = () => {
    import('../utils/storage.js').then(({ storage }) => {
      const invoiceNumber = storage.getCurrentInvoiceNumber(); // Now uses 4 digits
      setFormData({
        currency: '৳',
        invoiceNumber: invoiceNumber,
        paymentDate: new Date().toISOString().split('T')[0],
        invoiceForName: '',
        invoiceForCompany: '',
        transferMethod: '',
        transactionId: '',
        status: 'Pending',
        notes: 'All payments are non refundable',
        amountInWords: '',
        discount: 0
      });
    });

    setLineItems([{ id: 1, description: '', price: 0 }]);
  };

  return {
    formData,
    lineItems,
    totals,
    setFormData,
    setLineItems,
    updateFormField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    getInvoiceData,
    resetForm,
    incrementInvoiceNumber
  };
};

// Helper function to convert number to words
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  const convertLessThanThousand = (n) => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  const convert = (n) => {
    if (n === 0) return '';

    let result = '';

    if (Math.floor(n / 10000000) > 0) {
      result += convertLessThanThousand(Math.floor(n / 10000000)) + ' Crore ';
      n %= 10000000;
    }

    if (Math.floor(n / 100000) > 0) {
      result += convertLessThanThousand(Math.floor(n / 100000)) + ' Lakh ';
      n %= 100000;
    }

    if (Math.floor(n / 1000) > 0) {
      result += convertLessThanThousand(Math.floor(n / 1000)) + ' Thousand ';
      n %= 1000;
    }

    result += convertLessThanThousand(n);

    return result.trim();
  };

  return convert(num);
}
