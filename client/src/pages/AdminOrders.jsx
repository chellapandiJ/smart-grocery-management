import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ShoppingBag, ChevronDown, ChevronUp, Clock, Package, Truck, CheckCircle, Printer, X, User, MapPin, Phone, Activity, Search, Filter, Layers, Zap, Calendar, Download } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [expanded, setExpanded] = useState(null);
    const [showInvoice, setShowInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterPeriod, setFilterPeriod] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.admin.getAllOrders();
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.admin.updateOrderStatus(id, { status });
            fetchOrders();
        } catch (err) {
            console.error('Failed to update status');
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'pending': return { color: '#f59e0b', label: 'PENDING', icon: Clock };
            case 'approved': return { color: '#06b6d4', label: 'APPROVED', icon: CheckCircle };
            case 'processing': return { color: '#3b82f6', label: 'PREPARING', icon: Package };
            case 'shipped': return { color: '#8b5cf6', label: 'DOOR DELIVERY', icon: Truck };
            case 'delivered': return { color: '#a855f7', label: 'DELIVERED', icon: Zap };
            case 'completed': return { color: '#10b981', label: 'SUCCESSFULLY COMPLETED', icon: CheckCircle };
            case 'rejected': return { color: '#ef4444', label: 'REJECTED', icon: X };
            case 'cancelled': return { color: '#ef4444', label: 'CANCELLED', icon: X };
            default: return { color: '#64748b', label: 'UNKNOWN', icon: Activity };
        }
    };

    const isToday = (dateString) => {
        const today = new Date().setHours(0, 0, 0, 0);
        const orderDate = new Date(dateString).setHours(0, 0, 0, 0);
        return today === orderDate;
    };

    const filteredOrders = orders.filter(o => {
        const matchesSearch = o.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (o.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (o.product_names?.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        // Type filter (online / offline)
        if (filterType === 'online' && o.order_type !== 'online') return false;
        if (filterType === 'offline' && o.order_type !== 'offline') return false;

        // Date Period filter
        if (filterPeriod !== 'all') {
            const orderDate = new Date(o.created_at);
            const today = new Date();
            if (filterPeriod === 'today') {
                if (!isToday(o.created_at)) return false;
            } else if (filterPeriod === 'week') {
                const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                if (orderDate < lastWeek) return false;
            } else if (filterPeriod === 'month') {
                const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                if (orderDate < lastMonth) return false;
            }
        }

        if (activeTab === 'all') return ['pending', 'approved', 'processing', 'shipped'].includes(o.status);
        if (activeTab === 'pending') return o.status === 'pending';
        if (activeTab === 'history') return ['delivered', 'completed', 'rejected', 'cancelled'].includes(o.status);
        return true;
    });

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const liveOrders = orders.filter(o => ['pending', 'approved', 'processing', 'shipped'].includes(o.status));
    const historyOrders = orders.filter(o => ['delivered', 'completed', 'rejected', 'cancelled'].includes(o.status));
    const todayOrders = orders.filter(o => isToday(o.created_at));

    const tabs = [
        { id: 'all', label: 'Live Pipeline', count: liveOrders.length, color: 'var(--primary)', icon: Activity },
        { id: 'pending', label: 'Pending Review', count: pendingOrders.length, color: '#f59e0b', icon: Clock },
        { id: 'history', label: 'Purchase History', count: historyOrders.length, color: '#10b981', icon: CheckCircle },
    ];

    const handlePrint = (order) => {
        setShowInvoice(order);
        setTimeout(() => window.print(), 500);
    };

    const exportHistoryCSV = () => {
        const targetOrders = activeTab === 'history' ? historyOrders : filteredOrders;
        const headers = ['Order ID', 'Date', 'Type', 'Customer Name', 'Contact', 'Delivery Address', 'Status', 'Total Amount (Rs)'];
        const rows = [headers.join(',')];
        
        targetOrders.forEach(o => {
            const date = new Date(o.created_at).toLocaleString();
            const type = o.order_type.toUpperCase();
            const cust = `"${o.customer_name || 'Walk-in Client'}"`;
            const phone = `"${o.customer_phone || 'N/A'}"`;
            const addr = `"${o.shipping_address || 'Store Pickup'}"`;
            const status = o.status.toUpperCase();
            rows.push([o.invoice_id, `"${date}"`, type, cust, phone, addr, status, o.final_amount].join(','));
        });
        
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Purchase_History_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-spin" style={{ width: '60px', height: '60px', border: '5px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '2rem', fontWeight: 950, color: 'var(--dark)', fontSize: '1.25rem', letterSpacing: '0.05em' }}>MAPPING LOGISTICS...</p>
        </div>
    );

    return (
        <div className="admin-orders-container" style={{ padding: '1rem' }}>
            {/* --- CINEMATIC HEADER --- */}
            <header style={{ marginBottom: '4rem', animation: 'animate-up 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 950, fontSize: '3.5rem', margin: 0, letterSpacing: '-0.04em', color: 'var(--dark)' }}>Order Pipeline</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.25rem', marginTop: '0.5rem' }}>Fulfilling {todayOrders.length} orders today across the platform.</p>
                    </div>
                    <button onClick={fetchOrders} className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontWeight: 950, borderRadius: '1.5rem' }}>SYNC LIVE FEED</button>
                </div>
            </header>

            {/* --- STATUS OVERVIEW CARDS --- */}
            <div className="grid-responsive" style={{ '--grid-cols': 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'var(--dark)', color: 'white', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '1rem', borderRadius: '1.25rem' }}><Activity size={28} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Active Pipeline</p>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 950 }}>{liveOrders.length}</h2>
                    </div>
                </div>
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'white', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '2px solid #fecaca' }}>
                    <div style={{ background: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: '1.25rem' }}><Clock size={28} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Pending Review</p>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 950, color: '#ef4444' }}>{pendingOrders.length}</h2>
                    </div>
                </div>
                <div className="premium-card" style={{ padding: '2rem', borderRadius: '2rem', background: 'white', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: '#dcfce7', color: '#10b981', padding: '1rem', borderRadius: '1.25rem' }}><CheckCircle size={28} /></div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Successfully Managed</p>
                        <h2 style={{ margin: 0, fontSize: '2rem', fontWeight: 950, color: '#10b981' }}>{orders.filter(o => ['delivered', 'completed'].includes(o.status)).length}</h2>
                    </div>
                </div>
            </div>

            {/* --- NAVIGATION & SEARCH --- */}
            <div style={{ marginBottom: '3rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '1rem 2rem',
                                borderRadius: '1.5rem',
                                background: activeTab === tab.id ? tab.color : 'white',
                                color: activeTab === tab.id ? 'white' : '#64748b',
                                border: '2px solid',
                                borderColor: activeTab === tab.id ? tab.color : '#f1f5f9',
                                fontWeight: 950,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                fontSize: '0.85rem'
                            }}
                        >
                            {tab.icon && <tab.icon size={16} />}
                            {tab.label.toUpperCase()}
                            <span style={{
                                background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                                color: activeTab === tab.id ? 'white' : '#64748b',
                                padding: '0.15rem 0.6rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 950
                            }}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="premium-card" style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRadius: '1.25rem', height: '56px', background: 'white' }}>
                        <Filter size={20} color="#94a3b8" style={{ marginRight: '0.75rem' }} />
                        <select 
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)' }}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Channels</option>
                            <option value="online">Online App</option>
                            <option value="offline">In-Store POS</option>
                        </select>
                    </div>
                    
                    <div className="premium-card" style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRadius: '1.25rem', height: '56px', background: 'white' }}>
                        <Calendar size={20} color="#94a3b8" style={{ marginRight: '0.75rem' }} />
                        <select 
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)' }}
                            value={filterPeriod}
                            onChange={(e) => setFilterPeriod(e.target.value)}
                        >
                            <option value="all">All Dates</option>
                            <option value="today">Today</option>
                            <option value="week">Past 7 Days</option>
                            <option value="month">Past 30 Days</option>
                        </select>
                    </div>

                    <div className="premium-card" style={{ display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRadius: '1.25rem', height: '56px', minWidth: '350px', background: 'white' }}>
                        <Search size={20} color="#94a3b8" style={{ marginRight: '1rem' }} />
                        <input
                            type="text"
                            placeholder="Search Ref ID / Cust / Format..."
                            style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 800, width: '100%', fontSize: '0.95rem', color: 'var(--dark)' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- EXPORT TOOLS (HISTORY VIEW) --- */}
            {activeTab === 'history' && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
                    <button onClick={exportHistoryCSV} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', borderRadius: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'white', color: '#10b981', border: '2px solid #10b981' }}>
                        <Download size={16} /> EXPORT EXCEL (CSV)
                    </button>
                    <button onClick={() => window.print()} className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem', borderRadius: '1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', background: 'white', color: 'var(--primary)', border: '2px solid var(--primary)' }}>
                        <Printer size={16} /> DOWNLOAD PDF / PRINT LOGS
                    </button>
                </div>
            )}

            {/* --- ORDER REGISTRY --- */}
            <div className="grid" style={{ gap: '1.5rem' }}>
                {filteredOrders.length === 0 ? (
                    <div className="premium-card" style={{ textAlign: 'center', padding: '10rem 2rem', borderRadius: '3.5rem' }}>
                        <ShoppingBag size={80} color="#cbd5e1" style={{ marginBottom: '2rem', opacity: 0.2 }} />
                        <h2 style={{ color: 'var(--dark)', fontWeight: 950, fontSize: '1.5rem' }}>No telemetry data found</h2>
                        <p style={{ color: '#94a3b8', fontWeight: 600, marginTop: '0.5rem' }}>Adjust your lookup parameters to find specific records.</p>
                    </div>
                ) : filteredOrders.map((order, idx) => {
                    const statusInfo = getStatusInfo(order.status);
                    const isExpanded = expanded === order.id;
                    const orderToday = isToday(order.created_at);
                    return (
                        <div key={order.id} className="premium-card" style={{
                            padding: 0,
                            borderRadius: '2rem',
                            overflow: 'hidden',
                            border: isExpanded ? `2.5px solid ${statusInfo.color}` : '1.5px solid rgba(0,0,0,0.05)',
                            animation: `animate-up ${0.4 + (idx * 0.05)}s ease-out`
                        }}>
                            <div
                                style={{ padding: '2rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: isExpanded ? '#f8fafc' : 'white' }}
                                onClick={() => setExpanded(isExpanded ? null : order.id)}
                            >
                                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1 }}>
                                    <div style={{
                                        background: statusInfo.color + '15',
                                        color: statusInfo.color,
                                        width: '56px',
                                        height: '56px',
                                        borderRadius: '1.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <statusInfo.icon size={24} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem' }}>
                                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.2rem', color: 'var(--dark)' }}>#{order.invoice_id}</h3>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <span style={{ padding: '0.25rem 0.75rem', background: order.order_type === 'online' ? 'var(--primary-light)' : '#f1f5f9', color: order.order_type === 'online' ? 'var(--primary)' : '#64748b', fontSize: '0.65rem', fontWeight: 950, borderRadius: '0.6rem', letterSpacing: '0.05em' }}>{order.order_type === 'online' ? 'ONLINE' : 'OFFLINE'}</span>
                                                {orderToday && <span style={{ padding: '0.25rem 0.75rem', background: 'var(--dark)', color: 'white', fontSize: '0.65rem', fontWeight: 950, borderRadius: '0.6rem', letterSpacing: '0.05em' }}>TODAY</span>}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <span style={{ fontSize: '0.85rem', color: 'var(--dark)', fontWeight: 800 }}>{order.customer_name || 'Walk-in Client'}</span>
                                            <span style={{ width: '4px', height: '4px', background: '#cbd5e1', borderRadius: '50%' }}></span>
                                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 700 }}>{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                        <div style={{
                                            padding: '0.4rem 1rem',
                                            borderRadius: '1rem',
                                            background: statusInfo.color + '15',
                                            color: statusInfo.color,
                                            fontWeight: 950,
                                            fontSize: '0.65rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            boxShadow: `0 0 0 1px ${statusInfo.color}30`
                                        }}>
                                            {statusInfo.label}
                                        </div>
                                        <h3 style={{ margin: 0, color: 'var(--dark)', fontWeight: 950, fontSize: '1.3rem' }}>₹{Number(order.final_amount).toLocaleString('en-IN')}</h3>
                                    </div>
                                    
                                    {/* --- INLINE QUICK ACTIONS --- */}
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {order.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'approved'); }} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '0.75rem' }}>APPROVE</button>}
                                        {['approved', 'processing'].includes(order.status) && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'shipped'); }} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontWeight: 900, background: '#3b82f6', fontSize: '0.75rem' }}>DELIVERY ROUTE</button>}
                                        {order.status === 'shipped' && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'delivered'); }} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '0.75rem', fontWeight: 900, background: '#10b981', fontSize: '0.75rem' }}>MARK DELIVERED</button>}
                                        
                                        <div style={{ width: '1px', height: '40px', background: '#e2e8f0', margin: '0 0.5rem' }}></div>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {isExpanded ? <ChevronUp size={18} color="#64748b" /> : <ChevronDown size={18} color="#64748b" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="animate-up" style={{ padding: '3rem', background: 'white', borderTop: '1px solid #f1f5f9' }}>
                                    <div className="grid-responsive" style={{ '--grid-cols': '1.3fr 1fr', gap: '3rem' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 950, fontSize: '1rem', color: 'var(--dark)' }}>
                                                <Activity size={20} color="var(--primary)" /> Logistics Intelligence
                                            </h4>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
                                                <div className="premium-card" style={{ padding: '1.75rem', borderRadius: '1.5rem', background: '#f8fafc', border: 'none' }}>
                                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Customer Profile</p>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={20} color="var(--primary)" /></div>
                                                        <div>
                                                            <p style={{ margin: 0, fontWeight: 950, fontSize: '1rem', color: 'var(--dark)' }}>{order.customer_name || 'Walk-in Client'}</p>
                                                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>{order.customer_phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="premium-card" style={{ padding: '1.75rem', borderRadius: '1.5rem', background: '#f8fafc', border: 'none' }}>
                                                    <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 950, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Dispatch Node</p>
                                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                                        <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={20} color="#3b82f6" /></div>
                                                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--dark)' }}>{order.shipping_address || 'Store Collection Point'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '2.5rem' }}>
                                                <h4 style={{ marginBottom: '1.25rem', fontWeight: 950, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Action Overrides</h4>
                                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                                    {order.status === 'pending' && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'approved'); }} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '1rem', fontWeight: 950, fontSize: '0.85rem' }}>APPROVE ORDER</button>}
                                                    {['approved', 'processing'].includes(order.status) && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'shipped'); }} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '1rem', fontWeight: 950, background: '#3b82f6', fontSize: '0.85rem' }}>ASSIGN DOOR DELIVERY</button>}
                                                    {order.status === 'shipped' && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'delivered'); }} className="btn btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '1rem', fontWeight: 950, background: '#10b981', fontSize: '0.85rem' }}>MARK DELIVERED & COMPLETE</button>}
                                                    
                                                    {['delivered', 'completed'].includes(order.status) && <div style={{ padding: '0.75rem 2rem', borderRadius: '1rem', fontWeight: 950, background: '#dcfce7', color: '#166534', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16} /> TRANSACTION SUCCESSFULLY COMPLETED</div>}

                                                    {['pending', 'approved'].includes(order.status) && <button onClick={(e) => { e.stopPropagation(); updateStatus(order.id, 'rejected'); }} className="btn btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '1rem', fontWeight: 950, color: '#ef4444', border: '1.5px solid #fee2e2', fontSize: '0.85rem' }}>REJECT</button>}
                                                    <button onClick={(e) => { e.stopPropagation(); handlePrint(order); }} className="btn btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '1rem', fontWeight: 950, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}><Printer size={16} /> INVOICE</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 style={{ marginBottom: '2rem', fontWeight: 950, fontSize: '1rem', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '1rem' }}><Layers size={21} color="var(--primary)" /> Fulfillment Timeline</h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                                                {[
                                                    { label: 'Pending', status: 'pending', color: '#f59e0b' },
                                                    { label: 'Approved', status: 'approved', color: '#06b6d4' },
                                                    { label: 'Packed', status: 'processing', color: '#3b82f6' },
                                                    { label: 'Out for Delivery', status: 'shipped', color: '#8b5cf6' },
                                                    { label: 'Delivered', status: 'delivered', color: '#a855f7' },
                                                    { label: 'Complete', status: 'completed', color: '#10b981' }
                                                ].map((step, sIdx, sArr) => {
                                                    const orderStepIdx = sArr.findIndex(s => s.status === order.status);
                                                    const isResolved = orderStepIdx > sIdx;
                                                    const isActive = orderStepIdx === sIdx;
                                                    return (
                                                        <div key={sIdx} style={{ display: 'flex', gap: '1.5rem' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                                <div style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    borderRadius: '50%',
                                                                    background: isResolved || isActive ? step.color : '#e2e8f0',
                                                                    border: '3px solid white',
                                                                    boxShadow: `0 0 0 1px ${isResolved || isActive ? step.color : '#f1f5f9'}`,
                                                                    zIndex: 1
                                                                }}></div>
                                                                {sIdx !== sArr.length - 1 && <div style={{ width: '3px', flex: 1, background: isResolved ? step.color : '#f1f5f9', minHeight: '2.5rem', margin: '2px 0' }}></div>}
                                                            </div>
                                                            <div style={{ paddingBottom: '2.5rem', flex: 1, marginTop: '-2px' }}>
                                                                <p style={{
                                                                    margin: 0,
                                                                    fontSize: '0.95rem',
                                                                    fontWeight: 950,
                                                                    color: isResolved || isActive ? 'var(--dark)' : '#94a3b8'
                                                                }}>{step.label}</p>
                                                                {isActive && <span style={{ fontSize: '0.7rem', color: step.color, fontWeight: 950, display: 'block', marginTop: '0.2rem' }}>LAST UPDATE</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* --- PRINT OVERLAY (EXISTING) --- */}
            {showInvoice && (
                <div id="invoice-print-area" className="print-only" style={{ padding: '3rem', color: 'black', background: 'white' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 950 }}>SMART GROCERY</h1>
                        <p style={{ margin: '0.5rem 0', fontWeight: 800 }}>ULTRA-PREMIUM RETAIL</p>
                        <div style={{ borderBottom: '2px solid #000', margin: '1.5rem 0' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                        <div>
                            <p style={{ margin: 0, fontWeight: 950 }}>INVOICE: #{showInvoice.invoice_id}</p>
                            <p style={{ margin: 0 }}>CUSTOMER: {showInvoice.customer_name || 'GUEST'}</p>
                            <p style={{ margin: 0 }}>DESTINATION: {showInvoice.shipping_address || 'STORE'}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0 }}>DATE: {new Date(showInvoice.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #000', textAlign: 'left' }}>
                                <th style={{ padding: '0.5rem 0' }}>ITEM</th>
                                <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '1rem 0' }}>RETAIL MULTI-PACK GRP</td>
                                <td style={{ padding: '1rem 0', textAlign: 'right' }}>₹{Number(showInvoice.final_amount).toLocaleString('en-IN')}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ borderTop: '2px solid #000', paddingTop: '1rem', textAlign: 'right' }}>
                        <h2 style={{ margin: 0, fontWeight: 950 }}>TOTAL: ₹{Number(showInvoice.final_amount).toLocaleString('en-IN')}</h2>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '3rem', fontWeight: 950 }}>*** THANK YOU ***</p>
                    <button className="no-print" onClick={() => setShowInvoice(null)} style={{ marginTop: '2rem' }}>CLOSE</button>
                </div>
            )}

            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-print-area, #invoice-print-area * { visibility: visible; }
                    #invoice-print-area { position: absolute; left: 0; top: 0; width: 100%; border: none; }
                    .no-print { display: none !important; }
                }
                .print-only { display: none; }
                @media print { .print-only { display: block; } }
            `}</style>
        </div>
    );
};

export default AdminOrders;
