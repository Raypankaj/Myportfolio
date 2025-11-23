import React, { useState, useEffect } from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
 import profilePic from '../../../assets/profile.png'; // Ensure the path is correct
function About() {
    // Ensure the path is correct

    const [reviews, setReviews] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [newReview, setNewReview] = useState({ name: '', role: '', text: '' });

    const skills = [
        { id: 'js-es6', name: 'Modern JavaScript (ES6+)' },
        { id: 'react-ctx', name: 'React & Redux/Context API' },
        { id: 'html-css', name: 'Responsive HTML & CSS (Sass, Tailwind)' },
        { id: 'git-hub', name: 'Git & GitHub Version Control' },
    ];

    useEffect(() => {
        const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const reviewsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewsData);
        }, (error) => {
            console.error("Error fetching reviews:", error);
        });
        return () => unsubscribe();
    }, []);

    const handleVerification = () => {
        const SECRET_CODE = "PANKAJ-CLIENT"; 

        if (accessCode === SECRET_CODE) {
            setIsVerified(true);
            setErrorMsg('');
        } else {
            setErrorMsg('❌ Invalid Access Code. Please contact Pankaj for a code.');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.text) return;

        try {
            await addDoc(collection(db, "reviews"), {
                name: newReview.name,
                role: newReview.role || "Client",
                text: newReview.text,
                timestamp: serverTimestamp()
            });

            setNewReview({ name: '', role: '', text: '' });
            setIsFormOpen(false);
            setIsVerified(false);
            setAccessCode('');
            alert("Thank you! Your review has been added.");
        } catch (error) {
            console.error("Error adding review: ", error);
            alert("Error submitting review. Please try again.");
        }
    };

    const fillTestCode = () => {
        setAccessCode("PANKAJ-CLIENT");
    };

    const fillTestData = () => {
        setNewReview({
            name: "Test User",
            role: "QA Engineer",
            text: "This is a test review to check the database connection. The UI looks great and the submission process is smooth!"
        });
    };

    return (
        <section id="about" className="about-section" aria-labelledby="about-title">
            <h2 id="about-title" className="section-title">
                <span className="number"></span> About Me
            </h2>

            <div className="about-content">
                <div className="about-text-column">
                    <p>
                        Hello! I'm <strong>Pankaj Ray</strong>, a results-driven <strong>Frontend Web Developer</strong> specializing in creating high-performance, <strong>accessible digital experiences</strong>. Based in <strong>Noida, India</strong>, I thrive on turning complex UI/UX designs into pixel-perfect, seamless web applications.
                    </p>
                    <p>
                        My core focus is on <strong>React development</strong>, specializing in dynamic Single Page Applications (SPAs) and integrating them with robust <strong>RESTful APIs</strong>. My priority is ensuring <strong>fast loading speeds</strong> and <strong>cross-browser compatibility</strong> across all my projects.
                    </p>
                    <p>
                        I'm actively seeking challenging roles where I can leverage <strong>modern JavaScript frameworks</strong> and contribute to an innovative team. Let's build something scalable!
                    </p>

                    <h3 className="skills-heading">My Current Tech Stack:</h3>
                    <ul className="skills-list">
                        {skills.map((skill) => (
                            <li key={skill.id} className="skill-item">
                                <span className="skill-icon">▹</span> {skill.name}
                            </li>
                        ))}
                    </ul>

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
                            alt="Pankaj Ray professional profile"
                            className="profile-image"
                        />
                    </div>
                </div>
            </div>

            <div className="reviews-container">
                <div className="reviews-header-group">
                    <h3 className="reviews-heading">What People Say</h3>
                    {!isFormOpen && (
                        <button className="add-review-btn" onClick={() => setIsFormOpen(true)}>
                            + Write a Review
                        </button>
                    )}
                </div>
                
                {isFormOpen && (
                    <div className="review-form-wrapper">
                        <div className="review-form-card">
                            <button className="close-form-btn" onClick={() => setIsFormOpen(false)}>✕</button>
                            
                            {!isVerified ? (
                                <div className="verification-step">
                                    <h4>Client Verification</h4>
                                    <p>To ensure authenticity, please enter the Access Code provided after your service.</p>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Access Code (e.g. PANKAJ-CLIENT)"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="form-input"
                                    />
                                    {errorMsg && <p className="error-msg">{errorMsg}</p>}
                                    
                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                        <button onClick={handleVerification} className="cta-button">Verify</button>
                                        
                                        <button 
                                            type="button" 
                                            onClick={fillTestCode}
                                            style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline'}}
                                        >
                                            Auto-fill Code
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="review-input-step">
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                        <h4 style={{margin: 0}}>Share your experience</h4>
                                        
                                        <button 
                                            type="button"
                                            onClick={fillTestData}
                                            style={{
                                                background: '#172a45', 
                                                border: '1px solid #64ffda', 
                                                color: '#64ffda', 
                                                padding: '4px 8px', 
                                                borderRadius: '4px', 
                                                cursor: 'pointer', 
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            Fill Test Data
                                        </button>
                                    </div>

                                    <input 
                                        type="text" 
                                        placeholder="Your Name"
                                        className="form-input"
                                        required
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Your Role / Company"
                                        className="form-input"
                                        value={newReview.role}
                                        onChange={(e) => setNewReview({...newReview, role: e.target.value})}
                                    />
                                    <textarea 
                                        placeholder="Write your review here..."
                                        className="form-input form-textarea"
                                        required
                                        value={newReview.text}
                                        onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                                    ></textarea>
                                    <button type="submit" className="cta-button">Submit Review</button>
                                </form>
                            )}
                        </div>
                    </div>
                )}

                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-icon">❝</div>
                            <p className="review-text">{review.text}</p>
                            <div className="reviewer-info">
                                <h4 className="reviewer-name">{review.name}</h4>
                                <span className="reviewer-role">{review.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}

export default About;