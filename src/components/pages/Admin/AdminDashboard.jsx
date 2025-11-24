import React, { useState, useEffect } from 'react';
import './Admin.css';
import { db } from '../../../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, updateDoc, doc } from 'firebase/firestore';

function AdminDashboard() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    
    // --- Data States ---
    const [clients, setClients] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Action Modal States ---
    const [selectedClient, setSelectedClient] = useState(null);
    const [callOutcome, setCallOutcome] = useState('connected'); 
    const [note, setNote] = useState('');
    const [nextDate, setNextDate] = useState('');

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

    // --- 2. FETCH DATA ---
    useEffect(() => {
        if (!isAuthenticated) return;

        const qClients = query(collection(db, "clients"), orderBy("timestamp", "desc"));
        const unsubscribeClients = onSnapshot(qClients, (snapshot) => {
            const clientData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(clientData);
        });

        const qReviews = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
        const unsubscribeReviews = onSnapshot(qReviews, (snapshot) => {
            const reviewData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReviews(reviewData);
            setLoading(false);
        });

        return () => {
            unsubscribeClients();
            unsubscribeReviews();
        };
    }, [isAuthenticated]);

    // --- 3. LEAD MANAGEMENT FUNCTIONS ---

    const openProcessModal = (client) => {
        setSelectedClient(client);
        setCallOutcome('connected'); 
        setNote('');
        setNextDate('');
    };

    // --- SAVE LOGIC (UPDATED FOR HISTORY) ---
    const handleSaveOutcome = async () => {
        if (!selectedClient) return;

        if (!note) {
            alert("Please write a note or result.");
            return;
        }

        try {
            const docRef = doc(db, "clients", selectedClient.id);
            let updateData = { lastUpdated: new Date() };
            
            // Prepare History Entry Variable
            let newHistoryEntry = "";
            const timeString = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

            // --- OPTION 1: CONNECTED ---
            if (callOutcome === 'connected') {
                updateData.status = "✅ Connected";
                updateData.conversationNote = note;
                updateData.isClosed = true; 
                updateData.nextCallTime = null;
                
                newHistoryEntry = `✅ CONNECTED: ${note} (${timeString})`;
            } 
            
            // --- OPTION 2: RESCHEDULE ---
            else if (callOutcome === 'reschedule') {
                if (!nextDate) {
                    alert("Please select a date for the callback.");
                    return;
                }
                updateData.status = "📅 Rescheduled";
                updateData.conversationNote = `Reschedule Reason: ${note}`;
                updateData.nextCallTime = nextDate;

                const scheduleTime = new Date(nextDate).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                newHistoryEntry = `📅 RESCHEDULED to ${scheduleTime}: ${note} (${timeString})`;
            }

            // --- OPTION 3: NO ANSWER ---
            else if (callOutcome === 'no_answer') {
                const currentAttempts = selectedClient.callbackAttempts || 0;
                const newAttempts = currentAttempts + 1;
                
                updateData.callbackAttempts = newAttempts;
                newHistoryEntry = `❌ CALL ${newAttempts}: ${note} (${timeString})`;
                
                if (newAttempts >= 3) {
                    updateData.status = "❌ Max Attempts (3)";
                } else {
                    updateData.status = `Attempt ${newAttempts} Failed`;
                }
            }

            // --- SAVE HISTORY (Prepend new entry to top) ---
            const currentHistory = selectedClient.callHistory || [];
            updateData.callHistory = [newHistoryEntry, ...currentHistory];

            await updateDoc(docRef, updateData);
            
            setSelectedClient(null);
            setNote('');
            setNextDate('');
        } catch (error) {
            console.error("Error saving action:", error);
            alert("Failed to save action.");
        }
    };

    // --- 4. DELETE FUNCTIONS ---
    const handleDeleteClient = async (id) => {
        if (window.confirm("Are you sure you want to delete this LEAD?")) {
            await deleteDoc(doc(db, "clients", id));
        }
    };

    const handleDeleteReview = async (id) => {
        if (window.confirm("Are you sure you want to delete this REVIEW?")) {
            await deleteDoc(doc(db, "reviews", id));
        }
    };

    // --- RENDER ---
    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <h2>🔒 Owner Access Only</h2>
                    <form onSubmit={handleLogin}>
                        <input type="password" placeholder="Enter Admin Password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" />
                        <button type="submit" className="admin-btn">Login</button>
                    </form>
                </div>
            </div>
        );
    }

    if (loading) return <div className="admin-loading"><h2 style={{ color: '#64ffda' }}>Loading Dashboard...</h2></div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>Logout</button>
            </div>
            
            <h3 className="section-header">📞 Leads & Callback Status ({clients.length})</h3>
            <div className="table-responsive">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Client Details</th>
                            <th style={{minWidth: '250px'}}>Interaction History</th>
                            <th>Current Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} className={client.isClosed ? "row-done" : ""}>
                                <td>{client.timestamp?.seconds ? new Date(client.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                                
                                <td>
                                    <strong>{client.name}</strong><br/>
                                    {client.mobile}<br/>
                                </td>

                                {/* --- INTERACTION HISTORY (NEW COLUMN) --- */}
                                <td>
                                    <div className="history-container">
                                        {client.callHistory && client.callHistory.length > 0 ? (
                                            client.callHistory.map((entry, index) => (
                                                <div key={index} className="history-entry">
                                                    {entry}
                                                </div>
                                            ))
                                        ) : (
                                            <span style={{color: '#8892b0', fontStyle:'italic'}}>No interactions yet</span>
                                        )}
                                    </div>
                                </td>

                                {/* STATUS & NOTES */}
                                <td>
                                    <span className={`status-badge ${client.status?.includes("Connected") ? 'status-success' : client.status?.includes("Max") ? 'status-fail' : 'status-new'}`}>
                                        {client.status || "New Lead"}
                                    </span>
                                    
                                    {client.nextCallTime && (
                                        <div className="time-box">
                                            ⏰ Next: {new Date(client.nextCallTime).toLocaleString()}
                                        </div>
                                    )}
                                    
                                    {client.isClosed && (
                                        <div className="note-box" style={{marginTop:'5px'}}>
                                            <strong>Final Note:</strong> {client.conversationNote}
                                        </div>
                                    )}
                                </td>

                                {/* ACTION BUTTONS */}
                                <td>
                                    <div className="action-buttons">
                                        {client.isClosed ? (
                                            <button className="btn-disabled" disabled>✔️ Done</button>
                                        ) : (
                                            <button className="btn-process" onClick={() => openProcessModal(client)}>
                                                📞 Call / Action
                                            </button>
                                        )}
                                        <button className="delete-btn-icon" onClick={() => handleDeleteClient(client.id)} title="Delete">
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <hr className="admin-divider" style={{margin: '40px 0', borderColor: '#233554'}} />
            
            {/* Reviews Section */}
            <h3 className="section-header">⭐ Client Reviews ({reviews.length})</h3>
            <div className="table-responsive">
                <table className="client-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Review</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review) => (
                            <tr key={review.id}>
                                <td>{review.timestamp?.seconds ? new Date(review.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}</td>
                                <td>{review.name}</td>
                                <td style={{maxWidth: '300px'}}>{review.text}</td>
                                <td>
                                    <button className="delete-btn" onClick={() => handleDeleteReview(review.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ==================== CALL PROCESS MODAL ==================== */}
            {selectedClient && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal">
                        <h3>📞 Call Action: {selectedClient.name}</h3>
                        <p style={{marginBottom:'15px', color:'#8892b0'}}>Mobile: <strong>{selectedClient.mobile}</strong></p>

                        <div className="outcome-selector">
                            <label className={`outcome-option ${callOutcome === 'connected' ? 'selected' : ''}`}>
                                <input type="radio" name="outcome" checked={callOutcome === 'connected'} onChange={() => setCallOutcome('connected')} />
                                ✅ Connected (Submit & Close)
                            </label>

                            <label className={`outcome-option ${callOutcome === 'reschedule' ? 'selected' : ''}`}>
                                <input type="radio" name="outcome" checked={callOutcome === 'reschedule'} onChange={() => setCallOutcome('reschedule')} />
                                📅 Reschedule (Busy)
                            </label>

                            <label className={`outcome-option ${callOutcome === 'no_answer' ? 'selected' : ''}`}>
                                <input type="radio" name="outcome" checked={callOutcome === 'no_answer'} onChange={() => setCallOutcome('no_answer')} />
                                ❌ No Answer (Attempt +1)
                            </label>
                        </div>

                        <div className="outcome-inputs">
                            {callOutcome === 'connected' && (
                                <>
                                    <label>Final Conversation Note:</label>
                                    <textarea className="admin-textarea" rows="3" placeholder="E.g., Project discussed, quotation sent..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
                                </>
                            )}

                            {callOutcome === 'reschedule' && (
                                <>
                                    <label>Reason / Note:</label>
                                    <input className="admin-input" placeholder="E.g., In a meeting, Driving..." value={note} onChange={(e) => setNote(e.target.value)} />
                                    <label>Next Callback Time:</label>
                                    <input type="datetime-local" className="admin-date-input" value={nextDate} onChange={(e) => setNextDate(e.target.value)} />
                                </>
                            )}

                            {callOutcome === 'no_answer' && (
                                <>
                                    <label>Result:</label>
                                    <input className="admin-input" placeholder="E.g., Ringing, Switched Off..." value={note} onChange={(e) => setNote(e.target.value)} />
                                </>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="cancel-btn" onClick={() => setSelectedClient(null)}>Cancel</button>
                            <button className="confirm-btn" onClick={handleSaveOutcome}>Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;