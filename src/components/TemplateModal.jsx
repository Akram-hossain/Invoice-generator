/**
 * TemplateModal Component
 * Modal for selecting invoice templates
 */

import './TemplateModal.css';

export default function TemplateModal({ isOpen, onClose, onSelectTemplate }) {
  if (!isOpen) return null;

  const templates = [
    { id: 1, name: 'Template 1', description: 'Giopio Style', image: '/src/assets/templates/images/template-1-thumb.png' }
  ];

  const handleSelect = (templateId) => {
    onSelectTemplate(templateId);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Select Invoice Template</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div className="modal-body">
          <div className="template-grid">
            {templates.map(template => (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleSelect(template.id)}
              >
                <div className="template-preview">
                  <img
                    src={template.image}
                    alt={template.name}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f0f0f0" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="20" fill="%23666"%3ETemplate 1%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
