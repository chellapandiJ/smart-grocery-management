import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ShoppingCart, ShieldCheck, Zap, ArrowRight, Star, Clock, Truck,
    ChevronRight, Apple, Heart, Mail, Phone, MapPin,
    Navigation, CheckCircle2, Award, ZapOff, Scale, Leaf, Coffee, Cookie, IceCream, Users, ShoppingBag as Bag,
    Search, Sparkles, Box, Activity, ChevronLeft, Instagram, Facebook as Fb, Twitter as Tw
} from 'lucide-react';

const Home = () => {
    // ELITE ARTISANAL BOUTIQUE IMAGERY (PEXELS)
    const categories = [
        { name: 'Tropical Fruits', icon: Apple, color: '#10b981', img: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Dairy & Farm Eggs', icon: IceCream, color: '#3b82f6', img: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Artisan Grains', icon: Cookie, color: '#ef4444', img: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { name: 'Gourmet Spices', icon: Coffee, color: '#f59e0b', img: 'https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ];

    return (
        <div className="luxury-organic-experience" style={{ background: 'var(--background)', width: '100%', overflowX: 'hidden' }}>
            {/* --- ARTISANAL HERO (PORTAL LOOK) --- */}
            <section style={{ minHeight: '100vh', paddingTop: '160px', display: 'flex', alignItems: 'center', position: 'relative', paddingBottom: '120px' }}>
                <div style={{ width: '92%', margin: '0 auto', maxWidth: '1800px' }}>
                    <div className="flex-layout-wide" style={{ display: 'flex', gap: '8rem', alignItems: 'center' }}>
                        <div style={{ flex: 1.2 }}>
                            <h1 style={{ fontSize: 'clamp(4rem, 8vw, 7.5rem)', fontWeight: 800, fontFamily: 'var(--font-serif)', lineHeight: 0.9, color: 'var(--primary)', letterSpacing: '-0.04em', marginBottom: '3rem' }}>
                                The Pure <br />
                                <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#059669' }}>Artisanal</span> <br />
                                Marketplace.
                            </h1>
                            <p style={{ fontSize: '1.4rem', color: '#475569', marginBottom: '5rem', maxWidth: '750px', lineHeight: 1.8, fontWeight: 500 }}>
                                Delivering elite organic groceries from Madurai's Heritage farm networks. Sourced with high-standard logic for your boutique home.
                            </p>
                            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}>
                                <Link to="/products" className="designer-btn-major">SHOP MARKET <ArrowRight size={26} /></Link>
                                <a href="#story" className="designer-btn-minor">OUR STORY</a>
                            </div>
                        </div>

                        <div style={{ flex: 1 }}>
                            <div className="boutique-hero-collage">
                                <img src="https://images.pexels.com/photos/1435735/pexels-photo-1435735.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Boutique Shop" className="main-collage-img" />
                                <div className="minor-collage-frame">
                                    <img src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Fresh Basket" className="minor-collage-img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ARTISANAL SELECTIONS --- */}
            <section style={{ padding: '12rem 0', background: 'white' }}>
                <div style={{ width: '92%', margin: '0 auto', maxWidth: '1800px' }}>
                    <div className="section-head-unique" style={{ textAlign: 'center', marginBottom: '10rem' }}>
                        <div style={{ color: '#b45309', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.3em', marginBottom: '2.5rem' }}>COLLECTION 2026</div>
                        <h2 style={{ fontSize: '4.8rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.03em' }}>Artisanal Selections.</h2>
                    </div>

                    <div className="artisanal-wide-grid">
                        {categories.map((cat, i) => (
                            <Link to="/products" key={i} className="boutique-cat-card">
                                <div className="boutique-media-p"><img src={cat.img} alt={cat.name} /></div>
                                <div className="boutique-info-p">
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 850, color: 'var(--primary)', marginBottom: '0.6rem' }}>{cat.name}</h3>
                                    <div className="boutique-year-tag">EDITION 2026 <ChevronRight size={20} /></div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- STORY FOOTER --- */}
            <section id="story" style={{ padding: '14rem 0', background: '#f8fafc' }}>
                <div style={{ width: '92%', margin: '0 auto', maxWidth: '1800px' }}>
                    <div className="flex-layout-wide" style={{ display: 'flex', gap: '10rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <div className="boutique-story-frame">
                                <img src="https://images.pexels.com/photos/4054850/pexels-photo-4054850.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Farm to Table" />
                                <div className="boutique-stat-p">
                                    <div className="stat-v">50+</div>
                                    <div className="stat-l">Madurai Elite Farms</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ flex: 1.2 }}>
                            <div style={{ color: '#b45309', fontWeight: 900, fontSize: '0.9rem', letterSpacing: '0.25em', marginBottom: '2.5rem' }}>BEYOND ORGANIC</div>
                            <h2 style={{ fontSize: '4.5rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', marginBottom: '4rem', lineHeight: 1.1 }}>Experience the <br /> <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#059669' }}>Authentic Fresh.</span></h2>
                            <p style={{ fontSize: '1.4rem', color: '#475569', lineHeight: 1.8, marginBottom: '6rem' }}>Every product is physically audited by our Usilampatti Hub specialists to ensure it meets the High-Standard Boutique logic of the 2026 Collection.</p>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .designer-btn-major { background: #0f172a; color: white; padding: 0 4.5rem; height: 88px; border-radius: 100px; display: inline-flex; align-items: center; gap: 15px; font-weight: 850; font-size: 1.15rem; text-decoration: none; transition: all 0.4s; box-shadow: 0 30px 60px rgba(0,0,0,0.18); }
                .designer-btn-minor { background: transparent; border: 2.5px solid #e2e8f0; color: #475569; padding: 0 4.5rem; height: 88px; border-radius: 100px; display: inline-flex; align-items: center; font-weight: 850; font-size: 1.15rem; text-decoration: none; transition: all 0.3s; }
                .designer-btn-major:hover { transform: translateY(-8px); background: #059669; }

                .boutique-hero-collage { position: relative; width: 100%; height: 800px; }
                .main-collage-img { width: 92%; height: 100%; object-fit: cover; border-radius: 4.5rem; transform: rotate(-1.5deg); box-shadow: 0 60px 120px rgba(0,0,0,0.15); }
                .minor-collage-frame { position: absolute; bottom: 0; right: 0; width: 55%; height: 60%; padding: 15px; background: white; border-radius: 3.5rem; transform: rotate(3.5deg); box-shadow: 0 40px 80px rgba(0,0,0,0.1); }
                .minor-collage-img { width: 100%; height: 100%; object-fit: cover; border-radius: 2.75rem; }

                .artisanal-wide-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4rem; }
                .boutique-cat-card { text-decoration: none; }
                .boutique-media-p { height: 420px; border-radius: 3rem; overflow: hidden; margin-bottom: 2.5rem; border: 2px solid #f1f5f9; background: #fafafa; }
                .boutique-media-p img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
                .boutique-cat-card:hover .boutique-media-p img { transform: scale(1.1); }
                .boutique-year-tag { display: flex; align-items: center; gap: 8px; color: #94a3b8; font-weight: 900; font-size: 0.9rem; }

                .boutique-story-frame { position: relative; height: 750px; border-radius: 4.5rem; overflow: hidden; }
                .boutique-story-frame img { width: 100%; height: 100%; object-fit: cover; }
                .boutique-stat-p { position: absolute; top: 60px; left: 60px; background: white; padding: 3rem 4rem; border-radius: 3rem; box-shadow: 0 40px 100px rgba(0,0,0,0.1); text-align: center; }
                .stat-v { font-size: 4rem; fontWeight: 850; color: var(--primary); fontFamily: var(--font-serif); }
                .stat-l { font-size: 0.85rem; fontWeight: 950; color: #94a3b8; letter-spacing: 0.1em; }

                @media (max-width: 1440px) { .artisanal-wide-grid { grid-template-columns: repeat(2, 1fr); } }
                @media (max-width: 1024px) {
                    .flex-layout-wide { flex-direction: column !important; text-align: center; }
                    .boutique-hero-collage { height: 500px; }
                }
            `}</style>
        </div>
    );
};

export default Home;
