import React from 'react';
import { ShieldCheck, Truck, Zap, Award, Users, Heart, Leaf, Star, CheckCircle2, ShoppingBag, Sparkles, Box, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="luxury-boutique-about" style={{ background: 'var(--background)', color: 'var(--text)', minHeight: '100vh', padding: '180px 0 100px' }}>
            <div className="container-wide" style={{ width: '92%', margin: '0 auto', maxWidth: '2000px' }}>
                {/* --- STORYTELLING HERO --- */}
                <div style={{ textAlign: 'center', marginBottom: '12rem' }} className="animate-reveal">
                    <h1 style={{ 
                        fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', 
                        fontWeight: 800, 
                        fontFamily: 'var(--font-serif)', 
                        lineHeight: 1, 
                        color: 'var(--primary)', 
                        letterSpacing: '-0.04em',
                        marginBottom: '3rem'
                    }}>
                        Selection of the <br />
                        <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#059669' }}>High-Standard Market.</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 500, lineHeight: 1.8, maxWidth: '900px', margin: '0 auto' }}>
                        We believe that transparency in the grocery lane is a necessity, not a choice. From the deep farms of Madurai to your table, every step is a dedicated commitment to organic purity.
                    </p>
                </div>

                {/* --- COLLAGE STORY SECTION --- */}
                <div className="responsive-stack" style={{ gap: '8rem', alignItems: 'center', marginBottom: '14rem' }}>
                    <div style={{ flex: 1 }}>
                        <div className="art-collage-frame-wide">
                            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200" alt="About Main" className="img-f1-wide" />
                            <div className="img-f2-p-wide"><img src="https://images.unsplash.com/photo-1510443312945-8fe39ac01ee6?auto=format&fit=crop&q=80&w=600" alt="About Detail" className="img-f2-wide" /></div>
                        </div>
                    </div>
                    <div style={{ flex: 1.2 }} className="animate-reveal">
                        <div style={{ color: '#b45309', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.2em', marginBottom: '1.5rem' }}>THE ORIGIN MISSION</div>
                        <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', marginBottom: '3rem' }}>
                            Engineered by Nature, <br />
                            <span style={{ fontStyle: 'italic', color: '#059669', fontWeight: 400 }}>Perfected by Hub.</span>
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: '#475569', lineHeight: 1.8, marginBottom: '5rem' }}>
                            We have integrated directly with Southern Tamil Nadu's elite farm network. By removing the industrial delay of distribution centers, we bring life back to your kitchen with ingredients that are harvested, not inventoried.
                        </p>
                        <div className="boutique-stats-grid-wide">
                            <div className="b-stat-p">
                                <div className="b-stat-val">50+</div>
                                <div className="b-stat-lbl">FARMS</div>
                            </div>
                            <div className="b-stat-p">
                                <div className="b-stat-val">25min</div>
                                <div className="b-stat-lbl">AVG DELIV</div>
                            </div>
                            <div className="b-stat-p">
                                <div className="b-stat-val">100%</div>
                                <div className="b-stat-lbl">FRESH</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- ARTISANAL PILLARS --- */}
                <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
                    <h2 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)' }}>Artisanal Foundations.</h2>
                </div>
                <div className="grid-responsive-wide" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
                    {[
                        { title: 'Quality Audits', icon: ShieldCheck, desc: 'A multi-step purity check from the field to our Usilampatti hub.' },
                        { title: 'Direct Sourcing', icon: Leaf, desc: 'Partnering with Madurai farms to ensure transparency and fairness.' },
                        { title: 'Elite Delivery', icon: Truck, desc: 'Always dispatched with high-grade care to keep the cold chain intact.' }
                    ].map((item, i) => (
                        <div key={i} className="pillar-tile-art-wide">
                            <div className="tile-icon-art-wide"><item.icon size={40} color="var(--primary)" /></div>
                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* --- THE HUB FOOTER CALL --- */}
                <div style={{ marginTop: '14rem', padding: '10rem 6rem', background: 'var(--primary)', borderRadius: '4rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '4rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'white', marginBottom: '3rem' }}>Join the High Standard.</h2>
                    <p style={{ fontSize: '1.5rem', color: 'rgba(255,255,255,0.7)', maxWidth: '800px', margin: '0 auto 6rem', fontWeight: 500 }}>
                        We are building a community of ingredient lovers in Usilampatti. Start your collection journey now.
                    </p>
                    <Link to="/register" className="designer-btn-about" style={{ background: 'white', color: 'var(--primary)', padding: '0 5rem', height: '80px', fontSize: '1.2rem', margin: '0 auto', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', borderRadius: '100px', fontWeight: 800 }}>GET STARTED</Link>
                </div>
            </div>

            <style>{`
                .art-collage-frame-wide { position: relative; width: 100%; height: 650px; }
                .img-f1-wide { width: 85%; height: 100%; object-fit: cover; border-radius: 4rem; transform: rotate(-2deg); box-shadow: 0 40px 120px rgba(0,0,0,0.1); }
                .img-f2-p-wide { position: absolute; bottom: -40px; right: 0; width: 60%; height: 400px; border-radius: 3rem; background: var(--background); padding: 15px; box-shadow: 0 40px 100px rgba(0,0,0,0.15); transform: rotate(4deg); }
                .img-f2-wide { width: 100%; height: 100%; object-fit: cover; border-radius: 2.5rem; }

                .boutique-stats-grid-wide { display: flex; gap: 5rem; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 4rem; margin-top: 4rem; }
                .b-stat-val { font-size: 3rem; fontWeight: 800; color: var(--primary); fontFamily: var(--font-serif); }
                .b-stat-lbl { font-size: 0.75rem; fontWeight: 900; color: #94a3b8; letter-spacing: 0.1em; margin-top: 5px; }

                .pillar-tile-art-wide { background: white; padding: 6rem 5rem; border-radius: 4rem; border: 1.5px solid rgba(0,0,0,0.03); text-align: center; transition: all 0.5s; }
                .pillar-tile-art-wide:hover { transform: translateY(-30px); border-color: var(--primary); box-shadow: 0 50px 100px -20px rgba(6, 78, 59, 0.1); }
                .tile-icon-art-wide { width: 100px; height: 100px; background: #effaf5; border-radius: 2.5rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 4rem; }
                .pillar-tile-art-wide h3 { font-size: 2rem; fontWeight: 800; fontFamily: var(--font-serif); color: var(--primary); marginBottom: 2rem; }
                .pillar-tile-art-wide p { color: #64748b; lineHeight: 1.8; font-weight: 500; font-size: 1.1rem; }

                @media (max-width: 1024px) {
                    .responsive-stack { flex-direction: column !important; text-align: center; }
                    .art-collage-frame-wide { height: 400px; margin-bottom: 8rem; }
                    .boutique-stats-grid-wide { flex-direction: column; gap: 3rem; text-align: left; }
                    .img-f2-p-wide { width: 70%; height: 250px; bottom: -80px; }
                }
            `}</style>
        </div>
    );
};

export default About;
