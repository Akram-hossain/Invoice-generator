/**
 * InvoiceForm Component
 * Main form for collecting invoice data
 */

import './InvoiceForm.css';

export default function InvoiceForm({
  formData,
  lineItems,
  totals,
  onFormFieldChange,
  onLineItemChange,
  onAddLineItem,
  onRemoveLineItem,
  onGenerateInvoice,
  onClearForm
}) {
  return (
    <div className="form-panel">
      <div className="form-header">
        <h1>Invoice Generator</h1>
        <p>Create and export professional invoices</p>
      </div>

      <form className="invoice-form" onSubmit={(e) => { e.preventDefault(); onGenerateInvoice(); }}>
        {/* Currency Settings */}
        <div className="form-section">
          <h3>Currency Settings</h3>
          <div className="form-group">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => onFormFieldChange('currency', e.target.value)}
              required
            >
              <option value="৳">৳ (BDT - Bangladeshi Taka)</option>
              <option value="$">$ (USD - US Dollar)</option>
              <option value="€">€ (EUR - Euro)</option>
              <option value="£">£ (GBP - British Pound)</option>
              <option value="₹">₹ (INR - Indian Rupee)</option>
            </select>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="form-section">
          <h3>Invoice Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoiceNumber">Invoice Number</label>
              <input
                type="text"
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => onFormFieldChange('invoiceNumber', e.target.value)}
                placeholder="INV-001"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="paymentDate">Payment Date</label>
              <input
                type="date"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={(e) => onFormFieldChange('paymentDate', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="form-section">
          <h3>Client Information</h3>
          <div className="form-group">
            <label htmlFor="invoiceForName">Client Name</label>
            <input
              type="text"
              id="invoiceForName"
              value={formData.invoiceForName}
              onChange={(e) => onFormFieldChange('invoiceForName', e.target.value)}
              placeholder="Enter client name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="invoiceForCompany">Company/Organization</label>
            <input
              type="text"
              id="invoiceForCompany"
              value={formData.invoiceForCompany}
              onChange={(e) => onFormFieldChange('invoiceForCompany', e.target.value)}
              placeholder="Enter company name"
            />
          </div>
        </div>

        {/* Payment Information */}
        <div className="form-section">
          <h3>Payment Information</h3>
          <div className="form-group">
            <label htmlFor="transferMethod">Transfer Method</label>
            <select
              id="transferMethod"
              value={formData.transferMethod}
              onChange={(e) => onFormFieldChange('transferMethod', e.target.value)}
            >
              <option value="">Select Method</option>
              <option value="bKash">bKash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Check">Check</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="transactionId">Transaction ID (Optional)</label>
            <input
              type="text"
              id="transactionId"
              value={formData.transactionId}
              onChange={(e) => onFormFieldChange('transactionId', e.target.value)}
              placeholder="Enter transaction ID"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => onFormFieldChange('status', e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Not Paid">Not Paid</option>
              <option value="Due">Due</option>
              <option value="Overdue">Overdue</option>
              <option value="Partial">Partial</option>
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div className="form-section">
          <h3>Line Items</h3>
          {lineItems.map(item => (
            <div key={item.id} className="line-item">
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onLineItemChange(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div className="form-group">
                  <label>Total Price</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => onLineItemChange(item.id, 'price', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-remove-item"
                    onClick={() => onRemoveLineItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn-add-item" onClick={onAddLineItem}>
            + Add Item
          </button>
        </div>

        {/* Summary */}
        <div className="form-section">
          <h3>Summary</h3>
          <div className="form-group">
            <label htmlFor="discount">Discount</label>
            <input
              type="number"
              id="discount"
              value={formData.discount}
              onChange={(e) => onFormFieldChange('discount', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <h3>Additional Information</h3>
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <input
              type="text"
              id="notes"
              value={formData.notes}
              onChange={(e) => onFormFieldChange('notes', e.target.value)}
              placeholder="Payment terms, conditions, etc."
            />
          </div>
          <div className="form-group">
            <label htmlFor="amountInWords">Amount in Words</label>
            <input
              type="text"
              id="amountInWords"
              value={formData.amountInWords}
              onChange={(e) => onFormFieldChange('amountInWords', e.target.value)}
              placeholder="e.g., Five Thousand Taka Only"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClearForm}>
            Clear Form
          </button>
          <button type="submit" className="btn btn-primary">
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
}
