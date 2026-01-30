/**
 * InvoiceList Page
 * Displays all invoices with view, edit, delete, filter, and search functionality
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabaseService } from '../supabase/database';
import './InvoiceList.css';

export default function InvoiceList() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [invoices, searchTerm, statusFilter, dateFrom, dateTo]);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getAllInvoices();
      setInvoices(data);
      setError(null);
    } catch (err) {
      console.error('Error loading invoices:', err);
      setError('Failed to load invoices. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...invoices];

    // Search by invoice number or client name
    if (searchTerm) {
      filtered = filtered.filter(inv =>
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.invoice_for_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter) {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(inv => new Date(inv.created_at) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(inv => new Date(inv.created_at) <= new Date(dateTo));
    }

    setFilteredInvoices(filtered);
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleEditInvoice = (invoiceId) => {
    navigate(`/edit/${invoiceId}`);
  };

  const handleDeleteClick = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await supabaseService.deleteInvoice(selectedInvoice.id);
      await loadInvoices();
      setShowDeleteModal(false);
      setSelectedInvoice(null);
      alert('Invoice deleted successfully!');
    } catch (err) {
      console.error('Error deleting invoice:', err);
      alert('Failed to delete invoice. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Paid': '#10b981',
      'Pending': '#f59e0b',
      'Not Paid': '#ef4444',
      'Due': '#f97316',
      'Overdue': '#dc2626',
      'Partial': '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return num.toLocaleString('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="invoice-list-page">
      <div className="list-header">
        <h1>Invoice List</h1>
        <Link to="/" className="btn btn-primary btn-new-create">
          + Create New Invoice
        </Link>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by invoice # or client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Not Paid">Not Paid</option>
            <option value="Due">Due</option>
            <option value="Overdue">Overdue</option>
            <option value="Partial">Partial</option>
          </select>
        </div>

        <div className="filter-group">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="filter-input"
          />
          <span className="date-separator">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="filter-input"
          />
        </div>

        <button onClick={applyFilters} className="btn btn-secondary">
          Apply Filters
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Loading invoices...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={loadInvoices} className="btn btn-secondary">
            Retry
          </button>
        </div>
      )}

      {/* Invoice Table */}
      {!loading && !error && (
        <>
          {filteredInvoices.length === 0 ? (
            <div className="empty-state">
              <p>No invoices found. Create your first invoice to get started!</p>
              <Link to="/" className="btn btn-primary">
                Create Invoice
              </Link>
            </div>
          ) : (
            <div className="table-container">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Client Name</th>
                    <th>Payment Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="invoice-number">{invoice.invoice_number}</td>
                      <td>
                        <div className="client-info">
                          <p className="client-name">{invoice.invoice_for_name}</p>
                          {invoice.invoice_for_company && (
                            <p className="client-company">{invoice.invoice_for_company}</p>
                          )}
                        </div>
                      </td>
                      <td>{formatDate(invoice.payment_date)}</td>
                      <td className="amount">
                        {invoice.currency} {formatCurrency(invoice.total)}
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td>{formatDate(invoice.created_at)}</td>
                      <td className="actions">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="action-btn view-btn"
                          title="View"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEditInvoice(invoice.id)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(invoice)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      {showViewModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invoice Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="invoice-detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Invoice Number:</span>
                  <span className="detail-value">{selectedInvoice.invoice_number}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Client Name:</span>
                  <span className="detail-value">{selectedInvoice.invoice_for_name}</span>
                </div>
                {selectedInvoice.invoice_for_company && (
                  <div className="detail-row">
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{selectedInvoice.invoice_for_company}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Payment Date:</span>
                  <span className="detail-value">{formatDate(selectedInvoice.payment_date)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Transfer Method:</span>
                  <span className="detail-value">{selectedInvoice.transfer_method || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Transaction ID:</span>
                  <span className="detail-value">{selectedInvoice.transaction_id || '-'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Status:</span>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(selectedInvoice.status) }}
                  >
                    {selectedInvoice.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value">
                    {selectedInvoice.currency} {formatCurrency(selectedInvoice.total)}
                  </span>
                </div>
                {selectedInvoice.notes && (
                  <div className="detail-row full-width">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{selectedInvoice.notes}</span>
                  </div>
                )}
                {selectedInvoice.amount_in_words && (
                  <div className="detail-row full-width">
                    <span className="detail-label">Amount in Words:</span>
                    <span className="detail-value">{selectedInvoice.amount_in_words}</span>
                  </div>
                )}
              </div>

              {selectedInvoice.line_items && selectedInvoice.line_items.length > 0 && (
                <div className="line-items-section">
                  <h3>Line Items</h3>
                  <div className="items-list">
                    {selectedInvoice.line_items.map((item, index) => (
                      <div key={index} className="item-row">
                        <span className="item-description">{item.description}</span>
                        <span className="item-price">
                          {selectedInvoice.currency} {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowViewModal(false)} className="btn btn-secondary">
                Close
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  handleEditInvoice(selectedInvoice.id);
                }}
                className="btn btn-primary"
              >
                Edit Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInvoice && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete invoice <strong>{selectedInvoice.invoice_number}</strong>?
              </p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
