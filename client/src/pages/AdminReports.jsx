import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    Filler
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { TrendingUp, ShoppingBag, PieChart, BarChart2, Calendar, Target, Users, ArrowUpRight, ArrowDownRight, Share2, Download, Filter, FileText, FileSpreadsheet, Zap, Smartphone, Store, Clock, Wallet } from 'lucide-react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    Filler
);

const AdminReports = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('daily');
    const [source, setSource] = useState('all'); // all, online, offline

    useEffect(() => {
        fetchReports();
    }, [period, source]);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await api.admin.getReports({ period, source });
            setData(res.data);
        } catch (err) {
            console.error('Error fetching reports');
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();
        const timestamp = new Date().toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        const totalRev = data.totalRevenue || 0;
        const totalCost = data.totalCost || 0;
        const totalProf = data.totalProfit || 0;

        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59);
        doc.text("SMART GROCERY PERFORMANCE REPORT", 20, 20);

        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text(`Frequency: ${period.toUpperCase()}`, 20, 30);
        doc.text(`Channel: ${source.toUpperCase()}`, 70, 30);
        doc.text(`Generated On: ${timestamp}`, 20, 38);

        // Sales Overview
        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59);
        doc.text("SALES KPI SUMMARY", 20, 50);
        doc.autoTable({
            startY: 55,
            head: [['Operational Metric', 'Performance Value']],
            body: [
                ['Total Revenue (Sales)', `Rs. ${Number(totalRev).toLocaleString('en-IN')}`],
                ['Total Cost (Purchase)', `Rs. ${Number(totalCost).toLocaleString('en-IN')}`],
                ['Net Profit / Margin', `Rs. ${Number(totalProf).toLocaleString('en-IN')}`],
                ['Average Transaction', `Rs. ${Number(data.avgOrder).toFixed(2)}`],
                ['Items Distributed', `${data.itemsSold} Units`],
                ['Active Customers', `${data.customerCount} Identities`],
            ],
            theme: 'striped',
            headStyles: { fillColor: [30, 41, 59] }
        });

        // Top Products Detailed
        doc.text("DETAILED PRODUCT SALES LOG", 20, doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Product Identity', 'Units Dispatched', 'Current Stock', 'Revenue Yield', 'Avg Price']],
            body: (data.topProducts || []).map(p => [
                p.name,
                p.total_qty,
                p.current_stock,
                `Rs. ${Number(p.amount).toLocaleString('en-IN')}`,
                `Rs. ${(Number(p.amount) / Number(p.total_qty)).toFixed(2)}`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }
        });

        // Itemized Product Sales Log (New)
        doc.text("ITEMIZED PRODUCT SALES PROTOCOL", 20, doc.lastAutoTable.finalY + 15);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 20,
            head: [['Date', 'Invoice ID', 'Product', 'Qty', 'Unit Price', 'Total']],
            body: (data.saleItems || []).map(item => [
                new Date(item.created_at).toLocaleDateString(),
                `#${item.invoice_id}`,
                item.product_name,
                item.quantity,
                `Rs. ${Number(item.price).toFixed(2)}`,
                `Rs. ${Number(item.line_total).toFixed(2)}`
            ]),
            theme: 'striped',
            headStyles: { fillColor: [15, 23, 42] }
        });

        doc.save(`GROCERY_MASTER_REPORT_${source.toUpperCase()}_${Date.now()}.pdf`);
    };

    const downloadExcel = () => {
        const timestamp = new Date().toLocaleString('en-IN');
        const reportData = [
            ["SMART GROCERY PERFORMANCE REPORT"],
            ["GENERATED ON", timestamp],
            ["CHANNEL", source.toUpperCase()],
            ["PERIOD", period.toUpperCase()],
            [],
            ["OVERALL KPIs"],
            ["Metric Name", "Metric Value"],
            ["Total Revenue", data.totalRevenue],
            ["Average Order Value", data.avgOrder],
            ["Total Items Sold", data.itemsSold],
            ["Unique Customers", data.customerCount],
            ["Online Sales (Historical)", data.onlineSales],
            ["Offline Sales (Historical)", data.offlineSales],
            [],
            ["PRODUCT SALES ANALYSIS"],
            ["Product Identity", "Units Sold", "Current Stock", "Total Revenue", "Avg Price"],
            ...(data.topProducts || []).map(p => [p.name, p.total_qty, p.current_stock, p.amount, (Number(p.amount) / Number(p.total_qty)).toFixed(2)]),
            [],
            ["RECENT TRANSACTION LOG"],
            ["Date & Time", "Invoice ID", "Channel", "Customer Profile", "Amount Received"],
            ...(data.recentOrders || []).map(o => [
                new Date(o.created_at).toLocaleString(),
                o.invoice_id,
                o.user_id ? 'ONLINE' : 'OFFLINE',
                o.customer_name,
                o.final_amount
            ]),
            [],
            ["VIP CUSTOMERS LOG"],
            ["Name", "Contact", "Order Frequency", "Total Contribution"],
            ...(data.topCustomers || []).map(c => [c.name, c.phone, c.order_count, c.total_spent]),
            [],
            ["ITEMIZED PRODUCT SALES PROTOCOL"],
            ["Date", "Invoice ID", "Product Identity", "Quantity", "Unit Price", "Total Amount", "Channel"],
            ...(data.saleItems || []).map(item => [
                new Date(item.created_at).toLocaleDateString(),
                item.invoice_id,
                item.product_name,
                item.quantity,
                item.price,
                item.line_total,
                item.order_type.toUpperCase()
            ])
        ];

        const ws = XLSX.utils.aoa_to_sheet(reportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Operational Intel");
        XLSX.writeFile(wb, `GROCERY_INTEL_${source.toUpperCase()}_${Date.now()}.xlsx`);
    };

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="animate-spin" style={{ width: '60px', height: '60px', border: '5px solid var(--primary-light)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '2rem', fontWeight: 950, color: 'var(--dark)', fontSize: '1.25rem', letterSpacing: '0.05em' }}>QUANTIFYING PERFORMANCE...</p>
        </div>
    );
    if (!data) return <div className="container py-20" style={{ textAlign: 'center', fontWeight: 900, color: '#ef4444' }}>ANALYTICAL FAULT: DATA NOT DETECTED</div>;

    const trendData = {
        labels: data.labels || [],
        datasets: [{
            label: 'Net Revenue',
            data: data.values || [],
            borderColor: source === 'online' ? '#10b981' : (source === 'offline' ? '#3b82f6' : 'var(--dark)'),
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            fill: true,
            tension: 0.45,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointBackgroundColor: 'white',
            pointBorderColor: source === 'online' ? '#10b981' : (source === 'offline' ? '#3b82f6' : 'var(--dark)'),
            pointBorderWidth: 4,
            borderWidth: 4
        }]
    };

    const catData = {
        labels: data.categoryLabels || [],
        datasets: [{
            data: data.categoryValues || [],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
            hoverOffset: 30,
            borderWidth: 10,
            borderColor: 'white'
        }]
    };

    const sourceSplitData = {
        labels: ['Online Channel', 'Offline POS'],
        datasets: [{
            data: [data.onlineSales, data.offlineSales],
            backgroundColor: ['#10b981', '#3b82f6'],
            borderWidth: 0,
            hoverOffset: 20
        }]
    };

    const productSalesData = {
        labels: (data.topProducts || []).slice(0, 5).map(p => p.name),
        datasets: [{
            label: 'Total Revenue (₹)',
            data: (data.topProducts || []).slice(0, 5).map(p => p.amount),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 12,
            barThickness: 25
        }]
    };

    const stats = [
        { label: 'Market Revenue', value: `₹${Number(data.totalRevenue).toLocaleString('en-IN')}`, icon: TrendingUp, color: '#10b981', growth: '+12.5%' },
        { label: 'Net Profit (P&L)', value: `₹${Number(data.totalProfit).toLocaleString('en-IN')}`, icon: Zap, color: '#8b5cf6', growth: '+18.2%' },
        { label: 'Operational Cost', value: `₹${Number(data.totalCost).toLocaleString('en-IN')}`, icon: Wallet, color: '#ef4444', growth: '+5.4%' },
        { label: 'Basket Mean', value: `₹${Number(data.avgOrder).toFixed(0)}`, icon: ShoppingBag, color: '#3b82f6', growth: '+4.2%' }
    ];

    return (
        <div className="admin-reports-container" style={{ padding: '1rem' }}>
            {/* --- CINEMATIC HEADER --- */}
            <header style={{ marginBottom: '4rem', animation: 'animate-up 0.5s ease-out' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <h1 style={{ fontWeight: 950, fontSize: '3.5rem', margin: 0, letterSpacing: '-0.04em', color: 'var(--dark)' }}>Analytical Terminal</h1>
                        <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1.25rem', marginTop: '0.5rem' }}>Strategic data insights for the current commerce window.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="glass-pill" style={{ padding: '0.4rem', display: 'flex', gap: '0.2rem', background: '#f1f5f9' }}>
                            {['today', 'daily', 'weekly', 'monthly'].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPeriod(p)}
                                    style={{
                                        padding: '0.75rem 1.75rem',
                                        borderRadius: '1rem',
                                        border: 'none',
                                        fontWeight: 950,
                                        cursor: 'pointer',
                                        background: period === p ? 'var(--dark)' : 'transparent',
                                        color: period === p ? 'white' : '#64748b',
                                        fontSize: '0.7rem',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s'
                                    }}
                                >{p === 'daily' ? '7 Days' : p}</button>
                            ))}
                        </div>
                        <button onClick={downloadPDF} className="btn btn-dark" style={{ height: '54px', padding: '0 1.5rem', borderRadius: '1.25rem', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <FileText size={20} /> PDF
                        </button>
                        <button onClick={downloadExcel} className="btn btn-primary" style={{ height: '54px', padding: '0 1.5rem', borderRadius: '1.25rem', gap: '0.75rem', fontSize: '0.85rem' }}>
                            <FileSpreadsheet size={20} /> EXCEL
                        </button>
                    </div>
                </div>
            </header>

            {/* --- CHANNEL SELECTOR --- */}
            <div style={{ marginBottom: '3rem', display: 'flex', gap: '1rem' }}>
                {[
                    { id: 'all', label: 'Global Sales', icon: Zap, color: 'var(--dark)' },
                    { id: 'online', label: 'Online Orders', icon: Smartphone, color: '#10b981' },
                    { id: 'offline', label: 'In-Store POS', icon: Store, color: '#3b82f6' }
                ].map(type => (
                    <button
                        key={type.id}
                        onClick={() => setSource(type.id)}
                        style={{
                            padding: '1.25rem 2.5rem',
                            borderRadius: '1.5rem',
                            background: source === type.id ? type.color : 'white',
                            color: source === type.id ? 'white' : '#64748b',
                            border: '2px solid',
                            borderColor: source === type.id ? type.color : '#f1f5f9',
                            fontWeight: 950,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            fontSize: '0.9rem'
                        }}
                    >
                        <type.icon size={20} />
                        {type.label.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* --- ANALYTICAL KPI GRID --- */}
            <div className="grid-responsive" style={{ '--grid-cols': 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
                {stats.map((stat, i) => (
                    <div key={i} className="premium-card" style={{ padding: '2.5rem', borderRadius: '2.5rem', animation: `animate-up ${0.4 + (i * 0.1)}s ease-out` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <div style={{ background: stat.color + '15', padding: '1rem', borderRadius: '1.25rem', color: stat.color }}>
                                <stat.icon size={28} />
                            </div>
                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 950, fontSize: '0.85rem' }}>
                                <ArrowUpRight size={14} /> {stat.growth}
                            </div>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, marginBottom: '0.5rem' }}>{stat.label}</p>
                        <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 950, letterSpacing: '-0.02em', color: 'var(--dark)' }}>{stat.value}</h1>
                    </div>
                ))}
            </div>

            {/* --- MAIN CHARTS --- */}
            <div className="grid-responsive" style={{ '--grid-cols': '2fr 1fr', gap: '2rem', marginBottom: '4rem' }}>
                {/* REVENUE TIMELINE */}
                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)' }}>Revenue Trajectory</h2>
                            <p style={{ color: '#94a3b8', margin: '0.25rem 0 0', fontWeight: 600 }}>Quantified sales volume for the <b>{source.toUpperCase()}</b> channel over the <b>{period.toUpperCase()}</b> window.</p>
                        </div>
                    </div>
                    <div style={{ height: '400px' }}>
                        <Line data={trendData} options={{
                            maintainAspectRatio: false,
                            plugins: { legend: { display: false } },
                            scales: {
                                y: { grid: { display: true, color: '#f1f5f9', borderDash: [5, 5] }, border: { display: false }, ticks: { font: { weight: 800, size: 11 }, color: '#94a3b8' } },
                                x: { grid: { display: false }, ticks: { font: { weight: 800, size: 11 }, color: '#94a3b8' } }
                            }
                        }} />
                    </div>
                </div>

                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem' }}>
                    <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '3rem' }}>Channel Contribution</h2>
                    <div style={{ height: '350px' }}>
                        <Pie 
                            data={sourceSplitData}
                            options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 30, font: { weight: 800 } } } } }}
                        />
                    </div>
                </div>

                {/* BAR CHART: TOP PRODUCTS */}
                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem' }}>
                    <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)', marginBottom: '3rem' }}>Product Revenue Chart</h2>
                    <div style={{ height: '350px' }}>
                        <Bar 
                            data={productSalesData} 
                            options={{
                                indexAxis: 'y',
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { grid: { display: false }, ticks: { font: { weight: 800, size: 10 } } },
                                    y: { grid: { display: false }, ticks: { font: { weight: 800, size: 10 } } }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>

            {/* --- DETAILED SALES LOG (NEW) --- */}
            <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem', marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)' }}>Itemized Sales Protocol (Detailed)</h2>
                    <span className="glass-pill" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>FULL LINE ITEMS</span>
                </div>
                <div className="scroll-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '900px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Date</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>InvoiceID</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Product Name</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', textAlign: 'center' }}>Qty</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', textAlign: 'right' }}>Price</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', textAlign: 'right' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.saleItems || []).map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: 950, color: 'var(--dark)' }}>#{item.invoice_id}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: 850 }}>{item.product_name}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'center', fontWeight: 950 }}>{item.quantity}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 800 }}>₹{Number(item.price).toFixed(2)}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 950, color: 'var(--primary)' }}>₹{Number(item.line_total).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- GRANULAR TABLES --- */}
            <div className="grid-responsive" style={{ '--grid-cols': '1fr 1fr', gap: '2rem' }}>
                {/* PRODUCT SALES REPORT */}
                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)' }}>Product Sales Inventory</h2>
                        <span className="glass-pill" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>FILTERED LOG</span>
                    </div>
                    <div className="scroll-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Product Identity</th>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Units</th>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Stock</th>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.topProducts || []).map((p, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.3s' }}>
                                        <td style={{ padding: '1.5rem 1.25rem', fontWeight: 950, fontSize: '1rem', color: 'var(--dark)' }}>{p.name}</td>
                                        <td style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 850, fontSize: '0.9rem', color: 'var(--dark)' }}>{p.total_qty}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 850, fontSize: '0.9rem', color: p.current_stock < 10 ? '#ef4444' : 'var(--dark)' }}>{p.current_stock}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.25rem', textAlign: 'right', fontWeight: 950, color: 'var(--primary)', fontSize: '1.05rem' }}>₹{Number(p.amount).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CUSTOMER REPORT */}
                <div className="premium-card" style={{ padding: '3.5rem', borderRadius: '3.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)' }}>Audience Engagement</h2>
                        <span className="glass-pill" style={{ color: '#3b82f6', fontSize: '0.65rem' }}>VIP IDENTITIES</span>
                    </div>
                    <div className="scroll-container" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '400px', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Subject</th>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', textAlign: 'center' }}>TRNS</th>
                                    <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', textAlign: 'right' }}>Total Val</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(data.topCustomers || []).map((c, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '1.5rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--dark)', color: 'white', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950, fontSize: '1rem' }}>{c.name.charAt(0)}</div>
                                            <div>
                                                <span style={{ fontWeight: 950, fontSize: '0.95rem', color: 'var(--dark)', display: 'block' }}>{c.name}</span>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>{c.phone}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
                                            <span style={{ fontWeight: 950, fontSize: '0.9rem', color: 'var(--dark)' }}>{c.order_count}</span>
                                        </td>
                                        <td style={{ padding: '1.5rem 1.25rem', textAlign: 'right', fontWeight: 950, color: '#3b82f6', fontSize: '1.05rem' }}>₹{Number(c.total_spent).toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* DETAILED TRANSACTION STREAM */}
            <div className="premium-card" style={{ padding: '3.5rem', marginTop: '2rem', borderRadius: '3.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ margin: 0, fontWeight: 950, fontSize: '1.5rem', color: 'var(--dark)' }}>Real-Time Transaction Stream</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <span className="glass-pill" style={{ color: 'var(--primary)', fontSize: '0.65rem' }}>LIVE LOGS</span>
                    </div>
                </div>
                <div className="scroll-container" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Timestamp</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Invoice ID</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Channel</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase' }}>Client Profile</th>
                                <th style={{ padding: '1.25rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 950, textTransform: 'uppercase', textAlign: 'right' }}>Settlement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.recentOrders || []).map((order, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '1.25rem', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>{new Date(order.created_at).toLocaleString()}</td>
                                    <td style={{ padding: '1.25rem', fontWeight: 950, color: 'var(--dark)' }}>#{order.invoice_id}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{ padding: '0.3rem 0.8rem', borderRadius: '0.6rem', background: order.user_id ? 'var(--primary-light)' : '#f1f5f9', color: order.user_id ? 'var(--primary)' : '#64748b', fontSize: '0.65rem', fontWeight: 950 }}>{order.user_id ? 'ONLINE' : 'OFFLINE'}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem', fontWeight: 850, color: 'var(--dark)' }}>{order.customer_name}</td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right', fontWeight: 950, color: 'var(--dark)' }}>₹{Number(order.final_amount).toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
