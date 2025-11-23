import React, { useState, useEffect } from 'react';
import './Admin.css';
import { db } from '../../../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    
    // --- Data States ---
    const [clients, setClients] = useState([]);
    const [reviews, setReviews] = useState([]); // <--- NEW: State for reviews
    const [loading, setLoading] = useState(true);

    // --- 1. SECURITY CHECK ---
    const handleLogin = (e) => {
        e.preventDefault();
        const ADMIN_PASS = "PANKAJ-ADMIN-2025"; 
        
        if (password === ADMIN_PASS) {
            setIsAuthenticated(true);
        } else {
            alert("Access Denied! Incorrect Password.");
        }
    };

    // --- 2. FETCH DATA (Clients AND Reviews) ---
    useEffect(() => {
        if (!isAuthenticated) return;

        // A. Fetch Clients (Leads)
        const qClients = query(collection(db, "clients"), orderBy("timestamp", "desc"));
        const unsubscribeClients = onSnapshot(qClients, (snapshot) => {
            const clientData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(clientData);
            // We don't stop loading here yet, we wait for both or just let it flow
        });

        // B. Fetch Reviews (Testimonials) <--- NEW CODE
        const qReviews = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
        const unsubscribeReviews = onSnapshot(qReviews, (snapshot) => {
            const reviewData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewData);
            setLoading(false); // Stop loading when data arrives
        });

        // Cleanup function to stop listening when component closes
        return () => {
            unsubscribeClients();
            unsubscribeReviews();
        };
    }, [isAuthenticated]);

    // --- 3. DELETE FUNCTIONS ---
    const handleDeleteClient = async (id) => {
        if (window.confirm("Are you sure you want to delete this LEAD?")) {
            await deleteDoc(doc(db, "clients", id));
        }
    };

    // <--- NEW: Delete function for reviews
    const handleDeleteReview = async (id) => {
        if (window.confirm("Are you sure you want to delete this REVIEW?")) {
            await deleteDoc(doc(db, "reviews", id));
        }
    };

    // --- RENDER: LOGIN SCREEN ---
    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <h2>🔒 Owner Access Only</h2>
                    <form onSubmit={handleLogin}>
                        <input 
                            type="password" 
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="admin-input"
                        />
                        <button type="submit" className="admin-btn">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    // --- RENDER: LOADING STATE ---
    if (loading) {
        return (
            <div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h2 style={{ color: '#64ffda' }}>Loading Dashboard...</h2>
            </div>
        );
    }

    // --- RENDER: DASHBOARD TABLES ---
    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Logout</button>
            </div>
            
            {/* ==================== SECTION 1: CONTACT LEADS ==================== */}
            <h3 className="section-header">📞 Contact Form Leads ({clients.length})</h3>
            <div className="table-responsive">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.timestamp?.seconds ? new Date(client.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                                <td>{client.name}</td>
                                <td>{client.mobile}</td>
                                <td>{client.email}</td>
                                <td>{client.message}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDeleteClient(client.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>No leads yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <hr className="admin-divider" style={{margin: '40px 0', borderColor: '#233554'}} />

            {/* ==================== SECTION 2: REVIEWS ==================== */}
            <h3 className="section-header">⭐ Client Reviews ({reviews.length})</h3>
            <div className="table-responsive">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Review Text</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td>{review.timestamp?.seconds ? new Date(review.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                                <td>{review.name}</td>
                                <td style={{color: '#64ffda'}}>{review.role}</td>
                                <td style={{maxWidth: '300px', whiteSpace: 'normal'}}>{review.text}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {reviews.length === 0 && (
                            <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No reviews yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;