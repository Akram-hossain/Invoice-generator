/**
 * NavBar Component
 * Top navigation bar for routing between pages
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const location = useLocation();
  const { logout } = useAuth();

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? You will need to enter your password again to access the system.')) {
      logout();
      window.location.reload(); // Force reload to clear any cached state
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/">
            <h1>Giopio Invoice</h1>
          </Link>
        </div>

        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link
              to="/"
              className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Generate Invoice
            </Link>
          </li>
          <li className="navbar-item">
            <Link
              to="/invoices"
              className={`navbar-link ${location.pathname === '/invoices' ? 'active' : ''}`}
            >
              Invoice List
            </Link>
          </li>
          <li className="navbar-item navbar-item-button">
            <Link to="/" className="navbar-create-btn">
              + Create New
            </Link>
          </li>
          <li className="navbar-item navbar-item-button">
            <button className="navbar-exit-btn" onClick={handleExit}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
