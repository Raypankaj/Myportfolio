import React, { useState } from 'react';
import './Contact.css';
// ⚠️ CHECK THIS PATH: It assumes Contact.js is inside src/components/Contact/
// If firebase.js is in src/, use '../firebase' or '../../firebase' accordingly.
import { db } from '../../../firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        company: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Save to "clients" collection
            await addDoc(collection(db, "clients"), {
                ...formData,
                timestamp: serverTimestamp()
            });

            alert("Message sent successfully! I will contact you shortly.");
            // Reset form
            setFormData({ name: '', email: '', mobile: '', company: '', message: '' });
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <section className="contact-container">
            <div className="contact-content">
                <h2 className="contact-title">Let's Connect</h2>
                <p className="contact-subtitle">Fill out the form below and I will get back to you.</p>
                
                <div className="contact-form-card">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input 
                                type="text" name="name" required 
                                className="contact-input"
                                placeholder="Enter your name"
                                value={formData.name} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input 
                                type="email" name="email" required 
                                className="contact-input"
                                placeholder="Enter your email"
                                value={formData.email} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input 
                                type="tel" name="mobile" required 
                                className="contact-input"
                                placeholder="Enter your mobile"
                                value={formData.mobile} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Company Name (Optional)</label>
                            <input 
                                type="text" name="company" 
                                className="contact-input"
                                placeholder="Enter company name"
                                value={formData.company} onChange={handleChange} 
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea 
                                name="message" rows="5" required 
                                className="contact-input contact-textarea"
                                placeholder="How can I help you?"
                                value={formData.message} onChange={handleChange} 
                            ></textarea>
                        </div>

                        <button type="submit" className="contact-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Contact;