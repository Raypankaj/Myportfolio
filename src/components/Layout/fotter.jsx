import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './fotter.css'; 

// --- HELPER COMPONENT: Typing Animation ---
const TypingMessage = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 75); 

      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return (
    <p className="animated-message">
      {displayedText}
      <span className="cursor-flash">|</span>
    </p>
  );
};

// --- MAIN FOOTER COMPONENT ---
function Footer() {
  const currentYear = new Date().getFullYear();
  const animationMessage = "Ready to build your next digital project?";

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Section 1: Call to Action with Animation */}
        <div className="footer-section footer-cta">
          <TypingMessage text={animationMessage} />
          <Link to="/contact" className="cta-link-btn">
            Let's Talk!
          </Link>
        </div>

        {/* Section 2: Quick Navigation */}
        <div className="footer-section footer-links-group">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Me</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/skill">Skills</Link></li>
            <li><Link to="/ai-answer">AI Answer</Link></li>
          </ul>
        </div>

        {/* Section 3: Contact Info & Socials */}
        <div className="footer-section footer-info">
          <h3>Contact</h3>
          <a href="tel:+919205905491" className="footer-phone">
            +91 9205905491
          </a>

          <div className="social-links">
            <a href="https://linkedin.com/in/pankajkumarray" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              GitHub
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              Twitter
            </a>
          </div>

          <div className="footer-copyright">
            <p>
              &copy; {currentYear} Pankaj Ray. All rights reserved.
              {/* Subtle Admin Link */}
              <span className="admin-access">
                 | <Link to="/admin">Admin</Link>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;