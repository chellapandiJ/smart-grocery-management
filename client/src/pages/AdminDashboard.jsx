import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, Users, DollarSign, AlertTriangle, ListOrdered, Calendar, ShoppingBag, ArrowRight, BarChart3, Layers, Users2, Percent, CreditCard, Activity, TrendingUp, Zap, Smartphone, Store, Clock, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 800, color: '#64748b', fontSize: '1rem', letterSpacing: '0.05em' }}>SYNCING OPERATIONS...</p>
        </div>
    );

    if (!stats) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontWeight: 900 }}>
            SYSTEM UNABLE TO CONNECT TO DATA SOURCES.
        </div>
    );

    const cards = [
        { label: "Today Revenue", value: `₹${Number(stats.todaySales || 0).toLocaleString('en-IN')}`, icon: Zap, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', sub: 'Live across all channels' },
        { label: "Online (DTC)", value: `₹${Number(stats.todayOnlineSales || 0).toLocaleString('en-IN')}`, icon: Smartphone, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', sub: 'Mobile & E-com sales' },
        { label: "Offline (POS)", value: `₹${Number(stats.todayOfflineSales || 0).toLocaleString('en-IN')}`, icon: Store, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)', sub: 'In-store transactions' },
        { label: "Stock Alerts", value: stats.lowStockCount, icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', sub: 'Refill required soon' },
    ];

    return (
        <div className="admin-dashboard-compact" style={{ padding: '0.5rem', maxWidth: '1600px', margin: '0 auto' }}>
            
            {/* --- CINEMATIC HEADER --- */}
            <div className="glass-outline" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '2rem',
                padding: '1.5rem 2.5rem',
                borderRadius: '2rem',
                border: '2px solid #fff'
            }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 950, color: 'var(--dark)', margin: 0, letterSpacing: '-0.02em' }}>
                        Executive Overview
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                        <div style={{ padding: '0.2rem 0.6rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 800 }}>LIVE SYSTEM</div>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                            <Clock size={14} style={{ marginRight: '5px' }} /> Updated: Just now
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link to="/admin/pos" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', borderRadius: '1.15rem', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Store size={18} /> OPEN BILLING TERMINAL
                    </Link>
                </div>
            </div>

            {/* --- CORE KPI GRID --- */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                gap: '1.25rem', 
                marginBottom: '2rem' 
            }}>
                {cards.map((card, i) => (
                    <div key={i} className="premium-card" style={{ 
                        padding: '1.5rem', 
                        borderRadius: '1.75rem',
                        background: 'var(--white)',
                        border: '1.5px solid #fff',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '160px'
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: card.color }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: card.bg, color: card.color, padding: '0.65rem', borderRadius: '0.85rem' }}>
                                <card.icon size={20} />
                            </div>
                            <span style={{ fontSize: '0.65rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</span>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.85rem', fontWeight: 950, color: 'var(--dark)', marginBottom: '0.2rem' }}>{card.value}</h2>
                            <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>{card.sub}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- ANALYTICS SPLIT --- */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1.2fr', 
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                
                {/* Channel Performance */}
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'var(--white)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Activity size={20} color="var(--primary)" /> Omni-Channel Sales Snapshot
                        </h3>
                        <Link to="/admin/reports" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>VIEW FULL REPORT <ArrowRight size={14} /></Link>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>ONLINE REVENUE (ALL TIME)</p>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 950, margin: '0.5rem 0', color: '#3b82f6' }}>₹{Number(stats.onlineHistorical).toLocaleString('en-IN')}</h4>
                            <div className="progress-bar" style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', marginTop: '1rem' }}>
                                <div style={{ width: '65%', height: '100%', background: '#3b82f6', borderRadius: '10px' }}></div>
                            </div>
                        </div>
                        <div style={{ flex: 1, padding: '1.5rem', background: '#f8fafc', borderRadius: '1.5rem', border: '1px solid #f1f5f9' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>OFFLINE REVENUE (ALL TIME)</p>
                            <h4 style={{ fontSize: '1.5rem', fontWeight: 950, margin: '0.5rem 0', color: '#10b981' }}>₹{Number(stats.offlineHistorical).toLocaleString('en-IN')}</h4>
                            <div className="progress-bar" style={{ height: '6px', background: '#e2e8f0', borderRadius: '10px', marginTop: '1rem' }}>
                                <div style={{ width: '82%', height: '100%', background: '#10b981', borderRadius: '10px' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Moving Stock */}
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'var(--white)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Award size={20} color="#f59e0b" /> Top Sellers
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {stats.topSellingProducts?.slice(0, 3).map((prod, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                                <img src={`/uploads/products/${prod.image}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.75rem', objectFit: 'cover' }} />
                                <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>{prod.name}</p>
                                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Vol: {prod.total_sold} units sold</p>
                                </div>
                                <TrendingUp size={16} color="#10b981" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- LIVE FEED & OPERATIONS --- */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '1.5rem' 
            }}>
                
                {/* Operation Centers */}
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'var(--white)', border: '1px solid #f1f5f9' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem' }}>Management Terminal</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        {[
                            { label: 'Catalog', path: '/admin/products', icon: Package },
                            { label: 'Staff', path: '/admin/staff', icon: Users2 },
                            { label: 'Inventory', path: '/admin/inventory', icon: Layers },
                            { label: 'Billing', path: '/admin/pos', icon: CreditCard },
                            { label: 'Analytics', path: '/admin/reports', icon: BarChart3 },
                            { label: 'Categories', path: '/admin/categories', icon: ListOrdered },
                        ].map((btn, i) => (
                            <Link key={i} to={btn.path} style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '0.5rem', 
                                padding: '1.25rem', 
                                background: '#f1f5f9', 
                                borderRadius: '1.25rem', 
                                textDecoration: 'none',
                                transition: 'all 0.3s'
                            }} className="action-tile">
                                <btn.icon size={20} color="var(--primary)" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#475569' }}>{btn.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recent Billing Log */}
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'var(--white)', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>Recent Billing</h3>
                        <Link to="/admin/orders" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>ALL ORDERS</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.recentOrders?.slice(0, 4).map((order, i) => (
                            <div key={i} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                padding: '1rem', 
                                background: '#f8fafc', 
                                borderRadius: '1.25rem',
                                border: '1px solid #f1f5f9'
                            }}>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 900 }}>{order.name || 'Walk-in'}</p>
                                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#94a3b8' }}>#{order.invoice_id} • {order.order_type.toUpperCase()}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 950, color: 'var(--primary)' }}>₹{Number(order.final_amount).toFixed(0)}</p>
                                    <span style={{ fontSize: '0.6rem', fontWeight: 900, color: order.status === 'completed' ? '#10b981' : '#f59e0b' }}>{order.status.toUpperCase()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Watchlist */}
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: '#fffefc', border: '1px solid #fef3c7' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', color: '#b45309', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertTriangle size={20} /> Stock Watchlist
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {stats.lowStockProducts?.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>
                                <CheckCircle2 size={32} color="#10b981" style={{ marginBottom: '1rem' }} />
                                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>All stack levels healthy</p>
                            </div>
                        ) : stats.lowStockProducts?.slice(0, 4).map((prod, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '1rem', border: '1px solid #fef3c7' }}>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800 }}>{prod.name}</p>
                                <span style={{ fontSize: '0.8rem', fontWeight: 950, color: '#ef4444' }}>{prod.stock} left</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            <style>{`
                .action-tile:hover { background: var(--primary) !important; transform: translateY(-3px); }
                .action-tile:hover span, .action-tile:hover svg { color: white !important; }
                .premium-card { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid #f1f5f9; }
                .premium-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
            `}</style>
        </div>
    );
};

export default AdminDashboard;
