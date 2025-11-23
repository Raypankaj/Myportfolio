import React, { useState, useEffect } from 'react';
import './Admin.css';
import { db } from '../../../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [clients, setClients] = useState([]);
    
    // Fixed: The 'loading' state is now used to show a loading screen
    const [loading, setLoading] = useState(true);

    // --- 1. SECURITY CHECK ---
    const handleLogin = (e) => {
        e.preventDefault();
        // SET YOUR ADMIN PASSWORD HERE
        const ADMIN_PASS = "PANKAJ-ADMIN-2025"; 
        
        if (password === ADMIN_PASS) {
            setIsAuthenticated(true);
        } else {
            alert("Access Denied! Incorrect Password.");
        }
    };

    // --- 2. FETCH DATA (Only runs if authenticated) ---
    useEffect(() => {
        if (!isAuthenticated) return;

        const q = query(collection(db, "clients"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const clientData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(clientData);
            setLoading(false); // Stop loading when data arrives
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    // --- 3. DELETE FUNCTION ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            await deleteDoc(doc(db, "clients", id));
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

    // --- RENDER: LOADING STATE (Fixes the error) ---
    if (loading) {
        return (
            <div className="admin-dashboard" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h2 style={{ color: '#64ffda' }}>Loading Leads...</h2>
            </div>
        );
    }

    // --- RENDER: DASHBOARD TABLE ---
    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Logout</button>
            </div>
            
            <p className="status-text">Total Leads: {clients.length}</p>

            <div className="table-responsive">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Company</th>
                            <th>Message</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>
                                    {client.timestamp?.seconds 
                                        ? new Date(client.timestamp.seconds * 1000).toLocaleDateString() 
                                        : 'Just now'}
                                </td>
                                <td>{client.name}</td>
                                <td>{client.mobile}</td>
                                <td>{client.email}</td>
                                <td>{client.company || '-'}</td>
                                <td>{client.message}</td>
                                <td>
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDelete(client.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{textAlign: 'center', color: '#8892b0', padding: '20px'}}>
                                    No leads found yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminDashboard;