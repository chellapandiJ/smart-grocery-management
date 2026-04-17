import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: '#0f172a',
            color: 'rgba(255, 255, 255, 0.6)',
            padding: '6rem 0 2.5rem',
            marginTop: 'auto',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '4rem',
                    marginBottom: '5rem'
                }}>
                    {/* Brand Column */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem' }}>
                            <div style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.65rem',
                                borderRadius: '1.25rem',
                                display: 'flex',
                                boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)'
                            }}>
                                <ShoppingBag size={24} strokeWidth={2.5} />
                            </div>
                            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em' }}>Smart Grocery</span>
                        </Link>
                        <p style={{ lineHeight: 1.8, marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                            Redefining the supermarket experience with smart technology and farmhouse freshness. Quality essentials delivered daily.
                        </p>
                        <div style={{ display: 'flex', gap: '1.25rem' }}>
                            <a href="#" className="social-icon"><Facebook size={20} /></a>
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                            <a href="#" className="social-icon"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Youtube size={20} /></a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Quick Nav</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <li><Link to="/" className="footer-link">Home</Link></li>
                            <li><Link to="/products" className="footer-link">Products</Link></li>
                            <li><Link to="/about" className="footer-link">About Us</Link></li>
                            <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Customer Care</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <li><a href="#" className="footer-link">Help & Documentation</a></li>
                            <li><a href="#" className="footer-link">Privacy Standards</a></li>
                            <li><a href="#" className="footer-link">Return Policy</a></li>
                            <li><Link to="/login?role=admin" className="footer-link" style={{ color: 'var(--primary)', fontWeight: 800 }}>Staff Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Direct Access</h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <li style={{ display: 'flex', gap: '1.1rem', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.85rem' }}>
                                    <MapPin size={20} color="var(--primary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>Madurai Road, <br />Usilampatti, Tamil Nadu</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.85rem' }}>
                                    <Phone size={20} color="var(--primary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>+91 93630 68133</span>
                            </li>
                            <li style={{ display: 'flex', gap: '1.1rem', alignItems: 'center' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '0.85rem' }}>
                                    <Mail size={20} color="var(--primary)" />
                                </div>
                                <span style={{ fontSize: '0.95rem' }}>hello@smartgrocery.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: '2.5rem',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    letterSpacing: '0.02em'
                }}>
                    <p>© {new Date().getFullYear()} Smart Grocery Supermarket. Engineered for Freshness.</p>
                </div>
            </div>

            <style>{`
                .social-icon {
                    width: 44px;
                    height: 44px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    color: rgba(255,255,255,0.6);
                }
                .social-icon:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
                    border-color: var(--primary);
                }
                .footer-link {
                    transition: all 0.3s ease;
                    text-decoration: none;
                    color: inherit;
                    font-size: 0.95rem;
                }
                .footer-link:hover {
                    color: var(--primary);
                    padding-left: 8px;
                }
            `}</style>
        </footer>
    );
};

export default Footer;
