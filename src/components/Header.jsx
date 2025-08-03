import React, { useState } from "react";
import "./Header.css";

const Header = ({ onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <span className="logo-icon">🏪</span>
          <span className="logo-text">LOCAL STORE</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <ul className="nav-list">
            <li>
              <a href="#shop" className="nav-link">
                SHOP
              </a>
            </li>
            <li>
              <a href="#categories" className="nav-link">
                CATEGORIES
              </a>
            </li>
            <li>
              <a href="#deals" className="nav-link">
                DEALS
              </a>
            </li>
            <li>
              <a href="#about" className="nav-link">
                ABOUT
              </a>
            </li>
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="header-actions">
          {user && <span className="user-info">Welcome, {user.username}!</span>}
          <button className="action-btn logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
          <button className="action-btn cart-btn">
            <span className="cart-icon">🛒</span>
            <span className="cart-text">CART</span>
            <span className="cart-count">0</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`nav-mobile ${isMenuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          <li>
            <a href="#shop" className="mobile-nav-link">
              SHOP
            </a>
          </li>
          <li>
            <a href="#categories" className="mobile-nav-link">
              CATEGORIES
            </a>
          </li>
          <li>
            <a href="#deals" className="mobile-nav-link">
              DEALS
            </a>
          </li>
          <li>
            <a href="#about" className="mobile-nav-link">
              ABOUT
            </a>
          </li>
          {user && (
            <li className="mobile-user-info">
              <span>Welcome, {user.username}!</span>
            </li>
          )}
          <li>
            <button
              className="mobile-nav-link logout-btn-mobile"
              onClick={handleLogout}>
              LOGOUT
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
