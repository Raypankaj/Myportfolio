// src/pages/Home/Home.jsx - Final Touch-Up Version

import React from 'react';
import './Home.css';
// import { motion } from 'framer-motion'; // Example animation library import
import profilePic from '../../../assets/profile.png'; // Ensure the path is correct

function Home() {
    return (
        // ➡️ IMPROVEMENT: Semantic structure is good. Added an explicit aria-label for accessibility.
        <section id="home" className="home-section" aria-label="Introduction and Hero Section">
            <div className="home-content">
                {/* The Text Block (Left/Top Column) */}
                <div className="text-container">
                    <p className="greeting">Hi, my name is</p>
                    {/* ➡️ SEO/Clarity: Enhanced name for better keyword recognition */}
                    <h1 className="name">Pankaj Ray.</h1>
                    <h2 className="tagline">I build animated and accessible web experiences.</h2>
                    <p className="description">
                        {/* ➡️ Clear Value Proposition: Highlighted core skills */}
                        I'm a Frontend Developer specializing in modern React applications. Currently, I'm focused on
                        delivering high-performance, user-centric products and highly polished interfaces.
                    </p>
                    
                    {/* ➡️ CTA Improvement: Ensure the link is functional */}
                    {/* Use Link component if linking internally, or a standard <a> tag for hash links */}
                    <a href="http://localhost:5173/projects#/projects" className="cta-button">
                        View My Work
                    </a>
                </div>

                {/* The Visual/Animation Block (Right/Bottom Column) */}
                <div className="animation-container">
                    {/* ➡️ Image Tagging: Moved the image into its dedicated container for better layout control */}
                    <img
                        src={profilePic}
                        // ➡️ SEO/Accessibility: Enhanced alt text
                        alt="Pankaj Ray - Frontend Developer Profile Photo" 
                        className="hero-profile-image"
                    />
                    {/* This container will be styled to manage the image layout relative to the text. */}
                </div>
            </div>
        </section>
    );
}

export default Home;