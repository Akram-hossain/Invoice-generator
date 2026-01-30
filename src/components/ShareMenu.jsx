/**
 * ShareMenu Component
 * Displays share options for invoice PDF
 */

import './ShareMenu.css';

export default function ShareMenu({ isOpen, onClose, options, onShare }) {
  if (!isOpen || !options) return null;

  const handleOptionClick = async (option) => {
    onClose();
    const result = await option.action();
    onShare(result);
  };

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-menu" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <h3>Share Invoice</h3>
          <button className="share-close" onClick={onClose}>&times;</button>
        </div>

        <div className="share-options">
          {Object.entries(options).map(([key, option]) => (
            <button
              key={key}
              className="share-option"
              onClick={() => handleOptionClick(option)}
            >
              <span className="share-icon">{option.icon}</span>
              <span className="share-label">{option.name}</span>
            </button>
          ))}
        </div>

        <div className="share-footer">
          <p>Choose how you want to share this invoice</p>
        </div>
      </div>
    </div>
  );
}
