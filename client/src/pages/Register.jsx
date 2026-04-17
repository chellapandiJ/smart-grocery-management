import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Settings, UserCheck } from 'lucide-react';

const Register = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = queryParams.get('role') || 'customer';

    const [userData, setUserData] = useState({
        name: '', // Changed from username to name to match backend
        email: '',
        password: '',
        role: initialRole
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth(); // Now correctly defined in AuthContext
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRoleChange = (role) => {
        setUserData({ ...userData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Register handles the API call and returns true on success
            const success = await register(userData);
            if (success) {
                navigate('/login');
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = () => {
        if (userData.role === 'admin') return '#0f172a';
        if (userData.role === 'staff') return '#334155';
        return '#064e3b';
    };

    return (
        <div className="luxury-auth-experience" style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc' }}>
            
            <div className="auth-visual-side hide-tablet" style={{ flex: 1.2, position: 'relative', overflow: 'hidden', borderRadius: '0 4rem 4rem 0' }}>
                <img src="https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Boutique" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="auth-overlay-art" style={{ background: `linear-gradient(to top, ${getRoleColor()}F2 0%, transparent 80%)` }}>
                    <div className="auth-badge-p">
                        <Sparkles size={16} /> <span>{userData.role.toUpperCase()} INITIALIZATION</span>
                    </div>
                    <h2 style={{ fontSize: '4.5rem', fontFamily: 'var(--font-serif)', color: 'white', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em' }}>
                        Create your <br /> <span style={{ fontStyle: 'italic', fontWeight: 400, color: 'rgba(255,255,255,0.8)' }}>Portal Identity.</span>
                    </h2>
                </div>
            </div>

            <div className="auth-form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                <div style={{ width: '100%', maxWidth: '550px' }}>
                    
                    <div className="auth-head-p" style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', marginBottom: '2.5rem' }}>
                            <ShoppingBag color={getRoleColor()} size={38} strokeWidth={2.5} />
                            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: getRoleColor() }}>Smart Grocery</span>
                        </div>
                        
                        <div className="role-selector-p">
                            <button type="button" onClick={() => handleRoleChange('customer')} className={userData.role === 'customer' ? 'active green' : ''}><User size={18} /> CUSTOMER</button>
                            <button type="button" onClick={() => handleRoleChange('staff')} className={userData.role === 'staff' ? 'active slate' : ''}><UserCheck size={18} /> STAFF</button>
                            <button type="button" onClick={() => handleRoleChange('admin')} className={userData.role === 'admin' ? 'active dark' : ''}><Settings size={18} /> ADMIN</button>
                        </div>

                        <h1 style={{ fontSize: '3.2rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: getRoleColor(), letterSpacing: '-0.03em', margin: '2.5rem 0 0.5rem' }}>Initialize Profile.</h1>
                        <p style={{ color: '#64748b', fontWeight: 700 }}>Enter your details to create your {userData.role} access.</p>
                    </div>

                    {error && <div className="auth-error-p" style={{ padding: '1.5rem', background: '#fef2f2', color: '#b91c1c', borderRadius: '1.5rem', marginBottom: '3rem', fontSize: '0.9rem', fontWeight: 700, border: '2px solid #fee2e2' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="boutique-field-v2">
                            <label style={{ color: getRoleColor() }}>FULL IDENTITY / NAME</label>
                            <div style={{ position: 'relative' }}>
                                <input name="name" type="text" value={userData.name} onChange={handleChange} placeholder="John Doe" required />
                                <User size={22} style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: getRoleColor(), opacity: 0.6 }} />
                            </div>
                        </div>

                        <div className="boutique-field-v2">
                            <label style={{ color: getRoleColor() }}>EMAIL CHANNEL</label>
                            <div style={{ position: 'relative' }}>
                                <input name="email" type="email" value={userData.email} onChange={handleChange} placeholder="example@logistics.com" required />
                                <Mail size={22} style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: getRoleColor(), opacity: 0.6 }} />
                            </div>
                        </div>

                        <div className="boutique-field-v2">
                            <label style={{ color: getRoleColor() }}>SECURITY PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <input name="password" type="password" value={userData.password} onChange={handleChange} placeholder="••••••••" required />
                                <Lock size={22} style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: getRoleColor(), opacity: 0.6 }} />
                            </div>
                        </div>

                        <button type="submit" className="boutique-register-btn" disabled={loading} style={{ background: getRoleColor() }}>
                            {loading ? 'INITIALIZING...' : `SIGN UP AS ${userData.role.toUpperCase()}`} <ArrowRight size={22} />
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '4rem', color: '#64748b', fontWeight: 700 }}>
                        Already have an identity? <Link to="/login" style={{ color: getRoleColor(), fontWeight: 900, textDecoration: 'none' }}>Access Portal</Link>
                    </p>
                </div>
            </div>

            <style>{`
                .auth-overlay-art { position: absolute; inset: 0; padding: 8rem 6rem; display: flex; flex-direction: column; justify-content: flex-end; }
                .auth-badge-p { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; background: rgba(255,255,255,0.15); backdrop-filter: blur(15px); border-radius: 50px; color: white; font-size: 0.8rem; fontWeight: 950; letter-spacing: 0.15em; width: fit-content; margin-bottom: 30px; border: 1.5px solid rgba(255,255,255,0.2); }
                .role-selector-p { display: flex; gap: 10px; padding: 10px; background: #f1f5f9; border-radius: 100px; }
                .role-selector-p button { flex: 1; border: none; background: none; padding: 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 900; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.4s; }
                .role-selector-p button.active { background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .role-selector-p button.active.green { color: #064e3b; }
                .role-selector-p button.active.slate { color: #334155; }
                .role-selector-p button.active.dark { color: #0f172a; }
                .boutique-field-v2 label { display: block; font-size: 0.8rem; fontWeight: 900; marginBottom: 15px; letterSpacing: 0.15em; }
                .boutique-field-v2 input { width: 100%; border: 3px solid #f1f5f9; border-radius: 1.75rem; padding: 22px 28px 22px 65px; font-size: 1.25rem; transition: all 0.3s; }
                .boutique-field-v2 input:focus { outline: none; background: #fdfdfd; border-color: inherit; }
                .boutique-register-btn { width: 100%; border: none; height: 80px; border-radius: 1.75rem; color: white; font-weight: 850; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; gap: 15px; cursor: pointer; transition: all 0.4s; }
                .boutique-register-btn:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
                @media (max-width: 1024px) { .hide-tablet { display: none; } .auth-form-side { padding: 3rem 2rem; } }
            `}</style>
        </div>
    );
};

export default Register;
