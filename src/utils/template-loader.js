/**
 * Template Loader Utility
 * Handles loading and populating HTML templates with invoice data
 */

export const templateLoader = {
  currentTemplateId: 1,
  currentTemplate: null,
  currentCSS: null,

  async loadTemplate(templateId = 1) {
    try {
      // Load HTML template
      const htmlResponse = await fetch(`/src/assets/templates/template-${templateId}.html`);

      if (!htmlResponse.ok) {
        throw new Error(`Failed to load template: ${htmlResponse.status}`);
      }

      const templateHtml = await htmlResponse.text();

      // Load CSS
      const cssResponse = await fetch(`/src/assets/templates/template-${templateId}.css`);

      if (!cssResponse.ok) {
        console.warn(`Failed to load CSS for template ${templateId}`);
      }

      const css = cssResponse.ok ? await cssResponse.text() : '';

      this.currentTemplateId = templateId;
      this.currentTemplate = templateHtml;
      this.currentCSS = css;

      return { html: templateHtml, css };
    } catch (error) {
      console.error('Error loading template:', error);
      throw error;
    }
  },

  populateTemplate(templateHtml, invoiceData) {
    // Parse HTML and extract body content
    const parser = new DOMParser();
    const doc = parser.parseFromString(templateHtml, 'text/html');
    const bodyContent = doc.body.innerHTML;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = bodyContent;

    const currency = invoiceData.currency || '৳';

    // Fix image paths
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && src.startsWith('./images/')) {
        const imageName = src.replace('./images/', '');
        img.src = `/src/assets/templates/images/${imageName}`;
      }
    });

    const fields = tempDiv.querySelectorAll('[data-field]');

    fields.forEach(field => {
      const fieldName = field.getAttribute('data-field');
      const value = invoiceData[fieldName];

      if (value !== undefined && value !== null && value !== '') {
        if (field.hasAttribute('data-currency')) {
          field.textContent = this.formatCurrency(value, currency);
        } else {
          if (field.tagName === 'SPAN' || field.tagName === 'P' || field.tagName === 'EM' || field.tagName === 'DIV') {
            field.textContent = value;
          } else if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
            field.value = value;
          }
        }
      } else {
        if (field.tagName === 'SPAN' || field.tagName === 'P') {
          field.textContent = '-';
        }
      }
    });

    this.populateLineItems(tempDiv, invoiceData.lineItems || [], currency);

    return tempDiv.innerHTML;
  },

  populateLineItems(container, lineItems, currency) {
    const tableBody = container.querySelector('[data-field="lineItems"]');

    if (!tableBody) {
      console.warn('Line items container not found in template');
      return;
    }

    tableBody.innerHTML = '';

    lineItems.forEach(item => {
      const row = document.createElement('div');
      row.className = 'table-row';

      row.innerHTML = `
        <div class="col-description">
          <p class="item-description">${this.escapeHtml(item.description || '')}</p>
        </div>
        <div class="col-price">
          <p class="item-price">${this.formatCurrency(item.price || 0, currency)}</p>
        </div>
      `;

      tableBody.appendChild(row);
    });

    if (lineItems.length === 0) {
      const row = document.createElement('div');
      row.className = 'table-row';
      row.innerHTML = `
        <div class="col-description">
          <p class="item-description">No items</p>
        </div>
        <div class="col-price">
          <p class="item-price">${this.formatCurrency(0, currency)}</p>
        </div>
      `;
      tableBody.appendChild(row);
    }
  },

  formatCurrency(amount, currency) {
    const numAmount = parseFloat(amount) || 0;
    const formatted = numAmount.toLocaleString('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return `${currency} ${formatted}`;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  getAvailableTemplates() {
    return [
      { id: 1, name: 'Template 1', description: 'Giopio Style', file: 'template-1.html' }
    ];
  },

  async getFullHtml(invoiceData, templateId = 1) {
    try {
      await this.loadTemplate(templateId);
      const populatedContent = this.populateTemplate(this.currentTemplate, invoiceData);

      // Create complete HTML document with CSS injected
      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Jockey+One&display=swap" rel="stylesheet">
          <style>
            ${this.currentCSS}
            body {
              margin: 0;
              padding: 20px;
              background: #ffffff !important;
            }
          </style>
        </head>
        <body>
          ${populatedContent}
        </body>
        </html>
      `;

      return fullHtml;
    } catch (error) {
      console.error('Error getting full HTML:', error);
      throw error;
    }
  },

  async getExportHtml(invoiceData, templateId = 1) {
    try {
      await this.loadTemplate(templateId);
      return this.populateTemplate(this.currentTemplate, invoiceData);
    } catch (error) {
      console.error('Error getting export HTML:', error);
      throw error;
    }
  }
};
