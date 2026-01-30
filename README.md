# Invoice Generator - React Application

A modern, client-side Invoice Generator web application built with React + Vite. Dynamically generates professional invoices from pre-designed HTML templates with live preview and export capabilities.

## 🚀 Features

- **Live Preview**: Real-time invoice preview as you fill in the form
- **Multiple Currencies**: Support for BDT, USD, EUR, GBP, INR
- **Template System**: Easy-to-extend HTML template architecture
- **PDF & PNG Export**: High-quality export using html2canvas and jsPDF
- **Local Storage**: All invoices saved to browser localStorage
- **Auto Calculations**: Automatic subtotal, discount, and total calculations
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern Stack**: Built with React + Vite for fast development

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Setup

```bash
# Navigate to the project directory
cd invoice-generator-react

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

### 1. Fill in Invoice Details

- **Currency Settings**: Select your preferred currency symbol
- **Invoice Details**: Auto-generated invoice number and payment date
- **Client Information**: Name and company/organization
- **Payment Information**: Transfer method and transaction ID
- **Line Items**: Add multiple items with description and price
- **Summary**: View auto-calculated totals
- **Notes**: Add payment terms and amount in words

### 2. View Live Preview

As you type, the invoice preview updates in real-time on the right side.

### 3. Generate Invoice

Click "Generate Invoice" to:
- Select a template
- Save to localStorage
- Enable export buttons

### 4. Export

- **Export PDF**: Download as PDF file
- **Export Image**: Download as PNG image

## 🏗️ Project Structure

```
invoice-generator-react/
├── src/
│   ├── components/          # React components
│   │   ├── InvoiceForm.jsx     # Main form component
│   │   ├── InvoiceForm.css
│   │   ├── PreviewPanel.jsx    # Preview and export component
│   │   ├── PreviewPanel.css
│   │   ├── TemplateModal.jsx   # Template selection modal
│   │   └── TemplateModal.css
│   ├── hooks/              # Custom React hooks
│   │   └── useInvoiceForm.js   # Form state management
│   ├── utils/              # Utility functions
│   │   ├── storage.js          # localStorage operations
│   │   ├── template-loader.js  # Template loading & population
│   │   └── exporter.js         # PDF/Image export
│   ├── assets/             # Static assets
│   │   └── templates/         # Invoice templates
│   │       ├── template-1.html
│   │       ├── template-1.css
│   │       └── images/
│   ├── App.jsx             # Main app component
│   ├── App.css
│   └── main.jsx            # Entry point
├── package.json
└── vite.config.js
```

## 🔧 Customization

### Adding New Templates

1. Create `template-2.html` in `src/assets/templates/`
2. Use `data-field` attributes for dynamic fields:
   ```html
   <p data-field="invoiceNumber">INV-001</p>
   <span data-field="total" data-currency>৳ 1,000</span>
   ```
3. Add to `TemplateModal.jsx`:
   ```jsx
   const templates = [
     { id: 1, name: 'Template 1', description: 'Giopio Style' },
     { id: 2, name: 'Template 2', description: 'Your Style' }
   ];
   ```

### Changing Fixed Company Info

Edit `src/assets/templates/template-1.html`:
```html
<div class="company-info">
    <p class="company-name">Your Company Name</p>
    <p>Your Address</p>
</div>
```

## 💾 Data Storage

All invoices are stored in browser localStorage with the key `invoiceGenerator_invoices`.

### Accessing Data

Open browser console:

```javascript
// Get all invoices
JSON.parse(localStorage.getItem('invoiceGenerator_invoices'))

// Clear all data
localStorage.removeItem('invoiceGenerator_invoices')
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

The optimized files will be in `dist/` directory.

### Deploy to Static Hosting

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Add deploy script to package.json
# "deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

### Environment Variables

Create `.env` file:
```
VITE_API_URL=your_api_url
```

Access in code: `import.meta.env.VITE_API_URL`

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **html2canvas** - HTML to canvas conversion
- **jsPDF** - PDF generation
- **CSS3** - Modern styling with Flexbox/Grid

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔮 Future Enhancements

- [ ] Multiple invoice templates
- [ ] Invoice history and management UI
- [ ] Edit saved invoices
- [ ] Email invoice directly
- [ ] Backend API integration
- [ ] User authentication
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Tax calculation per item
- [ ] Quantity-based line items

## 📄 License

Proprietary and confidential.

## 👥 Credits

Developed for AR Happy House
Template Design: Giopio Style

---

**Built with ❤️ using React + Vite**
