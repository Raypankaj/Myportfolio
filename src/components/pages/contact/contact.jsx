import React, { useState } from 'react';
import './Contact.css';
import { db } from '../../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import videoBg from '../../../assets/contactUsBgVideo.mp4';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        company: '',
        message: ''
    });

    // State for the DatePicker Modal
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [loading, setLoading] = useState(false);

    //  BACKGROUND VIDEO URL
    // You can replace this link with a local import like: import bgVideo from '../../assets/video.mp4';
    const videoUrl = "../../../assets/contactUsBgVideo.mp4";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- LOGIC: Open Modal ---
    const openCallbackModal = () => {
        if (!formData.mobile || !formData.name) {
            alert("Please enter your Name and Mobile Number first.");
            return;
        }
        setShowModal(true);
    };

    // --- LOGIC: Submit Normal Form or Callback ---
    const handleSubmit = async (e, isCallback = false) => {
        if (e) e.preventDefault(); 
        setLoading(true);

        try {
            let finalMessage = formData.message;
            let emailSubject = "New Contact Inquiry";

            if (isCallback) {
                finalMessage = `📅 CALLBACK REQUESTED\nTime: ${selectedDate}\n\nOriginal Message: ${formData.message}`;
                emailSubject = "URGENT: Callback Request";
            }

            // 1. Save to Firebase
            await addDoc(collection(db, "clients"), {
                ...formData,
                message: finalMessage,
                type: isCallback ? 'callback_request' : 'general_inquiry',
                callbackTime: isCallback ? selectedDate : null,
                timestamp: serverTimestamp()
            });

            // 2. Send Email via EmailJS
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                mobile: formData.mobile,
                company: formData.company,
                message: finalMessage,
                subject: emailSubject
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            alert(isCallback ? "Callback scheduled successfully!" : "Message sent successfully!");
            
            setFormData({ name: '', email: '', mobile: '', company: '', message: '' });
            setSelectedDate('');
            setShowModal(false);

        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <section className="contact-container">
            {/* --- 1. VIDEO ELEMENT --- */}
            <video autoPlay loop muted playsInline className="video-bg">
                <source src={videoBg} type="video/mp4" />
            </video>

            {/* --- 2. DARK BLUE OVERLAY (#0A192F) --- */}
            <div className="video-overlay"></div>

            {/* --- 3. MAIN CONTENT --- */}
            <div className="contact-content">
                <h2 className="contact-title">Let's Connect</h2>
                <p className="contact-subtitle">Fill out the form or schedule a call.</p>
                
                <div className="contact-form-card">
                    <form onSubmit={(e) => handleSubmit(e, false)} className="contact-form">
                        
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" required className="contact-input" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required className="contact-input" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number</label>
                            <input type="tel" name="mobile" required className="contact-input" placeholder="Enter your mobile" value={formData.mobile} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Company Name (Optional)</label>
                            <input type="text" name="company" className="contact-input" placeholder="Enter company name" value={formData.company} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea name="message" rows="5" className="contact-input contact-textarea" placeholder="How can I help you?" value={formData.message} onChange={handleChange} ></textarea>
                        </div>

                        {/* --- Action Buttons --- */}
                        <div className="button-group" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button type="submit" className="contact-btn" disabled={loading} style={{ flex: 1 }}>
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>

                            <button 
                                type="button" 
                                onClick={openCallbackModal}
                                className="call-btn" 
                                style={{ flex: 1, backgroundColor: '#28a745', color: 'white', border:'none', borderRadius: '3vw', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                📅 Schedule Call
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- THE MODAL (POPUP) --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">Select Best Time to Call</h3>
                        <p style={{marginBottom: '15px', color:'#666'}}>When should we call you on {formData.mobile}?</p>
                        
                        <input 
                            type="datetime-local" 
                            className="date-input"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            <button 
                                className="confirm-btn" 
                                onClick={() => handleSubmit(null, true)}
                                disabled={!selectedDate || loading}
                            >
                                {loading ? 'Booking...' : 'Confirm Call'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </section>
    );
}

export default Contact;