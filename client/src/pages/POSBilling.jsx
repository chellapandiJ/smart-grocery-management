import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Plus, Minus, Trash2, ShoppingBag, CreditCard, User, Phone, Printer, Zap, Activity, Filter, Layers, BadgePercent, Calculator, Receipt } from 'lucide-react';

const POSBilling = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [customer, setCustomer] = useState({ name: '', phone: '' });
    const [manualDiscount, setManualDiscount] = useState(0);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await api.product.getAll();
        setProducts(res.data);
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        const currentQty = existing ? existing.quantity : 0;

        if (product.stock <= 0) return;
        if (currentQty >= product.stock) return;

        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1, product_id: product.id }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : item;
            }
            return item;
        }));
    };

    const removeItem = (id) => setCart(cart.filter(item => item.id !== id));

    const subtotal = cart.reduce((acc, item) => acc + (item.final_price * item.quantity), 0);
    const gst = subtotal * 0.05;
    const total = (subtotal + gst) - manualDiscount;

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        try {
            const orderData = {
                items: cart,
                total_amount: subtotal,
                gst: gst,
                discount: manualDiscount,
                final_amount: total,
                customer_name: customer.name,
                customer_phone: customer.phone,
                status: 'completed',
                order_type: 'offline',
                payment_method: 'cash',
                payment_status: 'paid'
            };
            const res = await api.order.create(orderData);
            setOrderSuccess({ invoiceId: res.data.invoiceId, ...orderData });
            setCart([]);
            setCustomer({ name: '', phone: '' });
            setManualDiscount(0);
            fetchProducts();
        } catch (err) {
            console.error('Checkout failed');
        }
    };

    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="pos-billing-container" style={{ padding: '1rem', minHeight: '90vh' }}>
            {/* --- SYSTEM HEADER --- */}
            <div className="responsive-stack" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ background: 'var(--dark)', color: 'white', padding: '1rem', borderRadius: '1.5rem', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <Calculator size={32} />
                    </div>
                    <div>
                        <h1 style={{ fontWeight: 950, fontSize: '2.5rem', margin: 0, letterSpacing: '-0.04em', color: 'var(--dark)' }}>Checkout Terminal</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem', margin: '0.25rem 0 0' }}>Supermarket Point of Sale | Active Session</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', flex: 1, maxWidth: '600px' }}>
                    <div className="premium-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px', borderRadius: '1.5rem', background: 'white' }}>
                        <User size={20} color="#94a3b8" />
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Customer Identity</label>
                            <input type="text" placeholder="Walk-in Shopper" value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 800, padding: 0 }} />
                        </div>
                    </div>
                    <div className="premium-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '200px', borderRadius: '1.5rem', background: 'white' }}>
                        <Phone size={20} color="#94a3b8" />
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>Contact Protocol</label>
                            <input type="text" placeholder="+91 00000 00000" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 800, padding: 0 }} />
                        </div>
                    </div>
                    <div className="premium-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '150px', borderRadius: '1.5rem', background: '#fef2f2', border: '1px solid #fee2e2' }}>
                        <BadgePercent size={20} color="#ef4444" />
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 900, color: '#ef4444', textTransform: 'uppercase' }}>Discount</label>
                            <input type="number" placeholder="0" value={manualDiscount} onChange={e => setManualDiscount(Number(e.target.value))} style={{ border: 'none', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 800, padding: 0, background: 'transparent', color: '#ef4444' }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-responsive" style={{ '--grid-cols': '1fr 450px', alignItems: 'start', gap: '2.5rem' }}>
                {/* --- ITEM SELECTOR --- */}
                <div style={{ animation: 'animate-up 0.5s ease-out' }}>
                    <div className="premium-card" style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', padding: '1.5rem 2.5rem', borderRadius: '2.5rem', background: 'white' }}>
                        <Search size={24} color="#94a3b8" style={{ marginRight: '1.5rem' }} />
                        <input
                            type="text"
                            placeholder="Scan barcode or type product name..."
                            style={{ border: 'none', width: '100%', fontSize: '1.25rem', outline: 'none', fontWeight: 900, color: 'var(--dark)' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="glass-pill" style={{ marginLeft: '1.5rem', background: '#f1f5f9' }}>F2 SEARCH</div>
                    </div>

                    <div className="grid-responsive" style={{ '--grid-cols': 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
                        {filteredProducts.map((p, i) => (
                            <div key={p.id} className="premium-card product-pos-card" onClick={() => addToCart(p)} style={{
                                cursor: 'pointer',
                                padding: '1.25rem',
                                textAlign: 'center',
                                borderRadius: '2rem',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                background: 'white',
                                opacity: p.stock <= 0 ? 0.6 : 1,
                                animation: `animate-scale ${0.4 + (i * 0.05)}s ease-out`
                            }}>
                                <div style={{ position: 'relative', height: '140px', marginBottom: '1rem' }}>
                                    <img
                                        src={`/uploads/products/${p.image}`}
                                        alt=""
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=100'; }}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.25rem', boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}
                                    />
                                    {p.stock <= 0 && <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.75rem', fontWeight: 950, borderRadius: '1.25rem', letterSpacing: '0.05em' }}>SOLD OUT</div>}
                                    <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(255,255,255,0.9)', padding: '0.25rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.65rem', fontWeight: 950, color: 'var(--dark)' }}>
                                        {p.stock} STOCK
                                    </div>
                                </div>
                                <h4 style={{ fontSize: '1rem', fontWeight: 950, marginBottom: '0.4rem', color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span style={{ color: 'var(--primary)', fontWeight: 950, fontSize: '1.25rem' }}>₹{Number(p.final_price).toFixed(0)}</span>
                                    {p.discount > 0 && <span style={{ color: '#ef4444', fontSize: '0.7rem', fontWeight: 900, background: '#fef2f2', padding: '0.2rem 0.5rem', borderRadius: '0.5rem' }}>-{p.discount}%</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- BILLING SIDEBAR --- */}
                <div className="cart-sidebar" style={{ position: 'sticky', top: '2rem', animation: 'animate-up 0.6s ease-out' }}>
                    <div className="premium-card billing-card" style={{ padding: '3rem', borderRadius: '3.5rem', background: '#1e293b', color: 'white', boxShadow: '0 30px 60px -15px rgba(15, 23, 42, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 950, color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Receipt size={28} color="var(--primary)" /> Bill Details
                            </h2>
                            <button onClick={() => setCart([])} className="glass-pill" style={{ color: '#ef4444', padding: '0.5rem 1.25rem' }}>CLEAR ALL</button>
                        </div>

                        <div style={{ maxHeight: '450px', overflowY: 'auto', marginBottom: '3rem', paddingRight: '1rem' }} className="custom-scroll">
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '6rem 0', color: 'rgba(255,255,255,0.2)' }}>
                                    <ShoppingBag size={64} style={{ marginBottom: '1.5rem' }} />
                                    <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>Ready for Scanning...</p>
                                </div>
                            ) : cart.map((item, idx) => (
                                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem', animation: `animate-up ${0.3 + (idx * 0.05)}s ease-out` }}>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontWeight: 950, fontSize: '1.1rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.4rem' }}>
                                            <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>₹{Number(item.final_price).toFixed(0)} / unit</span>
                                            <span style={{ width: '4px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></span>
                                            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 950 }}>₹{Number(item.final_price * item.quantity).toFixed(0)}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '0.4rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <button onClick={() => updateQty(item.id, -1)} style={{ padding: '0.4rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Minus size={16} /></button>
                                            <span style={{ padding: '0 1rem', fontWeight: 950, fontSize: '1.1rem', color: 'white' }}>{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, 1)} style={{ padding: '0.4rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><Plus size={16} /></button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'none', padding: '0.75rem', borderRadius: '1rem', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px dashed rgba(255,255,255,0.1)', paddingTop: '2.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', fontSize: '1.1rem' }}>
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Operational Subtotal</span>
                                <span style={{ fontWeight: 950, color: 'white' }}>₹{subtotal.toFixed(0)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', background: 'rgba(16, 185, 129, 0.05)', padding: '2rem', borderRadius: '2.5rem', border: '2px solid rgba(16, 185, 129, 0.2)' }}>
                                <div>
                                    <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem', display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Balance Due</span>
                                    <span style={{ fontWeight: 950, color: 'var(--primary)', fontSize: '2.5rem', letterSpacing: '-0.03em' }}>₹{total.toFixed(0)}</span>
                                </div>
                                <Activity color="var(--primary)" size={32} />
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '1.75rem',
                                    borderRadius: '1.75rem',
                                    fontSize: '1.25rem',
                                    fontWeight: 950,
                                    boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                disabled={cart.length === 0}
                            >
                                <CreditCard size={24} /> FINALIZE & PRINT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- INVOICE OVERLAY --- */}
            {orderSuccess && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, backdropFilter: 'blur(20px)' }}>
                    <div className="animate-scale" style={{ width: '90%', maxWidth: '600px', background: 'white', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)' }}>
                        <div id="receipt-print" className="custom-scroll" style={{
                            padding: '2.5rem 3.5rem',
                            maxHeight: '65vh',
                            overflowY: 'auto',
                            background: 'white',
                            color: 'black',
                            fontFamily: 'Courier, monospace',
                            lineHeight: '1.4'
                        }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                                <h1 style={{ margin: '0 0 0.5rem', fontSize: '2.2rem', fontWeight: 950, letterSpacing: '-0.05em' }}>SMART GROCERY</h1>
                                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>ULTRA-PREMIUM RETAIL HUB</p>
                                <p style={{ margin: '0.3rem 0', fontSize: '0.8rem', color: '#64748b' }}>GSTIN: 33AAAAA0000A1Z5</p>
                                <div style={{ borderTop: '2px solid #000', margin: '1.5rem 0' }}></div>
                            </div>

                            <div style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>REF# <b>{orderSuccess.invoiceId}</b></span>
                                    <span>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span>OPERATOR: <b>SYSTEM</b></span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>CLIENT: <b>{orderSuccess.customer_name || 'GUEST'}</b></span>
                                    <span>{orderSuccess.customer_phone || 'N/A'}</span>
                                </div>
                                <div style={{ borderTop: '1.5px solid #000', margin: '1.5rem 0 1rem' }}></div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 950, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                                    <span style={{ flex: 2 }}>ITEM IDENTITY</span>
                                    <span style={{ flex: 1, textAlign: 'center' }}>QTY</span>
                                    <span style={{ flex: 1, textAlign: 'right' }}>VAL</span>
                                </div>
                                {orderSuccess.items.map((it, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                                        <span style={{ flex: 2 }}>{it.name.substring(0,20).toUpperCase()}{it.name.length > 20 ? '...' : ''}</span>
                                        <span style={{ flex: 1, textAlign: 'center' }}>{it.quantity}</span>
                                        <span style={{ flex: 1, textAlign: 'right' }}>₹{Number(it.final_price * it.quantity).toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '2px solid #000', padding: '1rem 0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    <span>NET VALUE</span>
                                    <span>₹{Number(orderSuccess.total_amount).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                                    <span>GST CONTENT</span>
                                    <span>₹{Number(orderSuccess.gst).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', marginBottom: '1rem', color: '#ef4444' }}>
                                    <span>DISCOUNT</span>
                                    <span>-₹{Number(orderSuccess.discount).toFixed(2)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.75rem', fontWeight: 950, borderTop: '2px solid #000', paddingTop: '1.5rem' }}>
                                    <span>TOTAL</span>
                                    <span>₹{Number(orderSuccess.final_amount).toFixed(0)}</span>
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }}>
                                <p style={{ margin: '0.5rem 0', fontWeight: 950, letterSpacing: '0.1em' }}>* EXPERIENCE THE FUTURE OF RETAIL *</p>
                                <p style={{ margin: 0, fontWeight: 700 }}>NO RETURNS ON ORGANIC PRODUCE</p>
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${orderSuccess.invoiceId}`} alt="QR" style={{ marginTop: '1.5rem', width: '80px', height: '80px' }} />
                                <p style={{ fontSize: '0.7rem', marginTop: '0.75rem', color: '#94a3b8' }}>SCAN TO DOWNLOAD DIGITAL INVOICE</p>
                            </div>
                        </div>

                        <div className="no-print" style={{ padding: '2rem 3.5rem', background: '#f8fafc', display: 'flex', gap: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                            <button onClick={handlePrint} className="btn btn-primary" style={{ flex: 1, height: '56px', borderRadius: '1rem', fontSize: '1rem', fontWeight: 950 }}>
                                <Printer size={20} /> PRINT RECEIPT
                            </button>
                            <button onClick={() => setOrderSuccess(null)} className="btn btn-secondary" style={{ flex: 1, height: '56px', borderRadius: '1rem', fontSize: '1rem', fontWeight: 950, background: 'white', border: '2px solid #e2e8f0' }}>
                                DISMISS
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
            .pos-billing-container { animation: animate-fade 0.5s ease; }
            .product-pos-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.1) !important; border-color: var(--primary) !important; }
            .custom-scroll::-webkit-scrollbar { width: 6px; }
            .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); borderRadius: 10px; }
            
            @media print {
                body { background: white !important; font-family: 'Courier New', Courier, monospace !important; }
                .app, navbar, .sidebar, footer, .admin-sidebar-wrapper, .no-print, .admin-content > *:not(.animate-fade) { display: none !important; }
                .admin-container { display: block !important; height: auto !important; overflow: visible !important; }
                .admin-content { padding: 0 !important; margin: 0 !important; background: white !important; }
                #receipt-print {
                    display: block !important;
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    max-width: 80mm !important;
                    margin: 0 !important;
                    padding: 4mm !important;
                    border: none !important;
                    box-shadow: none !important;
                    visibility: visible !important;
                }
                #receipt-print * { visibility: visible !important; }
            }
        `}</style>
        </div>
    );
};

export default POSBilling;
