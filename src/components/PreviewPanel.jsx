/**
 * PreviewPanel Component
 * Displays live invoice preview and export options
 */

import { useState, forwardRef, useImperativeHandle } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import ShareMenu from './ShareMenu';
import './PreviewPanel.css';

const PreviewPanel = forwardRef(({ invoiceData, templateId, invoiceGenerated, onExportPDF, onExportImage, onShare }, ref) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareOptions, setShareOptions] = useState(null);

  // Expose the invoice template element to parent
  useImperativeHandle(ref, () => ({
    getInvoiceElement: () => {
      return document.querySelector('.invoice-preview-container .invoice-template-wrapper');
    }
  }));

  const handleExportPDF = async () => {
    if (!invoiceData || isExporting) return;

    setIsExporting(true);
    try {
      await onExportPDF(invoiceData);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!invoiceData || isExporting) return;

    setIsExporting(true);
    try {
      await onExportImage(invoiceData);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    if (!invoiceData || isExporting) return;

    setIsExporting(true);
    try {
      const result = await onShare(invoiceData);

      // If result contains menu options, show them
      if (result.method === 'menu' && result.options) {
        setShareOptions(result.options);
        setShowShareMenu(true);
      }
    } catch (error) {
      console.error('Share failed:', error);
      alert('Failed to share invoice. Please try again.');
    } finally {
      if (!showShareMenu) {
        setIsExporting(false);
      }
    }
  };

  const handleShareOptionClick = (result) => {
    setIsExporting(false);
    setShowShareMenu(false);

    if (result.success) {
      console.log('Shared via:', result.method);
    }
  };

  const handleCloseShareMenu = () => {
    setShowShareMenu(false);
    setShareOptions(null);
    setIsExporting(false);
  };

  return (
    <div className="preview-panel">
      <div className="preview-header">
        <h2>Live Preview</h2>
        {invoiceGenerated && (
          <div className="preview-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExportPDF}
              disabled={isExporting || !invoiceData}
            >
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleExportImage}
              disabled={isExporting || !invoiceData}
            >
              {isExporting ? 'Exporting...' : 'Export Image'}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleShare}
              disabled={isExporting || !invoiceData}
            >
              {isExporting ? 'Preparing...' : 'Share'}
            </button>
          </div>
        )}
      </div>

      <div className="preview-content">
        {!invoiceData ? (
          <div className="preview-placeholder">
            <p>Fill in the form to see live preview</p>
          </div>
        ) : (
          <div className="invoice-preview-container">
            <InvoiceTemplate invoiceData={invoiceData} />
          </div>
        )}
      </div>

      <ShareMenu
        isOpen={showShareMenu}
        options={shareOptions}
        onClose={handleCloseShareMenu}
        onShare={handleShareOptionClick}
      />
    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;
