import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Percent, Plus, Trash2, Calendar, Tag, Layers, Package, X } from 'lucide-react';

const AdminDiscounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', percentage: '', type: 'all', target_id: '' });

    useEffect(() => {
        fetchDiscounts();
        fetchMeta();
    }, []);

    const fetchDiscounts = async () => {
        const res = await api.discount.getAll();
        setDiscounts(res.data);
    };

    const fetchMeta = async () => {
        const [catRes, prodRes] = await Promise.all([
            api.product.getCategories(),
            api.product.getAll()
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.discount.add(formData);
            setShowModal(false);
            setFormData({ name: '', percentage: '', type: 'all', target_id: '' });
            fetchDiscounts();
            alert('Discount applied to products successfully!');
        } catch (err) {
            alert('Failed to apply discount');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Remove this discount and reset prices?')) {
            await api.discount.delete(id);
            fetchDiscounts();
        }
    };

    return (
        <div className="admin-discounts-container" style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Festival & Celebration Discounts</h1>
                    <p style={{ color: '#64748b' }}>Apply store-wide or category-specific discounts for special occasions.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Percent size={20} /> New Sale Event
                </button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {discounts.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                        <Percent size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                        <h3>No Active Sale Events</h3>
                        <p style={{ color: '#64748b' }}>Start a festival sale by clicking the button above.</p>
                    </div>
                ) : discounts.map(d => (
                    <div key={d.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--primary)' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ margin: 0, color: 'var(--primary)' }}>{d.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                    <Tag size={14} />
                                    <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{d.type} SALE</span>
                                </div>
                            </div>
                            <div style={{ background: 'var(--primary-light)', padding: '0.5rem 0.75rem', borderRadius: '0.75rem', fontWeight: 900, fontSize: '1.25rem', color: 'var(--primary)' }}>
                                {d.percentage}% OFF
                            </div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                            Created on {new Date(d.created_at).toLocaleDateString()}
                        </p>

                        <button onClick={() => handleDelete(d.id)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', background: '#fee2e2', color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Trash2 size={16} /> End Sale Event
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '500px', padding: '2.5rem', borderRadius: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ margin: 0 }}>Launch Sale Event</h2>
                            <button onClick={() => setShowModal(false)} className="btn-icon"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#64748b' }}>EVENT NAME</label>
                                <input type="text" required placeholder="Ex: Diwali Blast, Pongal Special" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ height: '50px' }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#64748b' }}>DISCOUNT PERCENTAGE (%)</label>
                                <input type="number" required placeholder="Ex: 20" min="1" max="99" value={formData.percentage} onChange={e => setFormData({ ...formData, percentage: e.target.value })} style={{ height: '50px' }} />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#64748b' }}>APPLY TO</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                                    {['all', 'category', 'product'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: t, target_id: '' })}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '0.75rem',
                                                fontSize: '0.8rem',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                background: formData.type === t ? 'var(--primary)' : '#f8fafc',
                                                color: formData.type === t ? 'white' : '#64748b',
                                                border: '1px solid ' + (formData.type === t ? 'var(--primary)' : '#e2e8f0')
                                            }}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.type === 'category' && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#64748b' }}>SELECT CATEGORY</label>
                                    <select required value={formData.target_id} onChange={e => setFormData({ ...formData, target_id: e.target.value })} style={{ height: '50px' }}>
                                        <option value="">Select a category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}

                            {formData.type === 'product' && (
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.85rem', color: '#64748b' }}>SELECT PRODUCT</label>
                                    <select required value={formData.target_id} onChange={e => setFormData({ ...formData, target_id: e.target.value })} style={{ height: '50px' }}>
                                        <option value="">Select a product</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            )}

                            <button className="btn btn-primary" style={{ width: '100%', height: '55px', marginTop: '1rem', fontSize: '1rem' }}>
                                ACTIVATE SALE EVENT
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDiscounts;
