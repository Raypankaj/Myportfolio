import React from 'react';
// ➡️ Improvement: Import the Link component if you want to link from the skills section (e.g., to certifications)
import { Link } from 'react-router-dom'; 
import './skill.css';

function Skill() {
    const skillData = {
        frontend: [
            'React (Core)', 
            'JavaScript (ES6+)', 
            'TypeScript', 
            'HTML5 & CSS3 / SASS', 
            'Tailwind CSS / Styled Components', // Enhanced detail
            'Framer Motion (Advanced Animation)',
            'Three.js (3D Graphics)',
            'Web Performance & Accessibility (A11y)' // Added key soft/hard skills
        ],
        backend: [
            'Node.js & Express.js', 
            'RESTful API Development', 
            'MongoDB (Mongoose)', 
            'Firebase/Firestore', 
            'Authentication (JWT)',
            'API Integration (Third-party services)'
        ],
        tools: [
            'Git & GitHub', 
            'VS Code & WebStorm', 
            'Vite & Webpack Bundlers', 
            'NPM/Yarn/PNPM', 
            'Figma & Adobe XD',
            'Linux/Bash (Deployment)',
            'Postman/Insomnia (API Testing)'
        ]
    };

    // ➡️ Improvement: Added optional 'linkTo' prop for skill item
    const renderSkillCategory = (title, skills) => (
        <div className="skill-category">
            <h3 className="category-title">{title}</h3>
            <ul className="skill-list">
                {/* NOTE: Using index as key is acceptable for static lists like this */}
                {skills.map((skill, index) => (
                    <li key={index} className="skill-item">
                        {/* Placeholder for an icon, e.g., using a unicode star or an SVG */}
                        <span className="skill-icon">★</span> {skill}
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        // ➡️ Accessibility: Added aria-labelledby to connect the heading to the section
        <section id="skills" className="skill-section" aria-labelledby="skills-title">
            <h2 id="skills-title" className="section-title">
                {/* ➡️ FIX: Assuming this is section 03. */}
                <span className="number"></span> My Core Skillset
            </h2>

            <div className="skill-content-wrapper">
                <p className="skill-pitch">
                    {/* ➡️ Enhanced SEO and value proposition */}
                    I focus on **modern JavaScript frameworks** and robust tools to build **highly performant**, accessible, and visually appealing web applications, specializing in the **MERN stack** and advanced frontend animation.
                </p>

                <div className="skill-grid">
                    {renderSkillCategory("Frontend Development", skillData.frontend)}
                    {renderSkillCategory("Backend & Database", skillData.backend)}
                    {renderSkillCategory("Tools & Workflow", skillData.tools)}
                </div>
                
                {/* ➡️ IMPROVEMENT: Added a direct CTA */}
                <div className="skills-cta-footer">
                    <p>Interested in my process? Let's connect!</p>
                    <Link to="/contact" className="cta-button secondary">
                        Discuss A Project
                    </Link>
                </div>

            </div>
        </section>
    );
}

export default Skill;