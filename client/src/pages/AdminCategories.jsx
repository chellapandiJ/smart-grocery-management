import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit2, Layers, X, Check, Search, Activity, Zap, Sparkles, FolderPlus, ArrowRight } from 'lucide-react';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [editMode, setEditMode] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await api.product.getCategories();
            setCategories(res.data);
        } catch (err) {
            console.error('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            await api.product.createCategory({ name });
            setName('');
            fetchCategories();
        } catch (err) {
            console.error('Failed to add category');
        }
    };

    const handleUpdate = async (id) => {
        if (!editName.trim()) return;
        try {
            await api.product.updateCategory(id, { name: editName });
            setEditMode(null);
            fetchCategories();
        } catch (err) {
            console.error('Failed to update category');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await api.product.deleteCategory(id);
            fetchCategories();
        } catch (err) {
            console.error('Failed to delete category');
        }
    };

    const startEdit = (cat) => {
        setEditMode(cat.id);
        setEditName(cat.name);
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-spin" style={{ width: '50px', height: '50px', border: '4px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1.5rem', fontWeight: 800, color: '#64748b', fontSize: '0.9rem', letterSpacing: '0.05em' }}>SYNCING CATALOGUE...</p>
        </div>
    );

    return (
        <div className="admin-categories-slender" style={{ padding: '0.5rem', maxWidth: '1400px', margin: '0 auto' }}>
            
            {/* --- SLENDER HEADER --- */}
            <header style={{ marginBottom: '2rem', animation: 'animate-up 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 950, fontSize: '1.75rem', margin: 0, letterSpacing: '-0.02em', color: 'var(--dark)' }}>Category Management</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', marginTop: '0.2rem' }}>Organizing {categories.length} classification nodes.</p>
                    </div>
                    <div style={{ padding: '0.5rem 1rem', background: 'var(--primary-light)', borderRadius: '0.85rem', color: 'var(--primary-dark)', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={16} /> CLASSIFICATION CORE
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                
                {/* --- ADD CATEGORY SECTION --- */}
                <div style={{ animation: 'animate-up 0.6s ease-out' }}>
                    <div className="premium-card" style={{ padding: '2rem', borderRadius: '1.5rem', background: 'var(--white)', border: '1.5px solid #fff', boxShadow: '0 8px 30px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '0.75rem' }}>
                                <FolderPlus size={20} />
                            </div>
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: 'var(--dark)' }}>Create Node</h3>
                        </div>
                        
                        <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Label Name</label>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '0 1.25rem', borderRadius: '1rem', height: '56px', background: '#f8fafc', border: '2px solid #f1f5f9' }}>
                                    <Sparkles size={18} color="var(--primary)" style={{ marginRight: '0.75rem' }} />
                                    <input
                                        type="text"
                                        placeholder="Category name..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ border: 'none', outline: 'none', background: 'transparent', fontWeight: 800, width: '100%', fontSize: '0.95rem', color: 'var(--dark)' }}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ height: '56px', borderRadius: '1rem', fontWeight: 900, fontSize: '0.95rem', width: '100%', boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.3)' }}>
                                ACTIVATE NODE <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* --- STRUCTURED TABLE SECTION --- */}
                <div style={{ animation: 'animate-up 0.7s ease-out' }}>
                    <div className="premium-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0', width: '80px' }}>ID</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', borderRight: '1px solid #e2e8f0' }}>Classification Label</th>
                                    <th style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#475569', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', width: '140px' }}>Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, idx) => (
                                    <tr key={cat.id} style={{ 
                                        borderBottom: '1px solid #e2e8f0', 
                                        background: idx % 2 === 0 ? 'white' : '#fcfdfe' 
                                    }}>
                                        <td style={{ padding: '0.85rem 1.5rem', borderRight: '1px solid #f1f5f9' }}>
                                            <span style={{ fontWeight: 900, fontSize: '0.8rem', color: '#94a3b8' }}>#{cat.id}</span>
                                        </td>
                                        <td style={{ padding: '0.85rem 1.5rem', borderRight: '1px solid #f1f5f9' }}>
                                            {editMode === cat.id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <input
                                                        type="text"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '0.75rem', border: '2px solid var(--primary)', outline: 'none', fontWeight: 800, fontSize: '0.85rem' }}
                                                        autoFocus
                                                    />
                                                    <button onClick={() => handleUpdate(cat.id)} style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', border: 'none', padding: '0.5rem', borderRadius: '0.75rem' }}><Check size={16} /></button>
                                                    <button onClick={() => setEditMode(null)} style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: 'none', padding: '0.5rem', borderRadius: '0.75rem' }}><X size={16} /></button>
                                                </div>
                                            ) : (
                                                <span style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--dark)' }}>{cat.name}</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '0.85rem 1.5rem', textAlign: 'center' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                                <button onClick={() => startEdit(cat)} style={{ color: '#2563eb', background: 'white', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex' }}><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(cat.id)} style={{ color: '#dc2626', background: 'white', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex' }}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <style>{`
                .premium-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
            `}</style>
        </div>
    );
};

export default AdminCategories;
