import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, MapPin, Truck, Award } from 'lucide-react';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);
    const [invoiceId, setInvoiceId] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await api.cart.get();
            setCartItems(res.data);
            if (res.data.length === 0) navigate('/cart');
        } catch (err) {
            console.error('Error fetching cart', err);
        }
    };

    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.variation_id ? item.variation_price : item.final_price;
        return acc + (price * item.quantity);
    }, 0);
    const gst = subtotal * 0.05;
    const total = subtotal + gst;

    const handleCheckout = async () => {
        if (!formData.name || !formData.phone || !formData.address) {
            alert('PROTOCOL ALERT: Please input all required logistic coordinates.');
            return;
        }
        setLoading(true);
        try {
            const orderData = {
                items: cartItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.variation_id ? item.variation_price : item.final_price,
                    variation_id: item.variation_id
                })),
                total_amount: subtotal,
                gst: gst,
                discount: 0,
                final_amount: total,
                shipping_details: formData,
                order_type: 'online',
                payment_method: 'cash',
                payment_status: 'pending'
            };

            const res = await api.order.create(orderData);
            setInvoiceId(res.data.invoiceId);
            setIsSuccess(true);
        } catch (err) {
            alert('Transaction Failed: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '10rem 1.5rem', animation: 'animate-up 0.8s ease-out' }}>
                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '120px', height: '120px', borderRadius: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem', boxShadow: '0 25px 50px -10px rgba(16, 185, 129, 0.4)' }}>
                    <CheckCircle size={70} strokeWidth={2.5} />
                </div>
                <h1 style={{ fontWeight: 950, fontSize: '3.5rem', letterSpacing: '-0.04em', marginBottom: '1rem', color: 'var(--dark)' }}>Transaction Confirmed</h1>
                <p style={{ color: '#64748b', fontSize: '1.25rem', fontWeight: 500, marginBottom: '3rem' }}>Your master registry ID is <strong style={{ color: 'var(--primary)', fontWeight: 950 }}>{invoiceId}</strong></p>

                <div className="premium-card" style={{ maxWidth: '600px', margin: '0 auto 4rem', padding: '3.5rem', borderRadius: '3rem', textAlign: 'left' }}>
                    <h3 style={{ marginBottom: '2rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.85rem' }}><Award size={24} color="var(--primary)" /> Next Protocol Steps</h3>
                    <ul style={{ color: '#64748b', display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0 }}>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '0.5rem', flexShrink: 0 }}></div>
                            <span style={{ fontWeight: 700 }}>A digital summary has been dispatched to your verified email address.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '0.5rem', flexShrink: 0 }}></div>
                            <span style={{ fontWeight: 700 }}>Our logistics hub is currently calculating the optimal trajectory for dispatch.</span>
                        </li>
                        <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', marginTop: '0.5rem', flexShrink: 0 }}></div>
                            <span style={{ fontWeight: 700 }}>Telemetry tracking is now active in your secured profile section.</span>
                        </li>
                    </ul>
                </div>

                <button
                    onClick={() => navigate('/products')}
                    className="btn btn-primary"
                    style={{ padding: '0 4rem', height: '76px', borderRadius: '2rem', fontSize: '1.25rem', fontWeight: 950, boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)' }}
                >
                    RETURN TO MARKET
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-page hero-gradient" style={{ padding: '120px 0 8rem' }}>
            <div className="container">
                <header style={{ marginBottom: '5rem', animation: 'animate-up 0.5s ease-out' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-0.05em', color: 'var(--dark)' }}>Secure Finalization</h1>
                    <p style={{ color: '#64748b', fontSize: '1.15rem', fontWeight: 500, marginTop: '0.5rem' }}>Synchronizing your selection with global logistics.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '4rem', alignItems: 'start' }}>
                    {/* --- LOGISTICS & SETTLEMENT --- */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', animation: 'animate-up 0.7s ease-out' }}>
                        <div className="premium-card" style={{ padding: '4rem', borderRadius: '3rem' }}>
                            <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 950, fontSize: '1.5rem' }}><MapPin size={26} color="var(--primary)" /> Logistic Coordinates</h3>
                            <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 950, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Entity Name</label>
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        style={{ height: '64px', borderRadius: '1.5rem', border: '2.5px solid #f1f5f9', background: '#f8fafc', fontWeight: 700, padding: '0 1.5rem' }}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 950, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Telemetry Contact</label>
                                    <input
                                        type="text"
                                        placeholder="Phone Number"
                                        style={{ height: '64px', borderRadius: '1.5rem', border: '2.5px solid #f1f5f9', background: '#f8fafc', fontWeight: 700, padding: '0 1.5rem' }}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 950, color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Material Delivery Address</label>
                                <textarea
                                    rows="4"
                                    placeholder="Enter complete physical coordinates for dispatch..."
                                    style={{ borderRadius: '1.5rem', border: '2.5px solid #f1f5f9', background: '#f8fafc', fontWeight: 700, padding: '1.5rem', resize: 'none' }}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <div className="premium-card" style={{ padding: '4rem', borderRadius: '3rem' }}>
                            <h3 style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 950, fontSize: '1.5rem' }}><CreditCard size={26} color="var(--primary)" /> Settlement Protocol</h3>
                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '240px', border: '3px solid var(--primary)', padding: '2.5rem', borderRadius: '2.5rem', background: 'var(--primary-light)', cursor: 'pointer', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={16} /></div>
                                    <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: 'var(--primary-dark)' }}>DIRECT SETTLEMENT</h4>
                                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: 'var(--primary-dark)', fontWeight: 600, opacity: 0.8 }}>Pay physical currency upon successful acquisition.</p>
                                </div>
                                <div style={{ flex: 1, minWidth: '240px', border: '2.5px solid #f1f5f9', padding: '2.5rem', borderRadius: '2.5rem', background: 'white', cursor: 'not-allowed', opacity: 0.5 }}>
                                    <h4 style={{ margin: 0, fontWeight: 950, fontSize: '1.25rem', color: '#94a3b8' }}>DIGITAL DEPOSIT</h4>
                                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>Protocol integration currently in restricted test flight.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- REGISTRY SUMMARY --- */}
                    <div style={{ position: 'sticky', top: '120px', animation: 'animate-up 0.9s ease-out' }}>
                        <div className="premium-card" style={{ padding: '4rem', borderRadius: '4rem' }}>
                            <h2 style={{ marginBottom: '3rem', fontWeight: 950, fontSize: '2rem', letterSpacing: '-0.03em' }}>Registry Summary</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxHeight: '350px', overflowY: 'auto', marginBottom: '3rem', paddingRight: '1rem' }} className="custom-scrollbar">
                                {cartItems.map(item => (
                                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '60px', height: '60px', background: '#f8fafc', borderRadius: '1.25rem', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={`/uploads/products/${item.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: 'var(--dark)' }}>{item.name}</p>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', fontWeight: 800 }}>VOL: {item.quantity} × ₹{Number(item.variation_id ? item.variation_price : item.final_price).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontWeight: 950, fontSize: '1.15rem', color: 'var(--dark)' }}>₹{((item.variation_id ? item.variation_price : item.final_price) * item.quantity).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '2.5px dashed #f1f5f9', borderBottom: '2.5px dashed #f1f5f9', padding: '2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 800 }}>SUBTOTAL</span>
                                    <span style={{ fontWeight: 950, color: 'var(--dark)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 800 }}>FISCAL TAX (5%)</span>
                                    <span style={{ fontWeight: 950, color: 'var(--dark)' }}>₹{gst.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                                    <span style={{ color: '#94a3b8', fontWeight: 800 }}>LOGISTIC COMP.</span>
                                    <span style={{ color: 'var(--primary)', fontWeight: 950 }}>COMPLIMENTARY</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3rem 0', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: '#94a3b8' }}>TOTAL</h3>
                                <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '3.25rem', fontWeight: 950, letterSpacing: '-0.05em' }}>₹{total.toLocaleString('en-IN')}</h2>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    height: '84px',
                                    borderRadius: '2.5rem',
                                    fontSize: '1.35rem',
                                    fontWeight: 950,
                                    boxShadow: '0 25px 50px -15px rgba(16, 185, 129, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1.5rem'
                                }}
                            >
                                {loading ? 'AUTHENTICATING...' : <><ShieldCheck size={28} /> FINALIZE ACQUISITION</>}
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2.5rem', color: '#cbd5e1' }}>
                                <Truck size={18} /> <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>PRIORITY DISPATCH ENABLED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                input:focus, textarea:focus { border-color: var(--primary) !important; background: white !important; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                @media (max-width: 992px) {
                    div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: 3rem !important; }
                    .premium-card { padding: 2rem !important; }
                }
            `}</style>
        </div>
    );
};

export default Checkout;
