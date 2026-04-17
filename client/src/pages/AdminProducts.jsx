import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Plus, Edit, Trash2, X, Eye, EyeOff, Tag, Package, Search, Filter, 
    Layers, BadgePercent, Activity, Trash, Check, AlertCircle, 
    Image as ImageIcon, Sparkles, Zap, Barcode, Truck, Wallet, Calendar, AlertTriangle
} from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '', 
        brand_name: '',
        barcode: '',
        category_id: '', 
        price: '', 
        purchase_price: '',
        discount: '', 
        stock: '', 
        min_stock: '', 
        expiry_date: '', 
        status: 'active', 
        is_published: 1, 
        unit: 'kg', 
        supplier_name: '',
        supplier_contact: '',
        supplier_address: '',
        variations: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        await Promise.all([fetchProducts(), fetchCategories()]);
        setLoading(false);
    };

    const fetchProducts = async () => {
        const res = await api.product.getAll();
        setProducts(res.data);
    };

    const fetchCategories = async () => {
        const res = await api.product.getCategories();
        setCategories(res.data);
    };

    const handleEdit = (product) => {
        setFormData({
            name: product.name,
            brand_name: product.brand_name || '',
            barcode: product.barcode || '',
            category_id: product.category_id,
            price: product.price,
            purchase_price: product.purchase_price || '',
            discount: product.discount,
            stock: product.stock,
            min_stock: product.min_stock,
            expiry_date: product.expiry_date ? product.expiry_date.split('T')[0] : '',
            status: product.status,
            is_published: product.is_published,
            unit: product.unit || 'kg',
            supplier_name: product.supplier_name || '',
            supplier_contact: product.supplier_contact || '',
            supplier_address: product.supplier_address || '',
            variations: product.variations || []
        });
        setCurrentId(product.id);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('IRREVERSIBLE ACTION: Are you certain you want to purge this product from the master registry?')) {
            await api.product.delete(id);
            fetchProducts();
        }
    };

    const togglePublish = async (product) => {
        const newStatus = product.is_published ? 0 : 1;
        const data = new FormData();
        Object.keys(product).forEach(key => {
            if (!['image', 'category_name', 'variations', 'created_at'].includes(key)) {
                data.append(key, product[key]);
            }
        });
        data.set('is_published', newStatus);

        try {
            await api.product.update(product.id, data);
            fetchProducts();
        } catch (err) {
            console.error('Failed to update status');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'variations') {
                data.append(key, JSON.stringify(formData[key]));
            } else {
                data.append(key, formData[key] === null ? '' : formData[key]);
            }
        });
        if (imageFile) data.append('image', imageFile);

        try {
            if (editMode) {
                await api.product.update(currentId, data);
            } else {
                await api.product.create(data);
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (err) {
            console.error('Operation failed');
        }
    };

    const addVariation = () => {
        setFormData({
            ...formData,
            variations: [...formData.variations, { name: '', price: '', stock: '' }]
        });
    };

    const removeVariation = (index) => {
        const newVars = [...formData.variations];
        newVars.splice(index, 1);
        setFormData({ ...formData, variations: newVars });
    };

    const updateVariation = (index, field, value) => {
        const newVars = [...formData.variations];
        newVars[index][field] = value;
        setFormData({ ...formData, variations: newVars });
    };

    const resetForm = () => {
        setFormData({ 
            name: '', brand_name: '', barcode: '', category_id: '', price: '', purchase_price: '', 
            discount: '', stock: '', min_stock: '', expiry_date: '', status: 'active', 
            is_published: 1, unit: 'kg', supplier_name: '', supplier_contact: '', 
            supplier_address: '', variations: [] 
        });
        setImageFile(null);
        setEditMode(false);
        setCurrentId(null);
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.barcode && p.barcode.includes(searchTerm))
    );

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 800, color: '#64748b' }}>INDEXING INVENTORY...</p>
        </div>
    );

    return (
        <div className="admin-products-slender" style={{ padding: '0.5rem', maxWidth: '1600px', margin: '0 auto' }}>
            
            {/* --- SLENDERIZED HEADER --- */}
            <header style={{ marginBottom: '1.5rem', animation: 'animate-up 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 950, fontSize: '1.75rem', margin: 0, letterSpacing: '-0.02em', color: 'var(--dark)' }}>Advanced Registry</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>Managing {products.length} distinct commodity entities.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1, maxWidth: '600px', justifyContent: 'flex-end' }}>
                        <div style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', borderRadius: '1rem', height: '48px', flex: 1, background: 'white', border: '1px solid #e2e8f0' }}>
                            <Search size={18} color="#94a3b8" style={{ marginRight: '0.75rem' }} />
                            <input
                                type="text"
                                placeholder="Search Name or Barcode..."
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 700, width: '100%', fontSize: '0.85rem', color: 'var(--dark)' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ padding: '0 1.5rem', height: '48px', borderRadius: '1rem', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Plus size={20} /> INGEST NEW
                        </button>
                    </div>
                </div>
            </header>

            {/* --- STRUCTURED DATA GRID --- */}
            <div className="premium-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div className="table-wrapper" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
                        <thead style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0', width: '25%' }}>Entity & Identification</th>
                                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Classification</th>
                                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Finances (Profit)</th>
                                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Stock / Expiry</th>
                                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'center', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0', width: '80px' }}>Live</th>
                                <th style={{ padding: '0.85rem 1.25rem', textAlign: 'center', color: '#475569', fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase', width: '140px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p, idx) => {
                                const profit = p.final_price - (p.purchase_price || 0);
                                const isLow = p.stock <= p.min_stock;
                                return (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'white' : '#fcfdfe' }}>
                                        <td style={{ padding: '0.75rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <img
                                                    src={`/uploads/products/${p.image}`}
                                                    alt=""
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'; }}
                                                    style={{ width: '42px', height: '42px', borderRadius: '0.5rem', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                                                />
                                                <div style={{ minWidth: 0 }}>
                                                    <span style={{ fontWeight: 800, display: 'block', fontSize: '0.88rem', color: 'var(--dark)' }}>{p.name}</span>
                                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.1rem' }}>
                                                        <span style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 800 }}>{p.brand_name || 'Generic'}</span>
                                                        <span style={{ fontSize: '0.62rem', color: 'var(--primary)', fontWeight: 800 }}>ID: {p.barcode || p.id}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                                            <div style={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', display: 'inline-block' }}>{p.category_name}</div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.3rem', fontWeight: 600 }}>Supplier: {p.supplier_name || 'Direct'}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <div style={{ fontWeight: 900, fontSize: '0.92rem', color: 'var(--dark)' }}>₹{p.final_price} <span style={{ fontSize: '0.6rem', color: '#10b981' }}>(+{profit.toFixed(2)})</span></div>
                                                <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>Buy: ₹{p.purchase_price || 0}</div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1.25rem', borderRight: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontWeight: 900, fontSize: '0.9rem', color: isLow ? '#ef4444' : 'var(--dark)' }}>{p.stock} {p.unit}</span>
                                                {isLow && <AlertTriangle size={12} color="#ef4444" />}
                                            </div>
                                            <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600 }}>Exp: {p.expiry_date ? p.expiry_date.split('T')[0] : 'N/A'}</div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center', borderRight: '1px solid #f1f5f9' }}>
                                            <button onClick={() => togglePublish(p)} style={{ background: p.is_published ? '#dcfce7' : '#f1f5f9', border: '1px solid ' + (p.is_published ? '#bbf7d0' : '#e2e8f0'), color: p.is_published ? '#166534' : '#64748b', padding: '0.3rem 0.6rem', borderRadius: '0.4rem', cursor: 'pointer', fontSize: '0.65rem', fontWeight: 800 }}>
                                                {p.is_published ? 'LIVE' : 'HIDDEN'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
                                                <button onClick={() => handleEdit(p)} style={{ color: '#2563eb', background: 'white', border: '1px solid #e2e8f0', padding: '0.4rem', borderRadius: '0.4rem' }}><Edit size={14} /></button>
                                                <button onClick={() => handleDelete(p.id)} style={{ color: '#dc2626', background: 'white', border: '1px solid #e2e8f0', padding: '0.4rem', borderRadius: '0.4rem' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- ADVANCED REGISTRY MODAL --- */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(10px)', padding: '1rem' }}>
                    <div className="premium-card" style={{ width: '100%', maxWidth: '1000px', maxHeight: '95vh', overflowY: 'auto', borderRadius: '2rem', padding: '2.5rem', background: 'white' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div>
                                <h1 style={{ fontWeight: 950, fontSize: '1.75rem', margin: 0 }}>{editMode ? 'Modify Entity' : 'Ingest Advanced Product'}</h1>
                                <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.85rem' }}>Full attribute enrollment for real-time inventory synchronization.</p>
                            </div>
                            <button onClick={() => setShowModal(false)} style={{ background: '#f8fafc', border: 'none', padding: '0.75rem', borderRadius: '1rem', cursor: 'pointer' }}><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                                
                                {/* Section 1: Core Details */}
                                <div style={{ gridColumn: 'span 3', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                   <Zap size={18} color="var(--primary)" /> <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 950 }}>BASIC IDENTITY</h3>
                                </div>
                                
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Product Label</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="e.g., Organic Basmati Rice" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Identification / Barcode</label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #f1f5f9', borderRadius: '0.85rem', padding: '0 1rem' }}>
                                        <Barcode size={18} color="#94a3b8" />
                                        <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} style={{ border: 'none', background: 'transparent', height: '52px', padding: '0 0.5rem', fontWeight: 800, width: '100%' }} placeholder="Scanner lookup..." />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Brand / Manufacturer</label>
                                    <input type="text" value={formData.brand_name} onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="Brand Name" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Classification</label>
                                    <select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} required style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }}>
                                        <option value="">Select Category</option>
                                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Metric Unit</label>
                                    <select value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }}>
                                        <option value="kg">Kilogram (kg)</option>
                                        <option value="liter">Liter (L)</option>
                                        <option value="pieces">Pieces (pcs)</option>
                                        <option value="packet">Packet (pkt)</option>
                                    </select>
                                </div>

                                {/* Section 2: Financials & Stock */}
                                <div style={{ gridColumn: 'span 3', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                   <Wallet size={18} color="var(--primary)" /> <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 950 }}>FINANCIALS & INVENTORY</h3>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Acquisition Price (₹)</label>
                                    <input type="number" step="0.01" value={formData.purchase_price} onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })} required style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="Buying Price" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>MSRP / Selling (₹)</label>
                                    <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="Retail Price" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Stock Quantity</label>
                                    <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Safety Floor (Alert)</label>
                                    <input type="number" value={formData.min_stock} onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Expiry Management</label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '2px solid #f1f5f9', borderRadius: '0.85rem', padding: '0 1rem' }}>
                                        <Calendar size={18} color="#94a3b8" />
                                        <input type="date" value={formData.expiry_date} onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })} style={{ border: 'none', background: 'transparent', height: '52px', padding: '0 0.5rem', fontWeight: 800, width: '100%' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Incentive (%)</label>
                                    <input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="0" />
                                </div>

                                {/* Section 3: Suppliers */}
                                <div style={{ gridColumn: 'span 3', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                   <Truck size={18} color="var(--primary)" /> <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 950 }}>SUPPLIER PROCUREMENT</h3>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Supplier Name</label>
                                    <input type="text" value={formData.supplier_name} onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="Company X" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Contact Line</label>
                                    <input type="text" value={formData.supplier_contact} onChange={(e) => setFormData({ ...formData, supplier_contact: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="+91..." />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Warehouse Address</label>
                                    <input type="text" value={formData.supplier_address} onChange={(e) => setFormData({ ...formData, supplier_address: e.target.value })} style={{ width: '100%', height: '52px', borderRadius: '0.85rem', background: '#f8fafc', border: '2px solid #f1f5f9', padding: '0 1rem', fontWeight: 800 }} placeholder="Location..." />
                                </div>

                                {/* Image Section */}
                                <div style={{ gridColumn: 'span 3', marginTop: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 950, fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>Visual Catalog Asset</label>
                                    <div style={{ border: '2px dashed #e2e8f0', padding: '2rem', borderRadius: '1.5rem', textAlign: 'center', background: '#f8fafc' }}>
                                        <input type="file" onChange={(e) => setImageFile(e.target.files[0])} style={{ display: 'none' }} id="prod-img-adv" />
                                        <label htmlFor="prod-img-adv" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <ImageIcon size={28} color="var(--primary)" />
                                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--dark)' }}>{imageFile ? imageFile.name : 'Select Product Visual'}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                <button type="button" className="glass-pill" style={{ flex: 1, height: '60px', borderRadius: '1rem', fontWeight: 900, fontSize: '1rem', border: 'none', background: '#f1f5f9' }} onClick={() => setShowModal(false)}>CANCEL</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 2, height: '60px', borderRadius: '1rem', fontWeight: 950, fontSize: '1rem' }}>{editMode ? 'UPDATE REGISTRY' : 'INGEST PRODUCT'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
