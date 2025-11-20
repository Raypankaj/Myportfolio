import React, { useState, useEffect } from 'react';
import './project.css';

// 🚨 CRITICAL FIX 1: Replace the placeholder GITHUB_USERNAME
// Using 'mrdoob' is fine for the example, but replace with Pankaj's handle for delivery.
const GITHUB_USERNAME = 'mrdoob'; // Replace with your GitHub username
const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

// Helper component to render a single project card
const ProjectCard = ({ repo }) => {
    // Determine the language icon/color based on the main language
    const language = repo.language || 'Documentation';
    const languageClass = language.toLowerCase().replace(/[#.+]/g, ''); // For CSS coloring
    
    // Simple logic to feature the project with most stars (optional)
    const isFeatured = repo.stargazers_count >= 5; // Use a reasonable threshold

    // ➡️ Improvement: Cleaned up link icons
    return (
        <div className={`project-card ${isFeatured ? 'featured' : ''}`}>
            <h3 className="project-title">{repo.name.replace(/-/g, ' ')}</h3>
            <p className="project-description">{repo.description || "No description provided."}</p>

            <div className="project-meta">
                {/* ➡️ Added class for language-specific styling in CSS */}
                <span className={`language-tag ${languageClass}`}>{language}</span>
                <span className="star-count">⭐ {repo.stargazers_count} Stars</span>
            </div>

            <div className="project-links">
                <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={`View code for ${repo.name} on GitHub`}
                >
                    <i className="link-icon">Code</i>
                </a>
                {repo.homepage && (
                    <a 
                        href={repo.homepage} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`View live demo for ${repo.name}`}
                    >
                        <i className="link-icon">Demo</i>
                    </a>
                )}
            </div>
        </div>
    );
};


// Main Projects Component with API Fetching
function Projects() {
    // ➡️ Improvement: Using useMemo to define filtered repos based on fetched data
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🛑 CRITICAL FIX 2: Check for placeholder username
        if (GITHUB_USERNAME === 'YOUR_GITHUB_USERNAME_HERE') {
             setError("CRITICAL ERROR: Please replace 'YOUR_GITHUB_USERNAME_HERE' in Projects.jsx with your GitHub handle.");
             setLoading(false);
             return;
        }

        const fetchRepos = async () => {
            try {
                // ➡️ Performance: Use a cache header (if possible) or ensure component is only mounted once
                const response = await fetch(API_URL);
                if (!response.ok) {
                    // Check for common rate limiting error (403)
                    if (response.status === 403) {
                         throw new Error(`GitHub API Rate Limit Exceeded. Try again in an hour.`);
                    }
                    throw new Error(`GitHub API returned status: ${response.status}`);
                }
                const data = await response.json();

                // ➡️ Improvement: More refined filtering logic for high-quality projects
                const filteredRepos = data
                    .filter(repo => 
                         !repo.fork && // Ignore forks
                         repo.stargazers_count > 0 && // Only show projects with stars
                         repo.description // Ensure it has a description
                    ) 
                    // Sort by Stars (more impact) or Pushed Date (more recent)
                    .sort((a, b) => b.stargazers_count - a.stargazers_count); 

                setRepos(filteredRepos);
            } catch (err) {
                console.error("Failed to fetch GitHub projects:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRepos();
    }, []); // Empty dependency array ensures it runs once on mount

    return (
        // ➡️ Accessibility: Added aria-labelledby
        <section id="projects" className="projects-section" aria-labelledby="projects-title">
            <h2 id="projects-title" className="section-title">
                <span className="number"></span> Projects & Open Source
            </h2>
            
            <div className="projects-list-container">
                {loading && <p className="status-message">Loading projects from GitHub...</p>}

                {/* ➡️ Improved User Feedback for Errors */}
                {error && (
                    <div className="error-message">
                        <p>Error fetching projects: **{error}**</p>
                        <p>If this error persists, the GitHub API rate limit may be exceeded. Please try again later.</p>
                    </div>
                )}

                {/* ➡️ Clear Call to Action when no projects are found */}
                {!loading && repos.length === 0 && !error && (
                    <div className="status-message">
                         <p>No high-quality, non-forked repositories found. I'm busy coding a new one!</p>
                         <a href={`https://github.com/${GITHUB_USERNAME}?tab=repositories`} target="_blank" rel="noopener noreferrer" className="cta-button secondary">
                             View All Repositories on GitHub
                         </a>
                    </div>
                )}

                <div className="project-grid">
                    {repos.map(repo => (
                        <ProjectCard key={repo.id} repo={repo} />
                    ))}
                </div>
            </div>
            
            {/* ➡️ Final CTA at the end of the section */}
            {!loading && repos.length > 0 && (
                <div className="projects-footer-cta">
                    <p>Want to see more of my code?</p>
                    <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer" className="cta-button primary">
                        Visit My Full GitHub Profile
                    </a>
                </div>
            )}
            
        </section>
    );
}

export default Projects;