import React, { useState, useEffect } from 'react';
import './About.css';
import { Link } from 'react-router-dom';
import { db } from '../../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where, getDocs } from 'firebase/firestore';
import profilePic from '../../../assets/profile.png';

function About() {
    const [reviews, setReviews] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    
    // --- Verification States ---
    const [verifyMobile, setVerifyMobile] = useState(''); // New input for lookup
    const [accessCode, setAccessCode] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [verifying, setVerifying] = useState(false);

    // --- Review Form State ---
    const [newReview, setNewReview] = useState({ name: '', role: '', text: '' });

    const [isDevMode, setIsDevMode] = useState(false);

    const skills = [
        { id: 'js-es6', name: 'Modern JavaScript (ES6+)' },
        { id: 'react-ctx', name: 'React & Redux/Context API' },
        { id: 'html-css', name: 'Responsive HTML & CSS (Sass, Tailwind)' },
        { id: 'git-hub', name: 'Git & GitHub Version Control' },
    ];

    useEffect(() => {
        const hostname = window.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            setIsDevMode(true);
        }

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

    // --- NEW: LOGIC TO VERIFY USER FROM FIREBASE ---
    const handleVerification = async () => {
        setErrorMsg('');
        setVerifying(true);

        try {
            // 1. Check if inputs are filled
            if (!verifyMobile || !accessCode) {
                setErrorMsg('⚠️ Please enter both Mobile Number and Access Code.');
                setVerifying(false);
                return;
            }

            // 2. Query Firestore for the client with this mobile number
            const clientsRef = collection(db, "clients");
            const q = query(clientsRef, where("mobile", "==", verifyMobile));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setErrorMsg('❌ Mobile number not found in our records.');
                setVerifying(false);
                return;
            }

            // 3. Check the password logic (Company@Last4)
            let matchFound = false;
            let clientData = null;

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Ensure company exists, otherwise fallback or fail
                const companyName = data.company || ""; 
                const mobileStr = data.mobile || "";
                
                if (mobileStr.length >= 4) {
                    const lastFour = mobileStr.slice(-4);
                    // Construct the expected password: Company@1234
                    const expectedPassword = `${companyName}@${lastFour}`;

                    // Compare (Trim spaces to be safe)
                    if (accessCode.trim() === expectedPassword.trim()) {
                        matchFound = true;
                        clientData = data;
                    }
                }
            });

            if (matchFound) {
                setIsVerified(true);
                // Pre-fill the form with their data for convenience
                setNewReview({
                    name: clientData.name || '',
                    role: clientData.company || '',
                    text: ''
                });
            } else {
                setErrorMsg('❌ Incorrect Access Code. Format: CompanyName@Last4Digits');
            }

        } catch (error) {
            console.error("Verification Error:", error);
            setErrorMsg('⚠️ System error. Please try again later.');
        }

        setVerifying(false);
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
            setVerifyMobile('');
            alert("Thank you! Your review has been added.");
        } catch (error) {
            console.error("Error adding review: ", error);
            alert("Error submitting review. Please try again.");
        }
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
                                    <p>Please enter your registered details to write a review.</p>
                                    
                                    {/* 1. Mobile Input for Lookup */}
                                    <input 
                                        type="tel" 
                                        placeholder="Registered Mobile Number"
                                        value={verifyMobile}
                                        onChange={(e) => setVerifyMobile(e.target.value)}
                                        className="form-input"
                                        style={{marginBottom: '10px'}}
                                    />

                                    {/* 2. Password Input */}
                                    <input 
                                        type="password" 
                                        placeholder="Access Code (Company@Last4)"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        className="form-input"
                                    />
                                    
                                    {errorMsg && <p className="error-msg">{errorMsg}</p>}
                                    
                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginTop: '15px'}}>
                                        <button onClick={handleVerification} className="cta-button" disabled={verifying}>
                                            {verifying ? 'Verifying...' : 'Verify Identity'}
                                        </button>
                                        
                                        {/* Dev Mode Skip */}
                                        {isDevMode && (
                                            <button 
                                                type="button" 
                                                onClick={() => setIsVerified(true)}
                                                style={{background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline'}}
                                            >
                                                Bypass (Dev)
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} className="review-input-step">
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                                        <h4 style={{margin: 0}}>Share your experience</h4>
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