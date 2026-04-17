import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, Users, DollarSign, Package, ListOrdered, CreditCard, BarChart3, ChevronRight, AlertTriangle, Clock, Zap, Activity, Users2, ArrowRight, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.admin.getStats();
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-spin" style={{ width: '60px', height: '60px', border: '5px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '2rem', fontWeight: 900, color: '#64748b', fontSize: '1.25rem', letterSpacing: '0.05em' }}>SYNCING OPERATIONS...</p>
        </div>
    );

    if (!stats) return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <div className="premium-card" style={{ padding: '4rem', textAlign: 'center', borderRadius: '3rem' }}>
                <AlertTriangle size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '2.5rem', fontWeight: 950, margin: 0 }}>Operational Fault</h2>
                <p style={{ color: '#64748b', fontSize: '1.25rem', margin: '1rem 0 2rem' }}>Could not fetch the operational status logs.</p>
                <button className="btn btn-primary" onClick={fetchStats} style={{ padding: '1rem 3rem', borderRadius: '1.5rem', fontWeight: 900 }}>RETRY CONNECTION</button>
            </div>
        </div>
    );

    const cards = [
        { label: 'Available Inventory', value: stats.totalProducts, icon: Package, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', trend: 'Products Ready' },
        { label: "Today's Volume", value: `₹${Number(stats.todaySales).toLocaleString('en-IN')}`, icon: Zap, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', trend: 'Live Revenue' },
        { label: 'Verified Shoppers', value: stats.totalCustomers, icon: Users2, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', trend: 'Active Base' }
    ];

    const modules = [
        { link: '/admin/pos', icon: CreditCard, title: 'POS Terminal', desc: 'Secure retail checkout', bg: 'var(--primary-light)', color: 'var(--primary)', highlight: true },
        { link: '/admin/orders', icon: ShoppingBag, title: 'Order Queue', desc: 'Active processing', bg: '#dbeafe', color: '#3b82f6' },
        { link: '/admin/products', icon: Package, title: 'Catalog', desc: 'Stock lookups', bg: '#f1f5f9', color: '#475569' },
        { link: '/admin/inventory', icon: AlertTriangle, title: 'Stock Watch', desc: 'Expiry & low stock', bg: '#fef3c7', color: '#f59e0b' },
        { link: '/admin/reports', icon: BarChart3, title: 'Revenue Logs', desc: 'Historical data', bg: '#ede9fe', color: '#8b5cf6' },
        { link: '/admin/customers', icon: Users, title: 'CRM', desc: 'Customer directory', bg: '#f0fdf4', color: '#10b981' },
    ];

    return (
        <div className="staff-dashboard-container" style={{ padding: '1rem' }}>
            {/* --- HERO HEADER --- */}
            <header style={{
                marginBottom: '4rem',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: '4rem',
                borderRadius: '3.5rem',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.4)',
                animation: 'animate-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
                gap: '2.5rem'
            }}>
                <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
                    <div className="glass-pill" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'var(--primary)', marginBottom: '1.5rem', padding: '0.5rem 1.5rem' }}>
                        Supermarket Operational Portal
                    </div>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 950, margin: 0, letterSpacing: '-0.04em' }}>
                        Daily Operations
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '1.25rem', marginTop: '1rem', maxWidth: '500px' }}>
                        Monitor real-time inventory levels, manage active order queues, and handle POS billing efficiently.
                    </p>
                </div>

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/admin/pos')}
                        className="btn btn-primary animate-float"
                        style={{
                            padding: '1.5rem 3.5rem',
                            fontSize: '1.25rem',
                            borderRadius: '2rem',
                            background: 'var(--primary)',
                            color: 'white',
                            fontWeight: 950,
                            boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
                            width: window.innerWidth < 768 ? '100%' : 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                            border: 'none',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            cursor: 'pointer'
                        }}
                    >
                        <CreditCard size={28} /> INIT POS BILLING
                    </button>
                </div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', top: '-100px', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
            </header>

            {/* --- KPI GRID --- */}
            <div className="grid-responsive" style={{ '--grid-cols': 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '5rem' }}>
                {cards.map((card, i) => (
                    <div key={i} className="premium-card" style={{
                        padding: '3rem',
                        borderRadius: '2.5rem',
                        animation: `animate-up ${0.5 + (i * 0.1)}s ease-out`
                    }}>
                        <div style={{
                            background: card.bg,
                            color: card.color,
                            width: '72px',
                            height: '72px',
                            borderRadius: '2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2rem',
                            boxShadow: `0 12px 24px -10px ${card.color}44`
                        }}>
                            <card.icon size={32} />
                        </div>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.label}</p>
                        <h2 style={{ margin: '0.5rem 0', fontSize: '2.5rem', fontWeight: 950, color: 'var(--dark)', letterSpacing: '-0.03em' }}>{card.value}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: card.color, fontSize: '0.85rem', fontWeight: 700 }}>
                            <Activity size={14} /> {card.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* --- CORE FEED & ALERTS --- */}
            <div className="grid-responsive" style={{ '--grid-cols': '1.8fr 1fr', gap: '2.5rem', marginBottom: '5rem' }}>
                {/* 1. Live Order Queue */}
                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Activity size={28} color="var(--primary)" /> Operational Queue
                        </h2>
                        <Link to="/admin/orders" className="glass-pill">FULL LOG</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {stats.recentOrders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '6rem 2rem', background: '#f8fafc', borderRadius: '2.5rem' }}>
                                <div style={{ background: 'white', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 16px rgba(0,0,0,0.04)' }}>
                                    <ShoppingBag size={32} color="#cbd5e1" />
                                </div>
                                <h3 style={{ margin: 0, color: '#64748b', fontWeight: 900 }}>Queue Empty</h3>
                                <p style={{ color: '#94a3b8', marginTop: '0.5rem', fontWeight: 600 }}>No pending orders require your attention.</p>
                            </div>
                        ) : stats.recentOrders?.filter(o => o.status !== 'completed' && o.status !== 'cancelled').slice(0, 5).map((order, i) => (
                            <div key={i} className="feed-item" style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1.75rem', background: '#f8fafc', borderRadius: '2.25rem', border: '1px solid #f1f5f9',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', overflow: 'hidden', flex: 1 }}>
                                    <div style={{
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: order.status === 'pending' ? '#ef444415' : '#3b82f615',
                                        color: order.status === 'pending' ? '#ef4444' : '#3b82f6',
                                        flexShrink: 0
                                    }}>
                                        <Clock size={28} />
                                    </div>
                                    <div style={{ overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontWeight: 950, fontSize: '1.15rem', color: 'var(--dark)' }}>{order.name}</p>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.25rem' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94a3b8' }}>#{order.invoice_id}</span>
                                            <span style={{ width: '4px', height: '4px', background: '#e2e8f0', borderRadius: '50%' }}></span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 950, color: order.status === 'pending' ? '#ef4444' : '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{order.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/admin/orders" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', borderRadius: '1.25rem', fontWeight: 900, background: 'white' }}>MANAGE</Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Inventory Alert Watch */}
                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem', background: 'linear-gradient(180deg, #ffffff 0%, #fffbf0 100%)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <AlertTriangle size={28} color="#f59e0b" /> Alerts
                        </h2>
                        <Link to="/admin/inventory" className="glass-pill" style={{ color: '#f59e0b' }}>FULL AUDIT</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ padding: '2.5rem', background: 'white', borderRadius: '2.5rem', border: '1px solid #fef3c7', boxShadow: '0 15px 30px -10px rgba(245, 158, 11, 0.1)' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#9a3412', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Restock Required</p>
                            <h3 style={{ margin: '0.5rem 0 1rem', color: 'var(--dark)', fontSize: '2.25rem', fontWeight: 950 }}>{stats.lowStockCount} Items</h3>
                            <Link to="/admin/inventory" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#c2410c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Analyze Shortages <ArrowRight size={16} /></Link>
                        </div>
                        <div style={{ padding: '2.5rem', background: 'white', borderRadius: '2.5rem', border: '1px solid #fee2e2', boxShadow: '0 15px 30px -10px rgba(239, 68, 68, 0.1)' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900, color: '#991b1b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expiration Watch</p>
                            <h3 style={{ margin: '0.5rem 0 1rem', color: 'var(--dark)', fontSize: '2.25rem', fontWeight: 950 }}>{stats.expiryAlertCount} Alerts</h3>
                            <Link to="/admin/inventory" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b91c1c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Audit Dates <ArrowRight size={16} /></Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- OPERATIONAL MODULES --- */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 950, margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Layers color="var(--primary)" size={32} /> Operational Modules
                </h2>
                <span className="glass-pill" style={{ background: 'var(--primary-light)' }}>ACTIVE SYSTEM</span>
            </div>

            <div className="grid-responsive" style={{ '--grid-cols': 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
                {modules.map((mod, i) => (
                    <Link key={i} to={mod.link} className="premium-card module-action" style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        padding: '2.5rem',
                        borderRadius: '2.5rem',
                        border: mod.highlight ? '2.5px solid var(--primary)' : '1px solid rgba(0,0,0,0.05)',
                        position: 'relative'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div style={{ background: mod.bg, color: mod.color, width: '64px', height: '64px', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} className="mod-icon-container">
                                <mod.icon size={28} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 950, color: 'var(--dark)' }}>{mod.title}</h3>
                                <p style={{ margin: '0.4rem 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>{mod.desc}</p>
                            </div>
                            <ChevronRight size={20} color="#cbd5e1" className="chevron-icon" style={{ transition: 'all 0.3s' }} />
                        </div>
                        {mod.highlight && <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crucial</span>}
                    </Link>
                ))}
            </div>

            <style>{`
                .module-action:hover { border-color: var(--primary); transform: translateY(-8px) scale(1.02); }
                .module-action:hover .mod-icon-container { background: var(--primary) !important; color: white !important; }
                .module-action:hover .chevron-icon { color: var(--primary); transform: translateX(8px); }
                .feed-item:hover { background: #fff !important; transform: scale(1.02); box-shadow: 0 12px 24px rgba(0,0,0,0.04); }
            `}</style>
        </div>
    );
};

export default StaffDashboard;
