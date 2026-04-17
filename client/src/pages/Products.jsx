import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, ShoppingCart, Plus, Minus, X, Filter, Tag, ArrowRight, Star, Heart, CheckCircle2, ShoppingBag, ZapOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariation, setSelectedVariation] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [cartCount, setCartCount] = useState(0);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
        fetchCartCount();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.product.getAll(),
                api.product.getCategories()
            ]);
            setProducts(prodRes.data.filter(p => p.is_published));
            setCategories(catRes.data);
        } catch (err) {
            console.error('Error fetching data', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCartCount = async () => {
        if (user) {
            try {
                const res = await api.cart.get();
                setCartCount(res.data.length);
            } catch (err) { }
        }
    };

    const handleOpenPopup = (product) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedProduct(product);
        if (product.variations && product.variations.length > 0) {
            setSelectedVariation(product.variations[0]);
        } else {
            setSelectedVariation(null);
        }
        setQuantity(1);
    };

    const handleAddToCart = async () => {
        try {
            await api.cart.add({
                product_id: selectedProduct.id,
                quantity: quantity,
                variation_id: selectedVariation ? selectedVariation.id : null
            });
            setSelectedProduct(null);
            fetchCartCount();
        } catch (err) {
            alert('Failed to add to cart');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory ? p.category_id == selectedCategory : true;
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const displayPrice = selectedVariation ? selectedVariation.price : (selectedProduct ? selectedProduct.final_price : 0);

    return (
        <div className="products-page hero-gradient" style={{ minHeight: '100vh', paddingTop: '100px' }}>
            {/* --- FLOATING CART --- */}
            {user && (
                <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100 }}>
                    <button
                        onClick={() => navigate('/cart')}
                        className="btn btn-primary animate-scale"
                        style={{
                            padding: '1.25rem 2rem',
                            borderRadius: '2rem',
                            boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            border: 'none'
                        }}
                    >
                        <div style={{ position: 'relative' }}>
                            <ShoppingCart size={24} />
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: '2.5px solid var(--primary)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 900 }}>{cartCount}</div>
                        </div>
                        <span style={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.85rem' }}>Checkout Now</span>
                    </button>
                </div>
            )}

            <div className="container" style={{ padding: '3rem 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-up">
                    <div className="glass-pill" style={{ marginBottom: '1rem' }}>
                        <ShoppingBag size={14} fill="currentColor" /> Market Catalog
                    </div>
                    <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>Our Smart Selection</h1>
                    <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Search size={22} style={{ position: 'absolute', left: '1.5rem', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search fresh ingredients, essentials..."
                                style={{
                                    paddingRight: '1rem',
                                    paddingLeft: '4rem',
                                    height: '64px',
                                    borderRadius: '2rem',
                                    background: 'white',
                                    border: '2px solid #f1f5f9',
                                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                                    fontSize: '1.05rem',
                                    fontWeight: 500
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '3rem', flexDirection: window.innerWidth < 1024 ? 'column' : 'row' }}>
                    {/* --- CATEGORY SIDEBAR --- */}
                    <div style={{ width: window.innerWidth < 1024 ? '100%' : '280px', flexShrink: 0 }}>
                        <div className="premium-card animate-slide-left" style={{ position: window.innerWidth < 1024 ? 'relative' : 'sticky', top: '120px', padding: '2.5rem', borderRadius: '2.5rem' }}>
                            <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.85rem', fontWeight: 900, fontSize: '1.1rem' }}><Filter size={20} color="var(--primary)" /> FILTER MARKET</h3>
                            <div style={{ display: 'flex', flexDirection: window.innerWidth < 1024 ? 'row' : 'column', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                <button
                                    onClick={() => setSelectedCategory('')}
                                    style={{
                                        textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '1.25rem',
                                        background: selectedCategory === '' ? 'var(--primary-light)' : 'transparent',
                                        color: selectedCategory === '' ? 'var(--primary-dark)' : '#64748b',
                                        fontWeight: 800, fontSize: '0.9rem',
                                        border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    All Categories
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        style={{
                                            textAlign: 'left', padding: '1rem 1.25rem', borderRadius: '1.25rem',
                                            background: selectedCategory == cat.id ? 'var(--primary-light)' : 'transparent',
                                            color: selectedCategory == cat.id ? 'var(--primary-dark)' : '#64748b',
                                            fontWeight: 800, fontSize: '0.9rem',
                                            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- PRODUCT GRID --- */}
                    <div style={{ flex: 1 }}>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '8rem 0' }}>
                                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid #f1f5f9', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 1.5rem' }}></div>
                                <p style={{ fontWeight: 800, color: '#94a3b8' }}>SCANNING MARKET...</p>
                            </div>
                        ) : (
                            <div className="grid-responsive" style={{ '--grid-cols': 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                                {filteredProducts.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAdd={() => handleOpenPopup(product)}
                                    />
                                ))}
                            </div>
                        )}
                        {!loading && filteredProducts.length === 0 && (
                            <div className="premium-card" style={{ textAlign: 'center', padding: '6rem 3rem', borderRadius: '3rem', color: '#94a3b8' }}>
                                <ZapOff size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                                <h3 style={{ margin: 0, fontWeight: 900, color: 'var(--dark)' }}>No products found</h3>
                                <p>Try adjusting your search terms or category filter.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- ADD TO CART MODAL --- */}
            {selectedProduct && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(10px)' }}>
                    <div className="premium-card animate-scale" style={{ width: '90%', maxWidth: '440px', padding: '3rem', borderRadius: '3rem', position: 'relative' }}>
                        <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', right: '2rem', top: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={28} /></button>

                        <div style={{ textAlign: 'center' }}>
                            <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 2rem' }}>
                                <img
                                    src={`/uploads/products/${selectedProduct.image}`}
                                    alt=""
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/180x180?text=' + selectedProduct.name; }}
                                />
                                {selectedProduct.discount > 0 && (
                                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', border: '4px solid white' }}>
                                        -{Math.round(selectedProduct.discount)}%
                                    </div>
                                )}
                            </div>

                            <h2 style={{ marginBottom: '0.75rem', fontSize: '1.75rem', fontWeight: 900, color: 'var(--dark)' }}>{selectedProduct.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#fbbf24', marginBottom: '1.5rem' }}>
                                <Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} fill="#fbbf24" /><Star size={16} strokeWidth={2} />
                                <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 800, marginLeft: '0.5rem' }}>4.9 (2k+ Reviews)</span>
                            </div>

                            {/* Variation Selection */}
                            {selectedProduct.variations && selectedProduct.variations.length > 0 && (
                                <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>SELECT SIZE / WEIGHT</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                        {selectedProduct.variations.map(v => (
                                            <button
                                                key={v.id}
                                                onClick={() => setSelectedVariation(v)}
                                                style={{
                                                    padding: '1rem', borderRadius: '1.25rem', border: '2.5px solid',
                                                    borderColor: selectedVariation?.id === v.id ? 'var(--primary)' : '#f1f5f9',
                                                    background: selectedVariation?.id === v.id ? 'var(--primary-light)' : 'white',
                                                    color: selectedVariation?.id === v.id ? 'var(--primary-dark)' : '#64748b',
                                                    fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s'
                                                }}
                                            >
                                                {v.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '2rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>₹{Number(displayPrice).toLocaleString('en-IN')}</span>
                                    <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 800, paddingBottom: '0.25rem' }}>/ {selectedVariation ? selectedVariation.name : selectedProduct.unit}</span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ background: 'white', width: '56px', height: '56px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><Minus size={22} color="var(--primary)" strokeWidth={3} /></button>
                                    <span style={{ fontSize: '2rem', fontWeight: 900, width: '40px' }}>{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} style={{ background: 'white', width: '56px', height: '56px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}><Plus size={22} color="var(--primary)" strokeWidth={3} /></button>
                                </div>
                            </div>

                            <button onClick={handleAddToCart} className="btn btn-primary" style={{ width: '100%', height: '70px', borderRadius: '2rem', fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.4)' }}>
                                Add to Basket <ArrowRight size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product, onAdd }) => {
    const isLowStock = product.stock > 0 && product.stock < product.min_stock;
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="premium-card animate-up" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', borderRadius: '2.5rem', position: 'relative' }}>
            <div style={{ position: 'relative', height: '220px', marginBottom: '1.5rem', borderRadius: '2rem', overflow: 'hidden', background: '#f8fafc' }}>
                <img
                    src={`/uploads/products/${product.image}`}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    className="product-image"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400?text=' + product.name; }}
                />

                {product.discount > 0 && (
                    <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#ef4444', color: 'white', padding: '0.4rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 900, boxShadow: '0 5px 15px rgba(239, 68, 68, 0.3)' }}>
                        -{Math.round(product.discount)}% OFF
                    </div>
                )}

                <button
                    onClick={onAdd}
                    disabled={isOutOfStock}
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        background: 'white',
                        color: 'var(--primary)',
                        width: '50px',
                        height: '50px',
                        borderRadius: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        opacity: isOutOfStock ? 0.3 : 1
                    }}
                >
                    <Plus size={24} strokeWidth={3} />
                </button>
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category_name || 'Market Item'}</span>
                    <Heart size={16} color="#cbd5e1" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--dark)' }}>{product.name}</h3>

                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--dark)' }}>₹{Number(product.final_price).toLocaleString('en-IN')}</span>
                    {product.discount > 0 && (
                        <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600, paddingBottom: '0.2rem' }}>₹{Number(product.price).toLocaleString('en-IN')}</span>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={12} fill={s <= 4 ? "#fbbf24" : "none"} color="#fbbf24" />)}
                </div>
                {isOutOfStock ? (
                    <span style={{ background: '#fee2e2', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '0.6rem', fontSize: '0.65rem', fontWeight: 900 }}>SOLD OUT</span>
                ) : isLowStock ? (
                    <span style={{ background: '#fef3c7', color: '#f59e0b', padding: '0.3rem 0.6rem', borderRadius: '0.6rem', fontSize: '0.65rem', fontWeight: 900 }}>LOW STOCK</span>
                ) : (
                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.65rem', fontWeight: 900 }}><CheckCircle2 size={12} /> IN STOCK</span>
                )}
            </div>

            <style>{`
                .product-card:hover .product-image {
                    transform: scale(1.1);
                }
            `}</style>
        </div>
    );
};

export default Products;
