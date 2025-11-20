import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
// import * as THREE from 'three'; // ⬅️ REMOVED: Unused library import
import './navigation.css';

function Navbar() {
  // --- STATE INITIALIZATION ---
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  // --- EFFECT: SCROLL HANDLER LOGIC ---
  useEffect(() => {
    // 1. Define the scroll handling function (optimized for clarity)
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const scrollingUp = prevScrollPos > currentScrollPos;

      // Ensure navbar is visible when scrolling up OR when at the very top
      setVisible(scrollingUp || currentScrollPos < 50);

      // Update the previous scroll position state for the next check
      setPrevScrollPos(currentScrollPos);
    };
    
    // NOTE: For better performance, consider wrapping handleScroll with a throttle function:
    // const throttledHandleScroll = throttle(handleScroll, 100); 

    // 2. Add and clean up the scroll event listener
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]); // Dependency array: Runs when prevScrollPos changes

  return (
    <nav className={`navbar ${visible ? '' : 'hidden'}`}>
      <div className="navbar-logo">
        <Link to="/">
          <img
            src={logo}
            alt="[Client/Your Name] Logo - Link to Homepage" // Added more alt text detail
            className="logo-image"
          />
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/about">About</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/skill">Skills</Link></li>
        <li><Link to="/ai-answer" className="ai-link">AI Answer</Link></li>
        {/* If the config page is not yet implemented, keep it commented or remove it */}
        {/* <li><Link to="/ai-config" className="ai-link">AI Config</Link></li> */}
        <li><Link to="/contact" className="cta-button">Contact</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;