import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    AlertCircle, Calendar, Hash, Package, Search, History, TrendingUp, 
    TrendingDown, Barcode, Truck, Wallet, Filter, ExternalLink, Zap, 
    ChevronRight, Info, AlertTriangle, ShieldCheck, Box
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


const AdminInventory = () => {
    const [activeTab, setActiveTab] = useState('status');
    const [data, setData] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    
    // Dynamic Flow Analytics
    const [flowPeriod, setFlowPeriod] = useState('monthly');
    const [flowStartDate, setFlowStartDate] = useState('');
    const [flowEndDate, setFlowEndDate] = useState('');
    const [flowAnalytics, setFlowAnalytics] = useState(null);
    const [loadingFlow, setLoadingFlow] = useState(false);

    useEffect(() => {
        if (activeTab === 'logs') fetchFlowData();
    }, [activeTab, flowPeriod, flowStartDate, flowEndDate]);

    const fetchFlowData = async () => {
        if (flowPeriod === 'custom' && (!flowStartDate || !flowEndDate)) return;
        setLoadingFlow(true);
        try {
            const res = await api.admin.getFlowAnalytics({ period: flowPeriod, startDate: flowStartDate, endDate: flowEndDate });
            setFlowAnalytics(res.data || []);
        } catch (err) {
            console.error('Failed to fetch dynamic flow analytics');
        } finally {
            setLoadingFlow(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [statusRes, logsRes] = await Promise.all([
                api.admin.getInventoryStatus(),
                api.admin.getStockLogs()
            ]);
            setData(statusRes.data);
            setLogs(logsRes.data);
        } catch (err) {
            console.error('Failed to sync master inventory data');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you absolutely sure you want to remove this expired product permanently?')) return;
        try {
            await api.product.delete(id);
            fetchInitialData(); // Re-sync table
        } catch (err) {
            alert('Failed to delete product. Please try again.');
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 950, color: '#64748b', fontSize: '1rem', letterSpacing: '0.05em' }}>CALIBRATING GLOBAL STOCK...</p>
        </div>
    );

    if (!data) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <AlertTriangle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
            <p style={{ fontWeight: 900, color: '#64748b' }}>UNABLE TO RETRIEVE INVENTORY PROTOCOL.</p>
        </div>
    );

    const products = data.allProducts || [];
    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.barcode && p.barcode.includes(searchTerm));
        const matchesDate = dateFilter ? (p.created_at && new Date(p.created_at).toISOString().split('T')[0] === dateFilter) : true;
        return matchesSearch && matchesDate;
    });

    const filteredLogs = logs.filter(log => {
        if (!dateFilter) return true;
        return new Date(log.created_at).toISOString().split('T')[0] === dateFilter;
    });

    return (
        <div className="admin-inventory-suite" style={{ padding: '0.5rem', maxWidth: '1600px', margin: '0 auto' }}>
            
            {/* --- SLENDER HEADER --- */}
            <header style={{ marginBottom: '2rem', animation: 'animate-up 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 950, fontSize: '1.75rem', margin: 0, letterSpacing: '-0.02em', color: 'var(--dark)' }}>Inventory Command Center</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>Unified stock sovereignty for {data.totalCount} active commodity nodes.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', background: 'white', padding: '0.5rem 1.25rem', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Warehouse Valuation</span>
                            <span style={{ fontWeight: 950, fontSize: '1.1rem', color: 'var(--primary-dark)' }}>₹{data.totalValuation.toLocaleString()}</span>
                        </div>
                        <div style={{ width: '1px', background: '#f1f5f9' }}></div>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center' }}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                </div>
            </header>

            {/* --- MODULAR KPI GRID --- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Low Stock Alerts', value: data.lowStock.length, sub: 'Units near floor', color: '#ef4444', icon: AlertTriangle },
                    { label: 'Out of Stock', value: data.outOfStock.length, sub: 'Immediate restocking required', color: '#64748b', icon: Box },
                    { label: 'Expiry Alerts', value: data.expiryAlert.length, sub: 'Next 30 day termination', color: '#f59e0b', icon: Calendar },
                    { label: 'Healthy Packages', value: data.totalCount - data.lowStock.length - data.outOfStock.length, sub: 'Optimal stock levels', color: '#10b981', icon: ShieldCheck }
                ].map((kpi, i) => (
                    <div key={i} className="premium-card" style={{ padding: '1.25rem', borderRadius: '1.25rem', borderLeft: `4px solid ${kpi.color}`, background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{kpi.label}</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: 950, color: 'var(--dark)' }}>{kpi.value}</span>
                            </div>
                            <div style={{ background: `${kpi.color}15`, color: kpi.color, padding: '0.5rem', borderRadius: '0.75rem' }}>
                                <kpi.icon size={18} />
                            </div>
                        </div>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{kpi.sub}</p>
                    </div>
                ))}
            </div>

            {/* --- TABBED NAVIGATION --- */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.4rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                    {[
                        { id: 'status', label: 'Main Inventory', icon: Package },
                        { id: 'logs', label: 'Stock Flow (Sales/Refill)', icon: History },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '0.6rem 1.25rem',
                                borderRadius: '0.75rem',
                                background: activeTab === tab.id ? 'var(--dark)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : '#64748b',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={16} /> {tab.label.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input 
                        type="date" 
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        style={{ height: '44px', padding: '0 1rem', borderRadius: '0.85rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '0.85rem', color: '#64748b' }}
                    />
                    {activeTab === 'status' && (
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Lookup Entity/Barcode..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: '2.75rem', height: '44px', borderRadius: '0.85rem', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, fontSize: '0.85rem', width: '100%' }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* --- MAIN CONTENT ENGINE --- */}
            <div style={{ minHeight: '60vh' }}>
                {activeTab === 'status' ? (
                    <div className="premium-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Entity Details</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Stock Status</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Pricing & Profit</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Supplier Details</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Timeline</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p, idx) => {
                                    const profit = p.final_price - (p.purchase_price || 0);
                                    const marginPercent = ((profit / p.final_price) * 100).toFixed(1);
                                    const isLow = p.stock <= p.min_stock;
                                    const isExpired = p.expiry_date && new Date(p.expiry_date) < new Date();
                                    
                                    let rowBg = 'white';
                                    let rowBorder = '1px solid #f1f5f9';
                                    
                                    if (isExpired) {
                                        rowBg = '#fef2f2'; // Red warning
                                        rowBorder = '1px solid #fca5a5';
                                    } else if (isLow) {
                                        rowBg = '#fefce8'; // Yellow alert
                                        rowBorder = '1px solid #fde047';
                                    } else {
                                        rowBg = idx % 2 === 0 ? 'white' : '#fcfdfe';
                                    }

                                    return (
                                        <tr key={p.id} style={{ borderBottom: rowBorder, background: rowBg }}>
                                            <td style={{ padding: '0.85rem 1.5rem', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ position: 'relative' }}>
                                                        <img src={`/uploads/products/${p.image}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover', border: isExpired ? '2px solid #ef4444' : isLow ? '2px solid #eab308' : 'none' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'; }} />
                                                        {isLow && !isExpired && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#eab308', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={10} /></div>}
                                                        {isExpired && <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={10} /></div>}
                                                    </div>
                                                    <div>
                                                        <span style={{ fontWeight: 900, fontSize: '0.9rem', color: isExpired ? '#ef4444' : 'var(--dark)', display: 'block' }}>{p.name} {isExpired && '(EXPIRED)'}</span>
                                                        <span style={{ fontSize: '0.65rem', color: isExpired ? '#ef4444' : '#94a3b8', fontWeight: 800 }}>ID: {p.barcode || 'N/A'} • {p.brand_name || 'Generic'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.5rem', borderRight: '1px solid rgba(0,0,0,0.05)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '1rem', fontWeight: 950, color: isExpired ? '#ef4444' : isLow ? '#eab308' : 'var(--dark)' }}>{p.stock} <span style={{ fontSize: '0.65rem', color: 'inherit' }}>{p.unit}</span></span>
                                                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase' }}>Min Stock: {p.min_stock}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.5rem', borderRight: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span style={{ fontWeight: 950, fontSize: '0.9rem', color: '#10b981' }}>Profit: ₹{profit.toFixed(2)}</span>
                                                        <span style={{ background: '#dcfce7', color: '#166534', fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '0.3rem', fontWeight: 900 }}>{marginPercent}%</span>
                                                    </div>
                                                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 800 }}>SELL: ₹{p.final_price} • BUY: ₹{p.purchase_price}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.5rem', borderRight: '1px solid #f1f5f9' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Truck size={14} color="#94a3b8" />
                                                    <div>
                                                        <span style={{ fontWeight: 800, fontSize: '0.8rem', color: '#475569', display: 'block' }}>{p.supplier_name || 'Direct Procurement'}</span>
                                                        <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>{p.supplier_contact || 'No contact sync'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isExpired ? '#ef4444' : 'var(--dark)', display: 'block' }}>Exp: {p.expiry_date ? p.expiry_date.split('T')[0] : 'PERPETUAL'}</span>
                                                {isExpired ? (
                                                    <button onClick={() => handleDelete(p.id)} style={{ marginTop: '0.5rem', padding: '0.4rem 0.75rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><AlertTriangle size={12} /> REMOVE</button>
                                                ) : (
                                                    <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>SYN: {new Date(p.created_at).toLocaleDateString()}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : activeTab === 'logs' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        {/* --- DYNAMIC DATE-FILTERED PURCHASING ADVISOR START --- */}
                        <div className="premium-card" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'white', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ margin: 0, fontWeight: 950, color: 'var(--dark)' }}>Sales Volume Analyzer</h2>
                                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>View exactly which products, and how many were sold.</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <select 
                                        value={flowPeriod} 
                                        onChange={(e) => setFlowPeriod(e.target.value)}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontWeight: 800, color: 'var(--dark)', outline: 'none' }}
                                    >
                                        <option value="today">Today</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="custom">From to Date</option>
                                    </select>
                                    {flowPeriod === 'custom' && (
                                        <>
                                            <input type="date" value={flowStartDate} onChange={(e) => setFlowStartDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
                                            <span style={{ fontWeight: 800, color: '#94a3b8' }}>-</span>
                                            <input type="date" value={flowEndDate} onChange={(e) => setFlowEndDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }} />
                                        </>
                                    )}
                                </div>
                            </div>

                            {loadingFlow ? (
                                <p style={{ fontWeight: 800, color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>ANALYZING DATA SET...</p>
                            ) : flowAnalytics && flowAnalytics.length > 0 ? (
                                <div>
                                    <div style={{ height: '250px', width: '100%', marginBottom: '3rem', padding: '0 1rem' }}>
                                        <Bar 
                                            data={{
                                                labels: flowAnalytics.map(p => p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name),
                                                datasets: [{
                                                    label: 'Units Sold',
                                                    data: flowAnalytics.map(p => Number(p.sold_count)),
                                                    backgroundColor: 'rgba(56, 189, 248, 0.85)',
                                                    hoverBackgroundColor: 'rgba(14, 165, 233, 1)',
                                                    borderRadius: 4,
                                                }]
                                            }}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false }, tooltip: { padding: 10, cornerRadius: 8, titleFont: { size: 14 } } },
                                                scales: { y: { beginAtZero: true, grid: { color: '#f1f5f9' }, ticks: { precision: 0 } }, x: { grid: { display: false } } }
                                            }} 
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                                        {[...flowAnalytics].map((p, idx) => {

                                        return (
                                            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem', border: '1px solid #f1f5f9', borderRadius: '0.75rem' }}>
                                                <img src={`/uploads/products/${p.image}`} style={{ width: '40px', height: '40px', borderRadius: '0.5rem', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'; }} />
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span style={{ fontWeight: 900, color: 'var(--dark)', fontSize: '0.85rem' }}>{p.name} <span style={{ color: '#94a3b8', fontSize: '0.65rem' }}>| Stock: {p.stock}</span></span>
                                                        <span style={{ fontWeight: 950, color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{p.sold_count} Sold</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                </div>
                            ) : (
                                <p style={{ fontWeight: 800, color: '#94a3b8', textAlign: 'center', padding: '2rem', border: '2px dashed #e2e8f0', borderRadius: '1rem' }}>NO PRODUCTS WERE SOLD IN THIS PERIOD.</p>
                            )}
                        </div>
                        {/* --- DYNAMIC DATE-FILTERED PURCHASING ADVISOR END --- */}

                        <div className="premium-card" style={{ padding: 0, overflowX: 'auto', borderRadius: '1.25rem', border: '1px solid #e2e8f0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Timestamp</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Entity</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Direction</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Volume</th>
                                    <th style={{ padding: '0.85rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}>Protocol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.length === 0 ? (
                                    <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', fontWeight: 800, color: '#94a3b8' }}>NO LOGS FOUND FOR THIS DATE.</td></tr>
                                ) : filteredLogs.map((log, idx) => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                                        <td style={{ padding: '0.85rem 1.5rem', color: '#64748b', fontWeight: 700, fontSize: '0.8rem' }}>{new Date(log.created_at).toLocaleString()}</td>
                                        <td style={{ padding: '0.85rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={`/uploads/products/${log.product_image}`} alt="" style={{ width: '32px', height: '32px', borderRadius: '0.4rem', objectFit: 'cover' }} />
                                                <span style={{ fontWeight: 800, color: 'var(--dark)', fontSize: '0.85rem' }}>{log.product_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.5rem' }}>
                                            <span style={{ 
                                                display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.7rem', fontWeight: 950,
                                                background: log.type === 'IN' ? '#dcfce7' : '#fee2e2',
                                                color: log.type === 'IN' ? '#166534' : '#991b1b'
                                            }}>
                                                {log.type === 'IN' ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {log.type === 'IN' ? 'ACQUISITION' : 'SALE / DISPOSAL'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.5rem', fontWeight: 900, color: 'var(--dark)' }}>{log.quantity} UNITS</td>
                                        <td style={{ padding: '0.85rem 1.5rem', color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>
                                            {log.order_id ? `ORD-REF#${log.order_id}` : 'MANUAL SYNCHRONIZATION'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminInventory;
