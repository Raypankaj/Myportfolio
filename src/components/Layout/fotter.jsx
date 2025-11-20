// Footer.jsx - Final Touch-Up Version
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './fotter.css'; // Standard naming convention

// Helper component for the typing animation effect (No changes needed, it's efficient)
const TypingMessage = ({ text }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(prev => prev + text[index]);
                setIndex(prev => prev + 1);
            }, 75); 

            return () => clearTimeout(timeoutId);
        }
    }, [index, text]);

    return <p className="animated-message">{displayedText}<span className="cursor-flash">|</span></p>;
};


function Footer() {
    const currentYear = new Date().getFullYear(); 
    const animationMessage = "Ready to build your next digital project?";

    return (
        <footer className="footer-container">
            
            <div className="footer-content">
                
                {/* Section 1: Typing Animation Call-to-Action */}
                <div className="footer-cta">
                    <TypingMessage text={animationMessage} />
                    <Link to="/contact" className="cta-link-btn">
                        Let's Talk!
                    </Link>
                </div>

                {/* Section 2: Quick Links */}
                <div className="footer-links-group">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Me</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/skill">Skills</Link></li>
                        {/* Recommendation: Add links to the AI pages if they are to be included in the footer */}
                        {/* <li><Link to="/ai-answer">AI Answer</Link></li> */}
                    </ul>
                </div>

                {/* Section 3: Contact and Social Media */}
                <div className="footer-info">
                    {/* ➡️ IMPROVEMENT: Added tel: link for mobile access */}
                    <a href="tel:+919205905491" className="footer-phone-number">
                        +91 9205905491
                    </a>
                    
                    <div className="social-links">
                        {/* ➡️ ACTION: Replace href values with actual social media URLs */}
                        <a href="https://linkedin.com/in/pankajkumarray" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                            <i className="icon">in</i>
                        </a>
                        <a href="https://github.com/YOUR_ACTUAL_USERNAME" target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                            <i className="icon">Gh</i>
                        </a>
                        <a href="https://twitter.com/YOUR_ACTUAL_HANDLE" target="_blank" rel="noopener noreferrer" aria-label="X/Twitter Profile">
                            <i className="icon">X</i>
                        </a>
                    </div>
                    
                    <p className="footer-copyright">
                        &copy; {currentYear} Pankaj. All rights reserved.
                    </p>
                </div>
            </div>
            
        </footer>
    );
}

export default Footer;