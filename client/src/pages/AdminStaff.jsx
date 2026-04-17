import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Edit, Trash2, UserCheck, UserX, X, Shield, Phone, Mail, MapPin, Calendar, Briefcase, Eye, EyeOff, User, Fingerprint, Lock } from 'lucide-react';

const AdminStaff = () => {
    const [staff, setStaff] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', dob: '', gender: 'male', address: '', designation: 'Sales Staff', joining_date: new Date().toISOString().split('T')[0], password: ''
    });
    const [newCredentials, setNewCredentials] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const res = await api.auth.getStaff();
            setStaff(res.data);
        } catch (err) {
            console.error('Error fetching staff', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            const newStatus = user.status === 'active' ? 'inactive' : 'active';
            await api.auth.updateUser(user.id, { ...user, status: newStatus });
            fetchStaff();
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff member permanently?')) {
            try {
                await api.auth.deleteUser(id);
                fetchStaff();
            } catch (err) {
                alert('Failed to delete staff member');
            }
        }
    };

    const handleEdit = (user) => {
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            dob: user.dob ? user.dob.split('T')[0] : '',
            gender: user.gender || 'male',
            address: user.address || '',
            designation: user.designation || 'Sales Staff',
            joining_date: user.joining_date ? user.joining_date.split('T')[0] : (user.created_at ? user.created_at.split('T')[0] : ''),
            password: ''
        });
        setCurrentId(user.id);
        setEditMode(true);
        setShowModal(true);
    };

    const generateCredentials = (name) => {
        const id = 'STF' + Math.floor(1000 + Math.random() * 8999);
        const pass = name.split(' ')[0].toLowerCase() + '@' + Math.floor(100 + Math.random() * 899);
        return { id, pass };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await api.auth.updateUser(currentId, { ...formData, role: 'staff' });
                setShowModal(false);
                fetchStaff();
            } else {
                const { id, pass: autoPass } = generateCredentials(formData.name);
                const finalPass = formData.password && formData.password.trim() !== '' ? formData.password : autoPass;
                const submissionData = {
                    ...formData,
                    staff_id: id,
                    password: finalPass,
                    email: formData.email || `${id.toLowerCase()}@smartgrocery.com`
                };
                await api.auth.addStaff(submissionData);
                setNewCredentials({ id, pass: finalPass, name: formData.name });
                fetchStaff();
            }
        } catch (err) {
            alert('Operation failed');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', email: '', phone: '', dob: '', gender: 'male', address: '', designation: 'Sales Staff', joining_date: new Date().toISOString().split('T')[0], password: '' });
        setEditMode(false);
        setCurrentId(null);
    };

    if (loading) return <div style={{ padding: '10rem', textAlign: 'center' }} className="loader">Loading Staff Management...</div>;

    return (
        <div className="admin-staff-container animate-fade" style={{ padding: window.innerWidth < 768 ? '0.25rem' : '0.5rem' }}>
            <header className="responsive-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', marginBottom: '2.5rem', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', fontWeight: 900, color: 'var(--dark)', letterSpacing: '-0.02em', marginBottom: '0.4rem', margin: 0 }}>
                        👤 Staff Directory
                    </h1>
                    <p style={{ color: '#64748b', fontWeight: 500, fontSize: '0.9rem', margin: 0 }}>
                        Manage employee access, roles, and status.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }} style={{ height: '52px', padding: '0 1.5rem', borderRadius: '0.85rem', fontWeight: 800, width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                    <Plus size={20} /> Add New Staff
                </button>
            </header>

            {/* NEW CREDENTIALS SHOWCASE MODAL */}
            {newCredentials && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(8px)', padding: '1rem' }}>
                    <div className="card animate-fade" style={{ width: '100%', maxWidth: '450px', padding: window.innerWidth < 768 ? '2rem 1.5rem' : '3.5rem', textAlign: 'center', borderRadius: '2rem', border: '2px solid var(--primary-light)' }}>
                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '64px', height: '64px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', transform: 'rotate(-5deg)' }}>
                            <Lock size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Account Created!</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem', fontWeight: 500, fontSize: '0.85rem' }}>Share these private credentials with <strong>{newCredentials.name}</strong></p>

                        <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '1.5rem', border: '2px dashed #cbd5e1', marginBottom: '2rem', position: 'relative' }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Staff ID / Username</span>
                                <p style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0.25rem 0', color: 'var(--dark)' }}>{newCredentials.id}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Temporary Password</span>
                                <p style={{ fontSize: '1.25rem', fontWeight: 900, margin: '0.25rem 0', color: 'var(--dark)' }}>{newCredentials.pass}</p>
                            </div>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', height: '54px', borderRadius: '1rem', fontWeight: 800 }} onClick={() => { setNewCredentials(null); setShowModal(false); resetForm(); }}>
                            Confirm & Close
                        </button>
                    </div>
                </div>
            )}

            <div className="scroll-container" style={{ overflowX: 'auto', background: 'white', borderRadius: '1.5rem', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <table className="staff-table" style={{ minWidth: '900px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Staff / ID</th>
                            <th style={{ width: '30%' }}>Contact / Location</th>
                            <th style={{ width: '20%' }}>Role & Joining</th>
                            <th style={{ width: '10%' }}>Status</th>
                            <th style={{ textAlign: 'center', width: '15%' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {staff.map(s => (
                            <tr key={s.id} className="staff-row">
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '0.85rem', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.9rem' }}>
                                            {s.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 900, fontSize: '0.95rem', color: 'var(--dark)' }}>{s.name}</p>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', background: 'var(--primary-light)', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.25rem' }}>
                                                <Fingerprint size={12} /> {s.staff_id}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563' }}>
                                            <Mail size={14} color="#94a3b8" /> {s.email}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#4b5563' }}>
                                            <Phone size={14} color="#94a3b8" /> {s.phone}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                                            <MapPin size={12} /> {s.address?.substring(0, 25)}...
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: 'var(--dark)', fontSize: '0.85rem' }}>
                                            <Shield size={14} color="var(--primary)" /> {s.designation || 'Staff'}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                                            <Calendar size={12} /> {new Date(s.joining_date || s.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleToggleStatus(s)}
                                        style={{
                                            padding: '0.4rem 0.75rem',
                                            borderRadius: '2rem',
                                            fontSize: '0.6rem',
                                            fontWeight: 900,
                                            textTransform: 'uppercase',
                                            border: 'none',
                                            cursor: 'pointer',
                                            background: s.status === 'active' ? '#10b981' : '#f43f5e',
                                            color: 'white',
                                            boxShadow: s.status === 'active' ? '0 4px 10px rgba(16, 185, 129, 0.15)' : '0 4px 10px rgba(244, 63, 94, 0.15)'
                                        }}
                                    >
                                        {s.status}
                                    </button>
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                                        <button onClick={() => handleEdit(s)} className="nav-icon-btn" style={{ background: '#f8fafc', color: '#3b82f6', width: '36px', height: '36px' }} title="Edit">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="nav-icon-btn" style={{ background: '#fff9f9', color: '#f43f5e', width: '36px', height: '36px' }} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* SLIDE-OVER STAFF PANEL - Now Mobile Responsive */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'flex-end', zIndex: 9999, backdropFilter: 'blur(4px)' }}>
                    <div className="animate-slide-in-right" style={{
                        width: window.innerWidth < 768 ? '100%' : '500px', height: '100vh', background: 'white',
                        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex',
                        flexDirection: 'column', overflow: 'hidden'
                    }}>
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b', margin: 0 }}>{editMode ? 'Edit Profile' : 'Register Staff'}</h2>
                                <p style={{ margin: '0.15rem 0 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>{editMode ? 'Modify employee details' : 'Add a new member to your team'}</p>
                            </div>
                            <button onClick={() => { setShowModal(false); resetForm(); }} className="close-btn-round" style={{ width: '36px', height: '36px' }}><X size={18} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ flex: 1, overflowY: 'auto', padding: window.innerWidth < 768 ? '1.5rem' : '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div className="form-group-custom">
                                    <label>FULL NAME</label>
                                    <div className="input-with-icon">
                                        <User className="icon" size={18} />
                                        <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Rajesh Kumar" />
                                    </div>
                                </div>

                                <div className="grid-responsive" style={{ '--grid-cols': '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group-custom">
                                        <label>GENDER</label>
                                        <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group-custom">
                                        <label>JOINING DATE</label>
                                        <input type="date" required value={formData.joining_date} onChange={e => setFormData({ ...formData, joining_date: e.target.value })} />
                                    </div>
                                </div>

                                <div className="form-group-custom">
                                    <label>MOBILE NUMBER</label>
                                    <div className="input-with-icon">
                                        <Phone className="icon" size={18} />
                                        <input type="text" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="10-digit number" />
                                    </div>
                                </div>

                                <div className="form-group-custom">
                                    <label>EMAIL ID</label>
                                    <div className="input-with-icon">
                                        <Mail className="icon" size={18} />
                                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="staff@smartgrocery.com" />
                                    </div>
                                </div>

                                <div className="form-group-custom">
                                    <label>DESIGNATION / ROLE</label>
                                    <div className="input-with-icon">
                                        <Briefcase className="icon" size={18} />
                                        <select value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })}>
                                            <option value="Cashier">Cashier</option>
                                            <option value="Inventory Manager">Inventory Manager</option>
                                            <option value="Sales Agent">Sales Executive</option>
                                            <option value="Supervisor">Supervisor</option>
                                            <option value="Delivery Staff">Delivery Representative</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group-custom">
                                    <label>RESIDENTIAL ADDRESS</label>
                                    <textarea required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Full permanent address" />
                                </div>

                                <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
                                    {editMode && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', display: 'block', marginBottom: '0.45rem', textTransform: 'uppercase' }}>Permanent Staff ID</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 900, color: 'var(--primary)', fontSize: '1rem' }}>
                                                <Fingerprint size={18} /> {staff.find(s => s.id === currentId)?.staff_id}
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-group-custom" style={{ margin: 0 }}>
                                        <label>{editMode ? 'UPDATE PASSWORD' : 'SET PASSWORD (OPTIONAL)'}</label>
                                        <div className="input-with-icon">
                                            <Lock className="icon" size={18} />
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                placeholder={editMode ? "Leave blank to keep current" : "Auto-generated if empty"}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {!editMode && (
                                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem', borderRadius: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#166534', fontSize: '0.75rem' }}>
                                        <Shield size={16} />
                                        <span>System will auto-generate <b>Staff ID</b> & Secure <b>Password</b></span>
                                    </div>
                                )}
                            </div>

                            <div className="panel-actions" style={{ marginTop: '2.5rem', display: 'flex', gap: '0.75rem', paddingBottom: '1rem' }}>
                                <button type="button" className="btn btn-secondary" style={{ flex: 1, height: '52px', border: '1px solid #e2e8f0' }} onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1.5, height: '52px' }}>{editMode ? 'Update Profile' : 'Add Member'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .staff-table { width: 100%; border-collapse: separate; border-spacing: 0 0.5rem; }
                .staff-table th { padding: 1rem 1.25rem; text-align: left; color: #94a3b8; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; border: none; }
                .staff-row { background: white; transition: all 0.2s; }
                .staff-row:hover { background: #fcfcfc; }
                .staff-row td { padding: 1rem 1.25rem; border-top: 1px solid #f8fafc; border-bottom: 1px solid #f8fafc; }
                .staff-row td:first-child { border-left: 1px solid #f8fafc; border-top-left-radius: 1rem; border-bottom-left-radius: 1rem; }
                .staff-row td:last-child { border-right: 1px solid #f8fafc; border-top-right-radius: 1rem; border-bottom-right-radius: 1rem; }
                
                .form-group-custom label { display: block; font-size: 0.7rem; font-weight: 900; color: #475569; margin-bottom: 0.5rem; letter-spacing: 0.05em; }
                .input-with-icon { position: relative; }
                .input-with-icon .icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
                .form-group-custom input, .form-group-custom select, .form-group-custom textarea { 
                    width: 100%; height: 48px; border: 1.5px solid #edf2f7; border-radius: 0.75rem; padding: 0 1rem; font-size: 0.9rem; background: #fff; transition: all 0.2s;
                }
                .input-with-icon input, .input-with-icon select { padding-left: 2.75rem; }
                .form-group-custom textarea { height: 80px; padding: 0.85rem; resize: none; }
                input:focus, select:focus, textarea:focus { border-color: var(--primary); outline: none; background: #fff; }

                .close-btn-round { border-radius: 50%; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; display: flex; alignItems: center; justifyContent: center; transition: all 0.2s; }
                .close-btn-round:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; }
            `}</style>
        </div>
    );
};

export default AdminStaff;
