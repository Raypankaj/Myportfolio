// src/pages/About/About.jsx - Final Touch-Up Version

import React from 'react';
import './About.css';
import profilePic from '../../../assets/profile.png';
import { Link } from 'react-router-dom';

function About() {
    // List of skills
    const skills = [
        { id: 'js-es6', name: 'Modern JavaScript (ES6+)' },
    { id: 'react-ctx', name: 'React & Redux/Context API' },
    { id: 'html-css', name: 'Responsive HTML & CSS (Sass, Tailwind)' },
    // ... add an ID for every skill
    ];

    return (
        // Accessibility: Added aria-labelledby to connect the heading to the section
        <section id="about" className="about-section" aria-labelledby="about-title">
            <h2 id="about-title" className="section-title">
                <span className="number"></span> About Me
            </h2>

            <div className="about-content">
                <div className="about-text-column">
                    {/* Content Enhanced for SEO and clarity */}
                    <p>
                        Hello! I'm **Pankaj Ray**, a results-driven **Frontend Web Developer** specializing in creating high-performance, **accessible digital experiences**. Based in [**ACTION: Fill in Your Location**], I thrive on turning complex UI/UX designs into pixel-perfect, seamless web applications.
                    </p>
                    <p>
                        My core focus is on **React development**, specializing in dynamic Single Page Applications (SPAs) and integrating them with robust **RESTful APIs**. My priority is ensuring **fast loading speeds** and **cross-browser compatibility** across all my projects.
                    </p>
                    <p>
                        I'm actively seeking challenging roles where I can leverage **modern JavaScript frameworks** and contribute to an innovative team. Let's build something scalable!
                    </p>

                    <h3 className="skills-heading">My Current Tech Stack:</h3>
                    <ul className="skills-list">
                        {skills.map((skill) => (
                            <li key={skill.id} className="skill-item">
                                <span className="skill-icon">▹</span> {skill.name}
                            </li>
                        ))}
                    </ul>
                {/* IMPROVEMENT: Clear Call to Action */}
                <div className="about-cta-buttons">
                    <Link to="/contact" className="contact-button cta-button secondary">
                        Get In Touch
                    </Link>
                </div>

            </div>

            <div className="about-image-column">
                <div className="profile-image-wrapper">
                    <img
                        src={profilePic}
                        alt="Pankaj Ray professional profile image"
                        className="profile-image"
                    />
                </div>
            </div>
        </div>
</section >
 );
}

export default About;