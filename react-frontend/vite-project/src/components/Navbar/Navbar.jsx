import React, { useState } from "react";
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🍽️</span>
          <span className={styles.logoText}>FoodFindr</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className={styles.navLinks}>
          <a href="#home" className={styles.navLink}>Home</a>
          <a href="#search" className={styles.navLink}>Search</a>
          <a href="#favorites" className={styles.navLink}>Favorites</a>
          <a href="#about" className={styles.navLink}>About</a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuBtn}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Navigation Menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <a href="#home" className={styles.mobileNavLink} onClick={toggleMenu}>Home</a>
          <a href="#search" className={styles.mobileNavLink} onClick={toggleMenu}>Search</a>
          <a href="#favorites" className={styles.mobileNavLink} onClick={toggleMenu}>Favorites</a>
          <a href="#about" className={styles.mobileNavLink} onClick={toggleMenu}>About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;