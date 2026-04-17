import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, ShoppingBag, DollarSign, History, Calendar, ChevronRight, X, User } from 'lucide-react';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await api.auth.getCustomers();
            setCustomers(res.data);
        } catch (err) {
            console.error('Error fetching customers', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPurchaseHistory = async (customer) => {
        setSelectedCustomer(customer);
        try {
            // Reusing getAllOrders and filtering for this demo
            // In a real app, create a specific endpoint
            const res = await api.admin.getAllOrders();
            const customerOrders = res.data.filter(o => o.user_id === customer.id || o.email === customer.email);
            setHistory(customerOrders);
        } catch (err) {
            console.error('Error fetching history');
        }
    };

    const filtered = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)
    );

    // Calculate insights for top customers
    const sortedBySpending = [...customers].sort((a, b) => (b.total_spent || 0) - (a.total_spent || 0)).slice(0, 5);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading directory...</div>;

    return (
        <div className="admin-customers-container animate-fade" style={{ padding: window.innerWidth < 768 ? '0.25rem' : '0.5rem' }}>
            <header className="responsive-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', marginBottom: '2.5rem', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 900, margin: 0 }}>Customer Insights</h1>
                    <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>View shopper habits and transaction history.</p>
                </div>
            </header>

            <div className="grid-responsive" style={{ '--grid-cols': '1fr 320px', gap: '1.5rem' }}>
                <div>
                    <div className="card" style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.85rem 1.25rem', borderRadius: '1rem' }}>
                        <Search color="#94a3b8" size={20} />
                        <input
                            type="text"
                            placeholder="Search name or phone..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: 600 }}
                        />
                    </div>

                    <div className="scroll-container" style={{ overflowX: 'auto', background: 'white', borderRadius: '1.25rem', border: '1px solid #f1f5f9' }}>
                        <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Shopper</th>
                                    <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Contact</th>
                                    <th style={{ textAlign: 'left', padding: '1rem 1.25rem', fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Lifetime Value</th>
                                    <th style={{ textAlign: 'right', padding: '1rem 1.25rem' }}>History</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => (
                                    <tr key={c.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1.15rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem' }}>
                                                    {c.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem' }}>{c.name}</p>
                                                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{new Date(c.created_at).toLocaleDateString('en-IN')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.15rem 1.25rem' }}>
                                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: '#4b5563' }}>{c.email}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{c.phone || 'No phone'}</p>
                                        </td>
                                        <td style={{ padding: '1.15rem 1.25rem' }}>
                                            <h4 style={{ margin: 0, color: '#10b981', fontWeight: 900 }}>₹{Number(c.total_spent || 0).toLocaleString('en-IN')}</h4>
                                        </td>
                                        <td style={{ padding: '1.15rem 1.25rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => fetchPurchaseHistory(c)}
                                                style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginLeft: 'auto' }}
                                            >
                                                <History size={14} /> View Logs
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div className="card" style={{ background: 'var(--primary)', color: 'white', padding: '1.5rem', borderRadius: '1.25rem', boxShadow: '0 8px 20px -5px rgba(16, 185, 129, 0.4)' }}>
                        <Users size={28} style={{ marginBottom: '1rem', opacity: 0.9 }} />
                        <h3 style={{ margin: 0, opacity: 0.8, fontSize: '0.85rem', fontWeight: 800 }}>TOTAL SHOPPERS</h3>
                        <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 900 }}>{customers.length}</h1>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', borderRadius: '1.25rem' }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 900, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ShoppingBag size={18} color="var(--primary)" /> Elite Segment
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {customers.slice(0, 5).map((c, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#cbd5e1' }}>0{i + 1}</span>
                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{c.name}</p>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#10b981' }}>₹{Number(c.total_spent || 0).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* History Modal - Mobile Responsive */}
            {selectedCustomer && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '1rem' }}>
                    <div className="card animate-fade" style={{ width: '100%', maxWidth: '750px', maxHeight: '85vh', overflow: 'hidden', padding: 0, borderRadius: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ background: 'var(--primary-light)', padding: '0.6rem', borderRadius: '0.85rem' }}>
                                    <User size={24} color="var(--primary)" />
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedCustomer.name}</h2>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>Purchase Behavior Report</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}><X size={24} /></button>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                            {history.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
                                    <ShoppingBag size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                    <p style={{ fontSize: '0.9rem' }}>No recent transaction logs available.</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    {history.map(order => (
                                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#f8fafc', borderRadius: '1rem', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <div style={{ padding: '0.5rem', background: 'white', borderRadius: '0.6rem', border: '1px solid #f1f5f9', color: '#94a3b8' }}>
                                                    <Calendar size={18} />
                                                </div>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 800, fontSize: '0.85rem' }}>#{order.invoice_id}</p>
                                                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500 }}>{new Date(order.created_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ margin: 0, fontWeight: 900, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{Number(order.final_amount).toLocaleString('en-IN')}</p>
                                                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: '#10b981' }}>{order.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '2px dashed #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Lifetime Value</p>
                                <h2 style={{ margin: 0, color: '#10b981', fontSize: '1.5rem', fontWeight: 900 }}>₹{Number(selectedCustomer.total_spent || 0).toLocaleString('en-IN')}</h2>
                            </div>
                            <button className="btn btn-primary" onClick={() => setSelectedCustomer(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: '0.75rem' }}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
