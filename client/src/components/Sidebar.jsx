import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, BarChart2, Inbox, ShoppingBag, Users, Layers, LogOut, CreditCard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const adminLinks = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
        { path: '/admin/products', icon: Package, label: 'Catalog' },
        { path: '/admin/categories', icon: Layers, label: 'Categories' },
        { path: '/admin/inventory', icon: Inbox, label: 'Inventory' },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/pos', icon: CreditCard, label: 'POS Billing' },
        { path: '/admin/reports', icon: BarChart2, label: 'Analytics' },
        { path: '/admin/staff', icon: Users, label: 'Staff' },
    ];

    const staffLinks = [
        { path: '/admin', icon: LayoutDashboard, label: 'Terminal', end: true },
        { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
        { path: '/admin/pos', icon: CreditCard, label: 'POS Billing' },
        { path: '/admin/inventory', icon: Inbox, label: 'Stock View' },
    ];

    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const links = user?.role === 'admin' ? adminLinks : staffLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside style={{
            width: isMobile ? '100%' : '240px',
            minHeight: isMobile ? 'auto' : '100vh',
            background: 'transparent',
            padding: isMobile ? '0.75rem' : '1.5rem 0.5rem',
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            justifyContent: 'space-between',
            overflowX: isMobile ? 'auto' : 'visible',
            gap: isMobile ? '1rem' : '0.15rem',
            alignItems: isMobile ? 'center' : 'stretch',
            scrollbarWidth: 'none'
        }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '0.15rem', alignItems: isMobile ? 'center' : 'stretch' }}>
                {!isMobile && (
                    <div style={{ padding: '0 1rem 1.5rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ color: 'var(--primary)', fontWeight: 950, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'var(--primary)', color: 'white', padding: '0.4rem', borderRadius: '0.5rem' }}>
                                <ShieldCheck size={18} />
                            </div>
                            <span style={{ letterSpacing: '0.05em' }}>PRO PANEL</span>
                        </div>
                    </div>
                )}

                {links.map(link => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.end}
                        className="sidebar-link-compact"
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.85rem',
                            padding: isMobile ? '0.6rem 1rem' : '0.85rem 1.15rem',
                            borderRadius: '0.85rem',
                            fontWeight: 700,
                            color: isActive ? 'white' : '#94a3b8',
                            background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            fontSize: isMobile ? '0.8rem' : '0.88rem',
                            whiteSpace: 'nowrap',
                            textDecoration: 'none',
                            border: isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent'
                        })}
                    >
                        <link.icon size={isMobile ? 16 : 19} style={{ opacity: 1 }} />
                        {link.label}
                    </NavLink>
                ))}
            </div>

            <button
                onClick={handleLogout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.85rem',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '0.85rem',
                    fontWeight: 700,
                    color: '#f87171',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    marginTop: isMobile ? 0 : '1rem',
                    fontSize: isMobile ? '0.8rem' : '0.88rem',
                    width: isMobile ? 'auto' : '100%',
                    whiteSpace: 'nowrap'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
            >
                <LogOut size={isMobile ? 16 : 19} />
                Sign Out
            </button>

            <style>{`
                .sidebar-link-compact:hover {
                    color: white !important;
                    background: rgba(255,255,255,0.03) !important;
                }
                aside::-webkit-scrollbar { display: none; }
            `}</style>
        </aside>
    );
};

export default Sidebar;
