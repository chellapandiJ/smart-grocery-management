import React from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight, ShieldCheck, Truck, Zap, Sparkles, Award, Box, Leaf } from 'lucide-react';

const Contact = () => {
    return (
        <div className="luxury-boutique-contact" style={{ background: 'var(--background)', color: 'var(--text)', minHeight: '100vh', padding: '180px 0 100px' }}>
            <div className="container-wide" style={{ width: '92%', margin: '0 auto', maxWidth: '2000px' }}>
                <div className="responsive-stack" style={{ gap: '8rem', alignItems: 'flex-start' }}>
                    
                    {/* --- CONTACT STORY --- */}
                    <div style={{ flex: 1 }} className="animate-reveal">
                        <h1 style={{ 
                            fontSize: 'clamp(3.5rem, 9vw, 6.5rem)', 
                            fontWeight: 800, 
                            fontFamily: 'var(--font-serif)', 
                            lineHeight: 1, 
                            color: 'var(--primary)', 
                            letterSpacing: '-0.04em',
                            marginBottom: '3rem'
                        }}>
                            Always here <br />
                            <span style={{ fontStyle: 'italic', fontWeight: 400, color: '#059669' }}>To Assist You.</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#64748b', fontWeight: 500, lineHeight: 1.8, marginBottom: '5rem' }}>
                            Whether you're a family in Usilampatti or a chef across Madurai, our boutique concierge is available 24/7 to ensure your ingredients are perfect.
                        </p>

                        <div className="luxury-info-list-p-wide">
                            <div className="cont-box-p-wide">
                                <div className="c-icon-p-wide"><MapPin size={24} /></div>
                                <div>
                                    <div className="c-lbl-p">THE HUB OPERATIONS</div>
                                    <div className="c-val-p">Madurai Road, Usilampatti</div>
                                </div>
                            </div>
                            <div className="cont-box-p-wide">
                                <div className="c-icon-p-wide" style={{ background: '#eff6ff', color: '#3b82f6' }}><Phone size={24} /></div>
                                <div>
                                    <div className="c-lbl-p">DIRECT HOTLINE</div>
                                    <div className="c-val-p">+91 93630 68133</div>
                                </div>
                            </div>
                            <div className="cont-box-p-wide">
                                <div className="c-icon-p-wide" style={{ background: '#fef3c7', color: '#f59e0b' }}><Clock size={24} /></div>
                                <div>
                                    <div className="c-lbl-p">MARKET HOURS</div>
                                    <div className="c-val-p">Always Open Online / 8AM-11PM Hub</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- CONTACT FORM CENTER --- */}
                    <div style={{ flex: 1.2 }} className="animate-scale">
                        <div className="boutique-form-frame-wide">
                            <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', fontWeight: 800, color: 'var(--primary)', marginBottom: '3rem' }}>Send a Transmission</h2>
                            <form style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2.5rem' }}>
                                    <div className="boutique-field">
                                        <label>YOUR IDENTITY</label>
                                        <input type="text" placeholder="Full name" />
                                    </div>
                                    <div className="boutique-field">
                                        <label>EMAIL CHANNEL</label>
                                        <input type="email" placeholder="example@email.com" />
                                    </div>
                                </div>
                                <div className="boutique-field">
                                    <label>SUBJECT OF INQUIRY</label>
                                    <input type="text" placeholder="How can we help today?" />
                                </div>
                                <div className="boutique-field">
                                    <label>TRANSMISSION DETAILS</label>
                                    <textarea rows="6" placeholder="Describe your requirements..."></textarea>
                                </div>
                                <button className="boutique-btn-main-wide">
                                    SEND MESSAGE <ArrowRight size={22} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .container-wide { max-width: 1400px; margin: 0 auto; padding: 0 5%; }
                .luxury-info-list-p-wide { display: flex; flex-direction: column; gap: 4rem; }
                .cont-box-p-wide { display: flex; gap: 2.5rem; align-items: center; }
                .c-icon-p-wide { width: 70px; height: 70px; border-radius: 1.5rem; background: #effaf5; color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
                .c-lbl-p { font-size: 0.75rem; font-weight: 900; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 5px; }
                .c-val-p { font-size: 1.6rem; font-weight: 800; color: var(--primary); font-family: var(--font-serif); }

                .boutique-form-frame-wide { background: white; padding: 6rem 5rem; border-radius: 4rem; box-shadow: 0 50px 100px -20px rgba(6, 78, 59, 0.05); }
                .boutique-field label { display: block; font-size: 0.75rem; fontWeight: 950; color: #b4bfd0; marginBottom: 12px; letterSpacing: 0.1em; }
                .boutique-field input, .boutique-field textarea { width: 100%; border: 2.5px solid #f1f5f9; border-radius: 1.25rem; padding: 22px 28px; font-size: 1.1rem; transition: all 0.3s; }
                .boutique-field input:focus, .boutique-field textarea:focus { border-color: var(--primary); outline: none; background: #fdfdfc; }
                
                .boutique-btn-main-wide {
                    background: var(--primary); color: white; border: none; padding: 0 40px; height: 80px; border-radius: 100px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 15px; cursor: pointer; transition: all 0.3s;
                    box-shadow: 0 20px 40px rgba(6, 78, 59, 0.2);
                }
                .boutique-btn-main-wide:hover { transform: translateY(-5px); background: var(--dark); }

                @media (max-width: 1024px) {
                    .responsive-stack { flex-direction: column !important; text-align: center; }
                    .boutique-form-frame-wide { padding: 3rem 2rem; border-radius: 2.5rem; }
                    .c-val-p { font-size: 1.4rem; }
                }
            `}</style>
        </div>
    );
};

export default Contact;
