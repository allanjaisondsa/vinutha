import { useState } from 'react';
import './styles/Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={`${import.meta.env.BASE_URL}logo.jpg`} alt="The Resartz Studio" />
          <span>The Resartz Studio</span>
        </Link>

        {/* Hamburger Toggle */}
        <button className="navbar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>
          {user && <Link to="/dashboard" className="nav-link" onClick={closeMenu}>My Courses</Link>}
          {user?.role === 'admin' && <Link to="/admin" className="nav-link nav-admin" onClick={closeMenu}>Admin</Link>}
          
          <div className="navbar-actions-mobile">
            {user ? (
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>Login</Link>
            )}
          </div>
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">👋 {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
