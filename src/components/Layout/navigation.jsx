import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Your specific logo path
import './navigation.css'; // Your specific CSS file

function Navbar() {
  // --- STATE 1: Mobile Menu (Open/Closed) ---
  const [isOpen, setIsOpen] = useState(false);

  // --- STATE 2: Scroll Visibility ---
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  // --- LOGIC: Toggle the Mobile Menu ---
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // --- EFFECT: Handle Hide-on-Scroll ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // We show the navbar if:
      // 1. We are scrolling UP
      // 2. We are at the very top (< 10px)
      // 3. OR... The Mobile Menu is currently OPEN (Important fix!)
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10 || isOpen;

      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos, isOpen]); // Re-run if scroll or menu state changes

  return (
    <nav className={`navbar ${visible ? '' : 'hidden'}`}>
      
      {/* 1. LEFT SIDE: Logo */}
      <div className="navbar-logo">
        <Link to="/" onClick={() => setIsOpen(false)}> {/* Close menu if logo clicked */}
          <img 
            src={logo} 
            alt="Logo" 
            className="logo-image" 
          />
        </Link>
      </div>

      {/* 2. HAMBURGER ICON (Visible only on Mobile via CSS) */}
      <div 
        className={`hamburger ${isOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 3. RIGHT SIDE: Navigation Links */}
      {/* Dynamic Class: Adds 'active' when menu is open */}
      <ul className={`navbar-links ${isOpen ? 'active' : ''}`}>
        
        {/* We add onClick={toggleMenu} to EVERY link. 
            This ensures the mobile menu automatically closes 
            after you click a link. */}
            
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
        <li><Link to="/skill" onClick={toggleMenu}>Skills</Link></li>
        <li><Link to="/projects" onClick={toggleMenu}>Projects</Link></li>
        
        {/* Special Feature Links */}
        <li><Link to="/ai-answer" className="ai-link" onClick={toggleMenu}>AI Answer</Link></li>
        
        {/* Call to Action */}
        <li>
            <Link to="/contact" className="cta-button" onClick={toggleMenu}>
                Contact
            </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;