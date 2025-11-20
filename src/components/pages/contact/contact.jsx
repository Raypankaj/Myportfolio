import React, { useState } from 'react';
import './contact.css'; 

// ⬅️ ACTION: Replace this with your actual endpoint (Formspree/Netlify/etc.)
const CONTACT_FORM_ACTION = "YOUR_FORMSPREE_OR_NETLIFY_ENDPOINT"; 

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', 'submitting'

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionStatus('submitting');

        // Basic validation check (required attribute handles client-side, this prevents server call if empty)
        if (!formData.name || !formData.email || !formData.message) {
            setSubmissionStatus('error');
            return;
        }
        
        // Ensure the endpoint is actually configured before trying to fetch
        if (CONTACT_FORM_ACTION === "YOUR_FORMSPREE_OR_NETLIFY_ENDPOINT") {
            console.error("CONTACT_FORM_ACTION is not configured. Form will not submit.");
            setSubmissionStatus('error');
            return;
        }

        try {
            const response = await fetch(CONTACT_FORM_ACTION, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSubmissionStatus('success');
                setFormData({ name: '', email: '', message: '' }); // Clear form
            } else {
                setSubmissionStatus('error');
                // Log the response status for debugging purposes
                console.error('Form Submission Failed:', response.status, await response.text());
            }

        } catch (error) {
            setSubmissionStatus('error');
            console.error('Submission Error:', error);
        }
    };

    return (
        <section id="contact" className="contact-section" aria-labelledby="contact-title">
            <h2 id="contact-title" className="section-title">
                {/* ➡️ FIX: Restored the section number (assuming it is section 04.) */}
                <span className="number"></span> Get In Touch
            </h2>

            <div className="contact-content">
                <p className="contact-pitch">
                    I'm currently seeking new frontend developer opportunities. Whether you have a project in mind, a question, or just want to say hi, my inbox is always open!
                </p>

                {/* --- Submission Status Messages --- */}
                {submissionStatus === 'submitting' && <p className="status-message submitting" aria-live="polite">Sending message...</p>}
                {submissionStatus === 'success' && <p className="status-message success" aria-live="polite">🎉 Thank you! Your message has been sent successfully. I will be in touch soon.</p>}
                {submissionStatus === 'error' && <p className="status-message error" aria-live="polite">⚠️ Oops! There was an issue sending your message. Please check the console or try emailing me directly.</p>}

                <form 
                    className="contact-form" 
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Tell me about your project or question..."
                            required
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        className="submit-button"
                        disabled={submissionStatus === 'submitting'}
                    >
                        {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                </form>

                <p className="direct-email">
                    Or send a direct email to: <a href="mailto:Pankajray8285@gmail.com">Pankajray8285@gmail.com</a>
                </p>
            </div>
        </section>
    );
}

export default Contact;