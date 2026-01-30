/**
 * NavBar Component
 * Top navigation bar for routing between pages
 */

import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

export default function NavBar() {
  const location = useLocation();

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
        </ul>
      </div>
    </nav>
  );
}
