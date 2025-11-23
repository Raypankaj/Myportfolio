import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Ensure this path is correct
import './navigation.css';

function Navbar() {
  // --- STATE: Controls visibility and scroll tracking ---
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  // --- EFFECT: Handles the hide-on-scroll logic ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      // Visible if scrolling UP or near the top of the page (< 10px)
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    // If 'visible' is false, we add the 'hidden' class to slide it up
    <nav className={`navbar ${visible ? '' : 'hidden'}`}>
      
      {/* LEFT SIDE: Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img 
            src={logo} 
            alt="Logo" 
            className="logo-image" 
          />
        </Link>
      </div>

      {/* RIGHT SIDE: Navigation Links */}
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/skill">Skills</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        
        {/* Special Feature Links */}
        <li><Link to="/ai-answer" className="ai-link">AI Answer</Link></li>
        
        {/* Call to Action */}
        <li><Link to="/contact" className="cta-button">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;