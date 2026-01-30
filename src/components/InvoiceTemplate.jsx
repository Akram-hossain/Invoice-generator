/**
 * InvoiceTemplate Component
 * Renders the invoice template with data binding
 */

import './InvoiceTemplate.css';

// Add Google Fonts - Saira for headings, Inter for body
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Saira:wght@400;500;600;700&display=swap';
link.rel = 'stylesheet';
if (!document.head.querySelector(`link[href="${link.href}"]`)) {
  document.head.appendChild(link);
}

export default function InvoiceTemplate({ invoiceData }) {
  if (!invoiceData) {
    return <div className="invoice-template-loading">Loading template...</div>;
  }

  const {
    currency,
    invoiceNumber,
    paymentDate,
    invoiceForName,
    invoiceForCompany,
    transferMethod,
    transactionId,
    status,
    lineItems,
    subtotal,
    discount,
    total,
    notes,
    amountInWords
  } = invoiceData;

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    const formatted = numAmount.toLocaleString('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `${currency} ${formatted}`;
  };

  return (
    <div className="invoice-template-wrapper">
      <div className="invoice">
        {/* Decorative top header */}
        <div className="top-header">
          <img src="/src/assets/templates/images/top-header.svg" alt="header" />
        </div>

        {/* Decorative sidebar */}
        <div className="main-header">
          <img src="/src/assets/templates/images/sidebar.svg" alt="sidebar" />
        </div>

        {/* Main Content */}
        <div className="invoice-content">
          {/* Company Header */}
          <div className="company-header">
            <div className="logo-section">
              <img src="/src/assets/templates/images/logo.svg" alt="Giopio Logo" className="company-logo" />
            </div>
            <div className="company-info">
              <p className="company-name">AR Happy House</p>
              <p>Jan E. Shaba Housing,</p>
              <p>Jamil Nagar, Bogura</p>
              <p>Phone: +88 01728 247398</p>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="invoice-title-section">
            <h1 className="invoice-title">Invoice</h1>
            <h2 className="payment-date">
              Payment Date: <span>{paymentDate}</span>
            </h2>
          </div>

          {/* Invoice Details Grid */}
          <div className="invoice-details-grid">
            <div className="detail-item">
              <p className="detail-label">Invoice for</p>
              <p className="detail-value">{invoiceForName}</p>
              {invoiceForCompany && <p className="detail-value">{invoiceForCompany}</p>}
            </div>

            <div className="detail-item">
              <p className="detail-label">Paid to</p>
              <p className="detail-value">Giopio</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Invoice #</p>
              <p className="detail-value">{invoiceNumber}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Transfer Method</p>
              <p className="detail-value">{transferMethod || '-'}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Transition ID</p>
              <p className="detail-value">{transactionId || '-'}</p>
            </div>

            <div className="detail-item">
              <p className="detail-label">Status</p>
              <p className="detail-value">{status || '-'}</p>
            </div>
          </div>

          {/* Description Table */}
          <div className="description-section">
            <div className="table-header">
              <div className="col-description">Description</div>
              <div className="col-price">Total price</div>
            </div>

            <div className="table-body">
              {lineItems && lineItems.length > 0 ? (
                lineItems.map((item, index) => (
                  <div key={index} className="table-row">
                    <div className="col-description">
                      <p className="item-description">{item.description}</p>
                    </div>
                    <div className="col-price">
                      <p className="item-price">{formatCurrency(item.price)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="table-row">
                  <div className="col-description">
                    <p className="item-description">No items</p>
                  </div>
                  <div className="col-price">
                    <p className="item-price">{formatCurrency(0)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary and Notes Container */}
          <div className="summary-notes-container">
            {/* Notes Section (Left) */}
            <div className="notes-section">
              <p className="notes-label">Notes:</p>
              <p className="notes-text">{notes}</p>
            </div>

            {/* Payment Summary (Right) */}
            <div className="payment-summary">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">{formatCurrency(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Discount</span>
                <span className="summary-value">- {formatCurrency(discount)}</span>
              </div>
              <div className="summary-row total-row">
                <span className="summary-label">Total</span>
                <span className="summary-value">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="additional-notes">
            <p><em>{amountInWords}</em></p>
          </div>

          {/* Signature Section */}
          <div className="signature-section">
            <div className="signature-box">
              <img src="/src/assets/templates/images/e-signature.svg" alt="Signature" className="signature-img" />
              <p className="signature-name">(Jakarea Parvez)</p>
              <p className="signature-title">CEO, Giopio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
