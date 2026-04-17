import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, User, LogOut, ShoppingBag, UserCheck, Settings, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 15);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <header style={{
            position: 'fixed',
            top: 20,
            left: '2.5%',
            right: '2.5%',
            zIndex: 1000,
            transition: 'all 0.4s ease-in-out',
        }}>
            <nav className={`boutique-nav-v3 ${isScrolled ? 'scrolled' : ''}`}>
                {/* --- BRAND --- */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', minWidth: '240px' }}>
                    <div className="logo-box-main"><ShoppingBag size={28} color="white" strokeWidth={2.5} /></div>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                        Smart <span style={{ fontWeight: 400, fontStyle: 'italic' }}>Grocery</span>
                    </span>
                </Link>

                {/* --- NAVIGATION LINKS --- */}
                <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                    {['INDEX', 'MARKET', 'STORY', 'CONNECT'].map(name => {
                        const path = name === 'INDEX' ? '/' : name === 'MARKET' ? '/products' : name === 'STORY' ? '/about' : '/contact';
                        return (
                            <Link key={name} to={path} className={`nav-link-v3 ${isActive(path) ? 'active' : ''}`}>{name}</Link>
                        );
                    })}
                </div>

                {/* --- PORTALS & ACTIONS --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: '400px', justifyContent: 'flex-end' }}>
                    
                    <div style={{ display: 'flex', gap: '0.8rem', borderRight: '1.5px solid #f1f5f9', paddingRight: '1.5rem' }}>
                        <Link to="/login" title="Customer Portal" className="portal-icon-v3 green"><User size={18} /></Link>
                        <Link to="/login" title="Staff Entrance" className="portal-icon-v3 slate"><UserCheck size={18} /></Link>
                        <Link to="/login" title="Admin Terminal" className="portal-icon-v3 dark"><Settings size={18} /></Link>
                    </div>

                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        {!user ? (
                            <>
                                <Link to="/login" className="nav-btn-v3 ghost">LOG IN</Link>
                                <Link to="/register" className="nav-btn-v3 primary">SIGN UP</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/cart" className="action-v3"><ShoppingCart size={22} /></Link>
                                <button onClick={handleLogout} className="action-v3"><LogOut size={22} /></button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <style>{`
                .boutique-nav-v3 {
                    background: rgba(255,255,255,0.96); backdrop-filter: blur(40px); -webkit-backdrop-filter: blur(40px); padding: 0 4.5rem; height: 94px; border-radius: 30px; display: flex; alignItems: center; justifyContent: space-between; border: 1.5px solid rgba(0,0,0,0.02); 
                    box-shadow: 0 15px 50px rgba(0,0,0,0.04);
                    transition: all 0.4s;
                }
                .boutique-nav-v3.scrolled { height: 84px; box-shadow: 0 20px 70px rgba(0,0,0,0.08); transform: translateY(-3px); }
                
                .logo-box-main { width: 50px; height: 50px; background: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; transform: rotate(-5deg); transition: 0.3s; }
                .logo-box-main:hover { transform: rotate(0deg) scale(1.1); }

                .nav-link-v3 { text-decoration: none; color: #475569; font-weight: 850; font-size: 0.9rem; letter-spacing: 0.14em; transition: all 0.3s; position: relative; }
                .nav-link-v3:hover, .nav-link-v3.active { color: var(--primary); }
                .nav-link-v3.active::after { content: ''; position: absolute; bottom: -8px; left: 0; width: 100%; height: 3px; background: var(--primary); border-radius: 2px; }

                .portal-icon-v3 { width: 44px; height: 44px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #94a3b8; transition: all 0.4s; text-decoration: none; }
                .portal-icon-v3:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .portal-icon-v3.green:hover { background: #effaf5; color: #10b981; }
                .portal-icon-v3.slate:hover { background: #f1f5f9; color: #475569; }
                .portal-icon-v3.dark:hover { background: #0f172a; color: white; }

                .nav-btn-v3 { padding: 0 2rem; height: 52px; border-radius: 14px; display: inline-flex; align-items: center; justify-content: center; font-weight: 950; font-size: 0.8rem; text-decoration: none; transition: 0.3s; }
                .nav-btn-v3.primary { background: var(--primary); color: white; }
                .nav-btn-v3.ghost { color: var(--primary); border: 2.2px solid #f1f5f9; }
                .nav-btn-v3:hover { transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.06); }

                .action-v3 { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); background: #f8fafc; transition: all 0.3s; border: none; cursor: pointer; text-decoration: none; }
                .action-v3:hover { background: var(--primary); color: white; transform: rotate(10deg); }

                @media (max-width: 1400px) {
                    .boutique-nav-v3 { padding: 0 2rem; }
                    .nav-link-v3 { font-size: 0.8rem; gap: 2rem; }
                }
                @media (max-width: 1200px) {
                    .nav-link-v3 { display: none; }
                }
            `}</style>
        </header>
    );
};

export default Navbar;
