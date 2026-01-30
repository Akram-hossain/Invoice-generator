/**
 * App Component
 * Main application component with routing
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import InvoiceList from './pages/InvoiceList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/edit/:id" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
