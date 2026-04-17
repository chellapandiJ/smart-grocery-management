import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, Truck, Zap, ShoppingCart, Info, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.cart.get();
            setCartItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (id, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            await api.cart.update(id, { quantity: newQty });
            fetchCart();
        } catch (err) { }
    };

    const removeItem = async (id) => {
        try {
            await api.cart.remove(id);
            fetchCart();
        } catch (err) { }
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.variation_id ? item.variation_price : item.final_price;
        return acc + (price * item.quantity);
    }, 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    if (loading) {
        return (
            <div className="container py-20" style={{ textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-spin" style={{ width: '60px', height: '60px', border: '5px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto' }}></div>
                <p style={{ marginTop: '2.5rem', fontWeight: 950, color: '#94a3b8', letterSpacing: '0.1em' }}>SYNCHRONIZING SELECTION...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '12rem 0', textAlign: 'center', minHeight: '100vh' }}>
                <div style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    width: '160px', height: '160px',
                    borderRadius: '4rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 4rem',
                    boxShadow: '0 30px 60px -15px rgba(16, 185, 129, 0.4)',
                    animation: 'animate-up 0.6s ease-out'
                }}>
                    <ShoppingCart size={80} strokeWidth={1.5} />
                </div>
                <h1 style={{ marginBottom: '1.5rem', fontWeight: 950, fontSize: '4rem', color: 'var(--dark)', letterSpacing: '-0.05em' }}>Inventory Empty</h1>
                <p style={{ color: '#64748b', marginBottom: '4rem', fontSize: '1.4rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: 1.5, fontWeight: 500 }}>
                    Your marketplace registry is currently inactive. Discover our curated collections and initiate your selection sequence.
                </p>
                <Link to="/products" className="btn btn-primary" style={{ padding: '0 4rem', height: '84px', borderRadius: '2rem', fontSize: '1.35rem', fontWeight: 950, boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.4)' }}>
                    ENTER MARKETPLACE
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-20" style={{ paddingTop: '120px', paddingBottom: '8rem' }}>
            <header style={{ marginBottom: '6rem', animation: 'animate-up 0.5s ease-out' }}>
                <div className="glass-pill" style={{ marginBottom: '1.5rem' }}>
                    <Activity size={14} fill="currentColor" /> ACTIVE SELECTION HUB
                </div>
                <h1 style={{ fontSize: '4rem', fontWeight: 950, color: 'var(--dark)', letterSpacing: '-0.06em', margin: 0 }}>Marketplace Bag</h1>
                <p style={{ color: '#64748b', fontSize: '1.25rem', fontWeight: 500, marginTop: '0.5rem' }}>Synchronizing {cartItems.length} curated items for acquisition.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)', gap: '5rem', alignItems: 'start' }}>
                {/* --- ITEM LOGISTICS --- */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'animate-up 0.7s ease-out' }}>
                    {cartItems.map((item, index) => (
                        <div key={item.id} className="premium-card" style={{
                            display: 'flex', gap: '2.5rem', alignItems: 'center', padding: '2.5rem', borderRadius: '3rem',
                            animation: `animate-up ${0.5 + (index * 0.1)}s ease-out`,
                            position: 'relative', overflow: 'hidden'
                        }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '100%', background: 'linear-gradient(to right, transparent, rgba(248, 250, 252, 0.5))', pointerEvents: 'none' }}></div>

                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <img
                                    src={`/uploads/products/${item.image}`}
                                    alt={item.name}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300'; }}
                                    style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                                />
                                <div style={{ position: 'absolute', top: '-12px', left: '-12px', background: 'var(--primary)', color: 'white', width: '40px', height: '40px', borderRadius: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 950, border: '5px solid white', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                                    {item.quantity}
                                </div>
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 950, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>REGISTRY ITEM</span>
                                    <div style={{ height: '1px', flex: 1, background: '#f1f5f9' }}></div>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 950, color: 'var(--dark)', letterSpacing: '-0.03em' }}>{item.name}</h3>
                                {item.variation_name && (
                                    <span style={{ display: 'inline-flex', padding: '0.5rem 1.25rem', background: '#f1f5f9', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 900, marginTop: '1rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {item.variation_name}
                                    </span>
                                )}
                                <p style={{ color: 'var(--primary)', fontWeight: 950, margin: '1.5rem 0 0', fontSize: '1.65rem', letterSpacing: '-0.02em' }}>
                                    ₹{Number(item.variation_id ? item.variation_price : item.final_price).toLocaleString('en-IN')}
                                </p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: '#f8fafc', padding: '1rem 2rem', borderRadius: '1.75rem', border: '2.5px solid #f1f5f9' }}>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity, -1)}
                                        disabled={item.quantity <= 1}
                                        className="qty-btn"
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', transition: 'all 0.3s', color: item.quantity <= 1 ? '#cbd5e1' : 'var(--dark)' }}
                                    >
                                        <Minus size={22} strokeWidth={3} />
                                    </button>
                                    <span style={{ fontWeight: 950, minWidth: '40px', textAlign: 'center', fontSize: '1.5rem', color: 'var(--dark)' }}>{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity, 1)}
                                        className="qty-btn"
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', transition: 'all 0.3s', color: 'var(--dark)' }}
                                    >
                                        <Plus size={22} strokeWidth={3} />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="remove-btn"
                                    style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 950, background: 'rgba(239, 68, 68, 0.05)', padding: '0.75rem 1.5rem', borderRadius: '1.25rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s' }}
                                >
                                    <Trash2 size={18} /> PURGE
                                </button>
                            </div>
                        </div>
                    ))}

                    <Link to="/products" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--primary)', fontWeight: 950, textDecoration: 'none', fontSize: '1.25rem', marginTop: '2.5rem', width: 'fit-content', padding: '1.5rem 3rem', background: 'var(--primary-light)', borderRadius: '2.5rem', transition: 'all 0.4s' }} className="add-more-link">
                        <Plus size={28} strokeWidth={3} />
                        REVISIT MARKETPLACE
                    </Link>
                </div>

                {/* --- FISCAL SUMMARY --- */}
                <div style={{ position: 'sticky', top: '120px', animation: 'animate-up 0.8s ease-out' }}>
                    <div className="premium-card" style={{ padding: '4.5rem 4rem', borderRadius: '4rem', background: 'var(--dark)', color: 'white' }}>
                        <h2 style={{ marginBottom: '3.5rem', fontSize: '2.25rem', fontWeight: 950, color: 'white', letterSpacing: '-0.04em' }}>Settlement Matrix</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', borderBottom: '2.5px solid rgba(255,255,255,0.05)', paddingBottom: '3.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                <span style={{ color: '#94a3b8', fontWeight: 800 }}>REGISTRY VALUE</span>
                                <span style={{ fontWeight: 950, color: 'white' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                <span style={{ color: '#94a3b8', fontWeight: 800 }}>FISCAL TAX (5%)</span>
                                <span style={{ fontWeight: 950, color: 'white' }}>₹{gst.toLocaleString('en-IN')}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Truck size={22} color="var(--primary)" />
                                    <span style={{ color: '#94a3b8', fontWeight: 800 }}>LOGISTIC COMP.</span>
                                </div>
                                <span style={{ color: 'var(--primary)', fontWeight: 950 }}>ACTIVE</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3.5rem 0', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.75rem' }}>GRAND TOTAL</h3>
                            <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.05em' }}>
                                ₹{total.toLocaleString('en-IN')}
                            </h2>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                height: '84px',
                                fontSize: '1.35rem',
                                borderRadius: '2.5rem',
                                fontWeight: 950,
                                boxShadow: '0 25px 50px -15px rgba(16, 185, 129, 0.4)',
                                display: 'flex',
                                alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
                                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            FINALIZE PROTOCOL <ArrowRight size={28} />
                        </button>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '3.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#64748b', fontSize: '0.85rem', justifyContent: 'center', fontWeight: 900 }}>
                                <ShieldCheck size={20} color="var(--primary)" /> 256-BIT SECURE ENCRYPTION ACTIVE
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#64748b', fontSize: '0.85rem', justifyContent: 'center', fontWeight: 900 }}>
                                <CreditCard size={20} color="var(--primary)" /> MULTI-CHANNEL SETTLEMENT READY
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .qty-btn:hover { color: var(--primary) !important; transform: scale(1.3); }
                .remove-btn:hover { background: #ef4444 !important; color: white !important; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2); }
                .qty-btn:active { transform: scale(0.9); }
                .add-more-link:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(16, 185, 129, 0.2); }
                @media (max-width: 1200px) {
                    div[style*="column"] { grid-template-columns: 1fr !important; gap: 4rem !important; }
                    .premium-card { padding: 2rem !important; }
                    header h1 { font-size: 3rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Cart;
