/**
 * Home Page
 * Invoice generation page with form and preview
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoiceForm } from '../hooks/useInvoiceForm';
import { supabaseService } from '../supabase/database';
import { exporter } from '../utils/exporter';
import InvoiceForm from '../components/InvoiceForm';
import PreviewPanel from '../components/PreviewPanel';
import TemplateModal from '../components/TemplateModal';
import '../App.css';

export default function Home() {
  const { id } = useParams(); // Get invoice ID from URL for editing
  const navigate = useNavigate();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [currentInvoiceData, setCurrentInvoiceData] = useState(null);
  const [loading, setLoading] = useState(!!id); // Loading if editing
  const [invoiceGenerated, setInvoiceGenerated] = useState(!!id); // Already generated if editing
  const [successMessage, setSuccessMessage] = useState(null); // Success notification
  const invoiceRef = useRef(null);

  const {
    formData,
    lineItems,
    totals,
    updateFormField,
    updateLineItem,
    addLineItem,
    removeLineItem,
    getInvoiceData,
    resetForm,
    setFormData,
    setLineItems,
    incrementInvoiceNumber
  } = useInvoiceForm();

  // Load invoice data if editing, or get next invoice number from Supabase
  useEffect(() => {
    const initializeInvoice = async () => {
      if (id) {
        await loadInvoiceForEdit(id);
      } else {
        // Creating new invoice - get next number from Supabase
        try {
          const lastNumber = await supabaseService.getLastInvoiceNumber();
          const nextNumber = lastNumber + 1;
          const invoiceNumber = `GP-${String(nextNumber).padStart(4, '0')}`;
          setFormData(prev => ({ ...prev, invoiceNumber }));
        } catch (error) {
          console.error('Error getting last invoice number:', error);
          // Fallback to localStorage if Supabase fails
          import('../utils/storage.js').then(({ storage }) => {
            const invoiceNumber = storage.getCurrentInvoiceNumber();
            setFormData(prev => ({ ...prev, invoiceNumber }));
          });
        }
      }
    };

    initializeInvoice();
  }, [id]);

  // Update preview on form changes
  useEffect(() => {
    const invoiceData = getInvoiceData();
    setCurrentInvoiceData(invoiceData);
  }, [formData, lineItems, totals]);

  const loadInvoiceForEdit = async (invoiceId) => {
    try {
      setLoading(true);
      const invoice = await supabaseService.getInvoiceById(invoiceId);

      if (invoice) {
        // Populate form with invoice data
        setFormData({
          currency: invoice.currency || '৳',
          invoiceNumber: invoice.invoice_number || '',
          paymentDate: invoice.payment_date || '',
          invoiceForName: invoice.invoice_for_name || '',
          invoiceForCompany: invoice.invoice_for_company || '',
          transferMethod: invoice.transfer_method || '',
          transactionId: invoice.transaction_id || '',
          status: invoice.status || 'Pending',
          notes: invoice.notes || '',
          amountInWords: invoice.amount_in_words || '',
          discount: invoice.discount || 0,
        });

        // Set line items
        if (invoice.line_items && Array.isArray(invoice.line_items)) {
          const items = invoice.line_items.map((item, index) => ({
            id: Date.now() + index,
            description: item.description || '',
            price: item.price || 0
          }));
          setLineItems(items.length > 0 ? items : [{ id: Date.now(), description: '', price: 0 }]);
        }

        setSelectedTemplate(invoice.template_id || 1);
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
      alert('Failed to load invoice. Redirecting to invoice list.');
      navigate('/invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async () => {
    // For now, always use template 1 (skip modal since there's only one template)
    // In future, if multiple templates exist, show the modal
    await handleSelectTemplate(1);
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleSelectTemplate = async (templateId) => {
    setSelectedTemplate(templateId);

    // Save the current invoice number to localStorage before generating
    const invoiceData = getInvoiceData();
    const invoiceNumber = invoiceData.invoiceNumber;

    // Extract the number from invoice number (GP-XXXX or GP-XXXXXXXX)
    const match = invoiceNumber.match(/GP-(\d+)/);
    if (match) {
      const currentNumber = parseInt(match[1], 10);

      // Save to localStorage for next time
      import('../utils/storage.js').then(({ storage }) => {
        storage.saveInvoiceNumber(currentNumber);
      });
    }

    invoiceData.templateId = templateId;

    try {
      let savedInvoice;
      if (id) {
        // Update existing invoice
        savedInvoice = await supabaseService.updateInvoice(id, invoiceData);
        showSuccessMessage(`Invoice updated successfully! Invoice #${invoiceData.invoiceNumber}`);
      } else {
        // Create new invoice
        savedInvoice = await supabaseService.saveInvoice(invoiceData);
        showSuccessMessage(`Invoice generated successfully! Invoice #${invoiceData.invoiceNumber} - Status: ${invoiceData.status}`);
        // Show export options after generating new invoice
        setInvoiceGenerated(true);
      }

      console.log('Invoice saved:', savedInvoice);
    } catch (error) {
      console.error('Error saving invoice:', error);
      showSuccessMessage('Failed to save invoice. Please try again.');
    }
  };

  const handleClearForm = () => {
    if (id) {
      // If editing, navigate back to list
      if (confirm('Discard changes and return to invoice list?')) {
        navigate('/invoices');
      }
    } else {
      // If creating new, clear form
      if (confirm('Are you sure you want to clear the form? All data will be lost.')) {
        resetForm();
      }
    }
  };

  const handleExportPDF = async (invoiceData) => {
    if (!invoiceRef.current) {
      alert('Invoice not ready for export. Please try again.');
      return;
    }

    const wrapper = invoiceRef.current.getInvoiceElement?.();
    if (!wrapper) {
      alert('Invoice element not found.');
      return;
    }

    const invoiceElement = wrapper.querySelector('.invoice');
    if (!invoiceElement) {
      alert('Invoice element not found.');
      return;
    }

    await exporter.exportPDF(invoiceElement, invoiceData);
  };

  const handleExportImage = async (invoiceData) => {
    if (!invoiceRef.current) {
      alert('Invoice not ready for export. Please try again.');
      return;
    }

    const wrapper = invoiceRef.current.getInvoiceElement?.();
    if (!wrapper) {
      alert('Invoice element not found.');
      return;
    }

    const invoiceElement = wrapper.querySelector('.invoice');
    if (!invoiceElement) {
      alert('Invoice element not found.');
      return;
    }

    await exporter.exportImage(invoiceElement, invoiceData, 'png');
  };

  const handleShare = async (invoiceData) => {
    if (!invoiceRef.current) {
      alert('Invoice not ready for sharing. Please try again.');
      return;
    }

    const wrapper = invoiceRef.current.getInvoiceElement?.();
    if (!wrapper) {
      alert('Invoice element not found.');
      return;
    }

    const invoiceElement = wrapper.querySelector('.invoice');
    if (!invoiceElement) {
      alert('Invoice element not found.');
      return;
    }

    return await exporter.sharePDF(invoiceElement, invoiceData);
  };

  if (loading) {
    return (
      <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
        <p>Loading invoice...</p>
      </div>
    );
  }

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className="success-notification">
          <div className="success-content">
            <span className="success-icon">✓</span>
            <span className="success-text">{successMessage}</span>
            <button
              className="success-close"
              onClick={() => setSuccessMessage(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="app-container">
        <InvoiceForm
          formData={formData}
          lineItems={lineItems}
          totals={totals}
          onFormFieldChange={updateFormField}
          onLineItemChange={updateLineItem}
          onAddLineItem={addLineItem}
          onRemoveLineItem={removeLineItem}
          onGenerateInvoice={handleGenerateInvoice}
          onClearForm={handleClearForm}
        />

        <PreviewPanel
          ref={invoiceRef}
          invoiceData={currentInvoiceData}
          templateId={selectedTemplate}
          invoiceGenerated={invoiceGenerated}
          onExportPDF={handleExportPDF}
          onExportImage={handleExportImage}
          onShare={handleShare}
        />

        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </>
  );
}
