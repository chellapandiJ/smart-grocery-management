import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory';
import AdminReports from './pages/AdminReports';
import AdminStaff from './pages/AdminStaff';
import AdminCustomers from './pages/AdminCustomers';
import POSBilling from './pages/POSBilling';
import StaffDashboard from './pages/StaffDashboard';
import AdminDiscounts from './pages/AdminDiscounts';
import AdminCategories from './pages/AdminCategories';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) return <Navigate to="/" />;
    return children;
};

const MainContent = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="app">
            {!isAdmin && <Navbar />}
            <main className={(!isHomePage && !isAdmin) ? 'pt-navbar' : ''}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Customer Protected Routes */}
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                    {/* Admin & Staff Shared Routes */}
                    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                        <Route index element={<DashboardSelector />} />
                        <Route path="products" element={<AdminProducts />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="inventory" element={<AdminInventory />} />
                        <Route path="reports" element={<AdminReports />} />
                        <Route path="staff" element={<AdminStaff />} />
                        <Route path="customers" element={<AdminCustomers />} />
                        <Route path="pos" element={<POSBilling />} />
                        <Route path="discounts" element={<AdminDiscounts />} />
                        <Route path="categories" element={<AdminCategories />} />
                    </Route>
                </Routes>
            </main>
            {!isAdmin && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
                v7_fetcherPersist: true,
                v7_normalizeFormMethod: true,
                v7_partialHydration: true,
                v7_skipActionErrorRevalidation: true
            }}>
                <MainContent />
            </Router>
        </AuthProvider>
    );
}

const DashboardSelector = () => {
    const { user } = useAuth();
    if (user?.role === 'staff') return <StaffDashboard />;
    return <AdminDashboard />;
};

const AdminLayout = () => {
    const [isMobile, setIsMobile] = React.useState(window.innerWidth < 1024);

    React.useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="admin-container" style={{
            display: 'flex',
            height: isMobile ? 'auto' : '100vh',
            minHeight: '100vh',
            flexDirection: isMobile ? 'column' : 'row',
            overflow: isMobile ? 'visible' : 'hidden'
        }}>
            <div className="admin-sidebar-wrapper" style={{
                width: isMobile ? '100%' : '240px',
                flexShrink: 0,
                height: isMobile ? 'auto' : '100%',
                background: 'var(--admin-sidebar)',
                position: isMobile ? 'sticky' : 'relative',
                top: 0,
                zIndex: 50,
                maxHeight: isMobile ? '100vh' : 'none',
                overflowY: 'auto',
                boxShadow: '4px 0 24px rgba(0,0,0,0.05)'
            }}>
                <Sidebar />
            </div>
            <div className="admin-content" style={{
                flex: 1,
                height: isMobile ? 'auto' : '100%',
                overflowY: isMobile ? 'visible' : 'auto',
                padding: isMobile ? '1rem 0.75rem' : '2rem',
                background: 'var(--admin-bg)',
                paddingBottom: isMobile ? '5rem' : '2rem'
            }}>
                <Outlet />
            </div>
        </div>
    );
};

export default App;
