import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Package, MapPin, Phone, Mail, ShieldCheck, ChevronRight, ShoppingBag, Clock, ArrowRight, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profRes, ordRes] = await Promise.all([
                api.auth.getProfile(),
                api.order.getMyOrders()
            ]);
            setProfile(profRes.data);
            setOrders(ordRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>SYNCHRONIZING PROFILE...</p>
        </div>
    );

    return (
        <div className="profile-page hero-gradient" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '8rem' }}>
            <div className="container">
                <header style={{ marginBottom: '5rem', animation: 'animate-up 0.5s ease-out' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.05em', color: 'var(--dark)' }}>Personal Identity</h1>
                    <p style={{ color: '#64748b', fontSize: '1.15rem', fontWeight: 500, marginTop: '0.5rem' }}>Your secured portal for marketplace interactions.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>

                    {/* --- IDENTITY CORE --- */}
                    <div className="animate-slide-left" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="premium-card" style={{ padding: '4.5rem 3.5rem', borderRadius: '3.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', background: 'var(--dark)', opacity: 0.05 }}></div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, var(--primary) 0%, #10b981 100%)',
                                    color: 'white',
                                    width: '140px',
                                    height: '140px',
                                    borderRadius: '3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 2.5rem',
                                    boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.5)',
                                    fontSize: '3.5rem',
                                    fontWeight: 950
                                }}>
                                    {profile.name.charAt(0)}
                                </div>
                                <h2 style={{ marginBottom: '0.5rem', fontSize: '2.25rem', fontWeight: 950, color: 'var(--dark)', letterSpacing: '-0.03em' }}>{profile.name}</h2>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}>
                                    <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.50rem 1.25rem', borderRadius: '1rem', fontWeight: 950, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {profile.role} ACCOUNT
                                    </span>
                                    <div style={{ background: '#dcfce7', color: '#10b981', padding: '0.50rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <ShieldCheck size={14} />
                                    </div>
                                </div>

                                <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.75rem', marginTop: '4rem', background: '#f8fafc', padding: '2.5rem', borderRadius: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ background: 'white', padding: '0.75rem', borderRadius: '1.25rem', color: 'var(--primary)', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}><Mail size={20} /></div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase' }}>Verified Email</p>
                                            <p style={{ margin: 0, fontWeight: 800, color: 'var(--dark)' }}>{profile.email}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{ background: 'white', padding: '0.75rem', borderRadius: '1.25rem', color: '#3b82f6', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}><Phone size={20} /></div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase' }}>Contact Terminal</p>
                                            <p style={{ margin: 0, fontWeight: 800, color: 'var(--dark)' }}>{profile.phone || 'Pending registration'}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '1.25rem' }}>
                                        <div style={{ background: 'white', padding: '0.75rem', borderRadius: '1.25rem', color: '#f59e0b', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}><MapPin size={20} /></div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase' }}>Logistic Base</p>
                                            <p style={{ margin: 0, fontWeight: 800, color: 'var(--dark)', lineHeight: 1.4 }}>{profile.address || 'Global delivery active'}</p>
                                        </div>
                                    </div>
                                </div>
                                <button className="btn btn-secondary" style={{ width: '100%', height: '64px', borderRadius: '1.75rem', marginTop: '2rem', fontWeight: 800 }}>UPDATE IDENTITY</button>
                            </div>
                        </div>

                        <div className="premium-card" style={{ padding: '2.5rem', borderRadius: '2.5rem', background: 'var(--dark)', color: 'white' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '1.5rem' }}><Zap size={28} /></div>
                                <div>
                                    <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.15rem' }}>Level 8 Member</h4>
                                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Earning 15 points per purchase</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- REGISTRY HISTORY --- */}
                    <div className="animate-up" style={{ animationDelay: '0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '2.25rem', fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>Master Registry</h2>
                            <div className="glass-pill">{orders.length} TOTAL INTERACTIONS</div>
                        </div>

                        {orders.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {orders.map(order => (
                                    <div key={order.id} className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2.5rem', borderRadius: '2.5rem' }}>
                                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                            <div style={{ background: '#f8fafc', color: 'var(--primary)', padding: '1.25rem', borderRadius: '1.75rem', boxShadow: '0 10px 20px rgba(0,0,0,0.03)' }}>
                                                <ShoppingBag size={28} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: 'var(--dark)' }}>Order {order.invoice_id}</h4>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.4rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>
                                                        <Clock size={14} /> {new Date(order.created_at).toLocaleDateString()}
                                                    </div>
                                                    <span style={{ width: '4px', height: '4px', background: '#e2e8f0', borderRadius: '50%' }}></span>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 950,
                                                        textTransform: 'uppercase',
                                                        color: order.status === 'delivered' ? '#10b981' : '#f59e0b',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.4rem'
                                                    }}>
                                                        <Target size={14} /> {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ margin: 0, fontWeight: 950, fontSize: '1.75rem', color: 'var(--dark)', letterSpacing: '-0.03em' }}>₹{Number(order.final_amount).toLocaleString('en-IN')}</p>
                                            <button className="btn" style={{ padding: '0.5rem 0', color: 'var(--primary)', fontWeight: 950, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', border: 'none', background: 'none' }}>
                                                SECURE DETAILS <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="premium-card" style={{ textAlign: 'center', padding: '10rem 4rem', borderRadius: '4rem' }}>
                                <div style={{ background: '#f1f5f9', color: '#cbd5e1', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <Package size={50} />
                                </div>
                                <h3 style={{ margin: 0, fontWeight: 900, color: 'var(--dark)' }}>Null Interaction History</h3>
                                <p style={{ color: '#94a3b8', marginTop: '1rem', maxWidth: '300px', margin: '1rem auto 3rem' }}>You haven't initiated any marketplace acquisitions yet.</p>
                                <Link to="/products" className="btn btn-primary" style={{ padding: '0 3rem', height: '64px', borderRadius: '1.75rem', fontWeight: 950 }}>EXPLORE MARKET</Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
