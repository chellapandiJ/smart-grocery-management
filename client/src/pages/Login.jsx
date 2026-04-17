import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; 
import { Mail, Lock, User, LogIn, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, UserCheck, Settings, Users } from 'lucide-react';

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [loginType, setLoginType] = useState('customer'); // 'customer', 'staff', 'admin'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login: contextLogin } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.auth.login({ ...credentials, role: loginType });
            
            if (res.data && res.data.token) {
                // Update Global Auth State
                contextLogin(res.data.user, res.data.token);
                
                // --- ROLE-BASED REDIRECTION ---
                // If user is Admin or Staff, redirect directly to their Dashboard Portal
                if (res.data.user.role === 'admin' || res.data.user.role === 'staff') {
                    navigate('/admin');
                } else {
                    // Standard customers go to the boutique storefront
                    navigate('/');
                }
            } else {
                setError('Invalid credentials for this access portal.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please verify your portal access.');
        } finally {
            setLoading(false);
        }
    };

    const getPortalColor = () => {
        if (loginType === 'admin') return '#0f172a';
        if (loginType === 'staff') return '#334155';
        return '#064e3b';
    };

    return (
        <div className="luxury-auth-experience" style={{ minHeight: '100vh', display: 'flex', background: '#f0f2f5', padding: '2rem' }}>
            
            <div className="auth-visual-side hide-tablet" style={{ flex: 1.1, position: 'relative', overflow: 'hidden', borderRadius: '3.5rem' }}>
                <img src="https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Boutique" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="auth-overlay-art" style={{ background: `linear-gradient(to top, ${getPortalColor()}FA 0%, transparent 80%)` }}>
                    <div className="auth-badge-p">
                        <Sparkles size={18} /> <span>{loginType.toUpperCase()} ACCESS TERMINAL</span>
                    </div>
                </div>
            </div>

            <div className="auth-form-side" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div className="boutique-login-card-unique">
                    
                    <div className="auth-head-center" style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                            <ShoppingBag color={getPortalColor()} size={40} strokeWidth={2.5} />
                            <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-serif)', color: getPortalColor(), letterSpacing: '-0.04em' }}>Smart Grocery</span>
                        </div>
                        
                        <div className="portal-switcher-unique">
                            <button type="button" onClick={() => setLoginType('customer')} className={loginType === 'customer' ? 'active green' : ''}><User size={18} /> CUSTOMER</button>
                            <button type="button" onClick={() => setLoginType('staff')} className={loginType === 'staff' ? 'active slate' : ''}><UserCheck size={18} /> STAFF</button>
                            <button type="button" onClick={() => setLoginType('admin')} className={loginType === 'admin' ? 'active dark' : ''}><Settings size={18} /> ADMIN</button>
                        </div>

                        <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: getPortalColor(), letterSpacing: '-0.04em', margin: '2.5rem 0 0.5rem' }}>
                            {loginType === 'customer' ? 'Member Access' : loginType === 'staff' ? 'Staff Entrance' : 'System Terminal'}
                        </h1>
                    </div>

                    {error && <div style={{ color: '#ef4444', background: '#fef2f2', padding: '1.2rem', borderRadius: '1rem', marginBottom: '2.5rem', fontWeight: 700, border: '1.5px solid #fee2e2' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        <div className="boutique-field-unique">
                            <label style={{ color: getPortalColor() }}>
                                {loginType === 'admin' ? 'ADMIN USERNAME' : 'IDENTITY / EMAIL ADDRESS'}
                            </label>
                            <div className="input-wrap">
                                {loginType === 'admin' ? <Settings size={22} className="input-icon" style={{ color: getPortalColor() }} /> : <Mail size={22} className="input-icon" style={{ color: getPortalColor() }} />}
                                <input 
                                    name="email" 
                                    type={loginType === 'admin' ? 'text' : 'email'} 
                                    value={credentials.email} 
                                    onChange={handleChange} 
                                    placeholder={loginType === 'admin' ? 'Enter admin username' : 'example@logistics.com'} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="boutique-field-unique">
                            <label style={{ color: getPortalColor() }}>
                                {loginType === 'admin' ? 'SYSTEM ACCESS KEY' : 'SECURITY ACCESS KEY'}
                            </label>
                            <div className="input-wrap">
                                <Lock size={22} className="input-icon" style={{ color: getPortalColor() }} />
                                <input name="password" type="password" value={credentials.password} onChange={handleChange} placeholder="••••••••" required />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                            <button type="submit" className="boutique-submit-btn" disabled={loading} style={{ background: getPortalColor(), flex: 1.5 }}>
                                {loading ? 'VALIDATING...' : `LOG IN AS ${loginType.toUpperCase()}`} <ArrowRight size={22} />
                            </button>
                            <Link to={`/register?role=${loginType}`} className="boutique-signup-btn-v2" style={{ border: `2.5px solid ${getPortalColor()}`, color: getPortalColor() }}>
                                SIGN UP
                            </Link>
                        </div>
                    </form>

                    <div style={{ marginTop: '4rem', textAlign: 'center', borderTop: '2px dashed #e2e8f0', paddingTop: '3rem' }}>
                        <p style={{ color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>
                            {loginType === 'customer' ? 'New member?' : loginType === 'staff' ? 'Staff member?' : 'Administrator?'}
                        </p>
                        <Link to={`/register?role=${loginType}`} className="auth-footer-link" style={{ color: getPortalColor(), fontWeight: 900 }}>
                            INITIALIZE {loginType.toUpperCase()} IDENTITY <Sparkles size={18} />
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                .boutique-login-card-unique { width: 100%; maxWidth: 580px; background: white; padding: 5rem 4rem; border-radius: 4rem; box-shadow: 0 40px 120px -20px rgba(0,0,0,0.15); }
                .portal-switcher-unique { display: flex; gap: 12px; padding: 10px; background: #f1f5f9; border-radius: 100px; }
                .portal-switcher-unique button { flex: 1; border: none; background: none; padding: 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 900; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.4s; }
                .portal-switcher-unique button.active { background: white; box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
                .portal-switcher-unique button.active.green { color: #064e3b; }
                .portal-switcher-unique button.active.slate { color: #334155; }
                .portal-switcher-unique button.active.dark { color: #0f172a; }
                
                .boutique-field-unique label { display: block; font-size: 0.8rem; fontWeight: 900; letterSpacing: 0.15em; marginBottom: 15px; }
                .input-wrap { position: relative; }
                .input-wrap input { width: 100%; border: 3px solid #f1f5f9; border-radius: 1.5rem; padding: 22px 28px 22px 65px; font-size: 1.2rem; transition: all 0.3s; }
                .input-wrap .input-icon { position: absolute; left: 25px; top: 50%; transform: translateY(-50%); opacity: 0.8; }
                
                .boutique-submit-btn { border: none; height: 80px; border-radius: 1.75rem; color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 15px; cursor: pointer; transition: all 0.4s; }
                .boutique-signup-btn-v2 { flex: 1; height: 80px; border-radius: 1.75rem; display: flex; align-items: center; justify-content: center; text-decoration: none; font-weight: 900; font-size: 1.1rem; transition: all 0.3s; }

                @media (max-width: 1024px) { .hide-tablet { display: none; } .boutique-login-card-unique { padding: 3rem 2rem; border-radius: 2.5rem; } }
            `}</style>
        </div>
    );
};

export default Login;
