import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FaTrophy, FaCertificate, FaLock, FaDownload, FaShareAlt, FaPrint } from 'react-icons/fa';
import { auth } from '../../auth/firebase';
import '../../styles/Dashboard.css';

const MyCertificates = () => {
    const { studentName, xp } = useOutletContext();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        const fetchCertificates = async () => {
            if (!auth.currentUser) return;
            try {
                setTimeout(() => {
                    const mockCerts = [
                        {
                            id: 'c1',
                            course: 'Introduction to React',
                            date: new Date().toLocaleDateString(),
                            score: 95,
                            status: 'Unlocked',
                            previewColor: '#003366'
                        },
                        {
                            id: 'c2',
                            course: 'Advanced JavaScript',
                            date: new Date().toLocaleDateString(),
                            score: 88,
                            status: 'Unlocked',
                            previewColor: '#059669'
                        }
                    ];
                    setCertificates(mockCerts);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Error fetching certificates:", error);
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return <div className="p-8">Loading achievements...</div>;

    if (selectedCert) {
        return (
            <div className="certificate-view-container">
                <style>{`
                    @media print {
                        .sidebar, .top-bar, .no-print { display: none !important; }
                        .dashboard-container { display: block !important; margin: 0 !important; padding: 0 !important; }
                        .main-content { margin: 0 !important; padding: 0 !important; }
                        .certificate-paper { box-shadow: none !important; border: none !important; width: 100% !important; height: 100vh !important; }
                    }
                `}</style>
                <div className="no-print" style={{ marginBottom: '20px' }}>
                    <button onClick={() => setSelectedCert(null)} className="btn-secondary" style={{ marginRight: '10px' }}>Back</button>
                    <button onClick={handlePrint} className="btn-primary"><FaPrint /> Print / Download PDF</button>
                </div>

                <div className="certificate-paper" style={{
                    width: '800px', height: '600px', padding: '40px', background: '#fff',
                    border: '10px double #003366', margin: 'auto', textAlign: 'center', position: 'relative',
                    fontFamily: 'Georgia, serif', color: '#1f2937'
                }}>
                    <div style={{ border: '2px solid #003366', height: '100%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <h1 style={{ fontSize: '3rem', color: '#003366', marginBottom: '10px', textTransform: 'uppercase' }}>Certificate</h1>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'normal', color: '#374151', marginBottom: '30px' }}>of Achievement</h2>

                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>This is to certify that</p>
                        <h3 style={{ fontSize: '2.5rem', borderBottom: '2px solid #ccc', paddingBottom: '10px', marginBottom: '20px', minWidth: '400px' }}>
                            {studentName}
                        </h3>

                        <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>has successfully completed the course</p>
                        <h3 style={{ fontSize: '2rem', color: '#003366', marginBottom: '40px' }}>{selectedCert.course}</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '80%', marginTop: '50px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ borderTop: '1px solid #000', paddingTop: '5px', width: '200px', margin: '0 auto' }}>Date: {selectedCert.date}</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <img src="https://via.placeholder.com/100x50?text=NASCOM" alt="Logo" style={{ opacity: 0.5 }} />
                                <p style={{ fontSize: '0.8rem', marginTop: '5px' }}>NASCOM Certified</p>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ borderTop: '1px solid #000', paddingTop: '5px', width: '200px', margin: '0 auto' }}>Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="student-page-header">
                <h3>My Achievements</h3>
                <div style={{ background: '#fef3c7', padding: '8px 16px', borderRadius: '20px', color: '#b45309', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaTrophy /> {xp} XP Earned
                </div>
            </div>

            <h4 style={{ margin: '0 0 15px 0', color: '#374151' }}>Course Certificates</h4>

            {certificates.length === 0 ? (
                <p style={{ color: '#6b7280' }}>You haven't earned any certificates yet. Complete a course to get certified!</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                    {certificates.map(cert => (
                        <div key={cert.id} style={{ background: 'white', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            <div style={{
                                height: '180px',
                                background: cert.previewColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <div style={{ textAlign: 'center', color: 'white' }}>
                                    <FaCertificate size={50} style={{ marginBottom: '10px', color: '#fbbf24' }} />
                                    <div style={{ fontFamily: 'serif', fontSize: '1.2rem', letterSpacing: '1px' }}>CERTIFICATE</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>View Details</div>
                                </div>
                            </div>

                            <div style={{ padding: '20px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#111827' }}>{cert.course}</h4>
                                <p style={{ margin: '0 0 15px 0', fontSize: '0.85rem', color: '#6b7280' }}>
                                    Issued on {cert.date}
                                </p>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                                        onClick={() => setSelectedCert(cert)}
                                    >
                                        <FaDownload /> View / Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCertificates;
