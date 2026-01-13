import React, { useState, useEffect } from 'react';
import { FaCertificate, FaSignature, FaSave, FaImage } from 'react-icons/fa';
import '../../styles/Dashboard.css';

const CertificateConfig = () => {
    const [config, setConfig] = useState({
        templateUrl: '',
        signatureUrl: '',
        authorityName: 'Director of Education',
        issuerName: 'Shnoor LMS'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            setTimeout(() => {
                setConfig({
                    templateUrl: 'https://example.com/cert-template.png',
                    signatureUrl: 'https://example.com/signature.png',
                    authorityName: 'Director of Education',
                    issuerName: 'Shnoor LMS'
                });
                setLoading(false);
            }, 800);
        } catch (error) {
            console.error("Error fetching config:", error);
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            alert("Certificate configuration saved successfully!");
        } catch (error) {
            console.error("Error saving config:", error);
            alert("Failed to save configuration.");
        }
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <div className="form-box" style={{ maxWidth: '800px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="icon-circle yellow" style={{ margin: '0 auto 15px', width: '50px', height: '50px' }}><FaCertificate size={24} /></div>
                    <h2 className="form-header" style={{ border: 'none', padding: 0 }}>Certificate Configuration</h2>
                    <p style={{ color: '#6b7280' }}>Customize the certificates issued to students.</p>
                </div>

                <form onSubmit={handleSave}>
                    <div className="grid-2">
                        <div className="full-width form-group">
                            <label>Issuer Name</label>
                            <input
                                value={config.issuerName}
                                onChange={e => setConfig({ ...config, issuerName: e.target.value })}
                                placeholder="e.g. Shnoor Academy"
                            />
                        </div>

                        <div className="full-width form-group">
                            <label>Signing Authority Title</label>
                            <input
                                value={config.authorityName}
                                onChange={e => setConfig({ ...config, authorityName: e.target.value })}
                                placeholder="e.g. Program Director"
                            />
                        </div>

                        <div className="full-width form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaImage /> Background Template URL</label>
                            <input
                                value={config.templateUrl}
                                onChange={e => setConfig({ ...config, templateUrl: e.target.value })}
                                placeholder="https://example.com/cert-bg.png"
                            />
                            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '5px' }}>
                                Provide a direct link to an image. This will be used as the background.
                            </p>
                        </div>

                        <div className="full-width form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FaSignature /> Signature Image URL</label>
                            <input
                                value={config.signatureUrl}
                                onChange={e => setConfig({ ...config, signatureUrl: e.target.value })}
                                placeholder="https://example.com/signature.png"
                            />
                        </div>
                    </div>

                    <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', marginTop: '20px', textAlign: 'center' }}>
                        <h4>Preview</h4>
                        <div style={{
                            width: '100%', maxWidth: '400px', height: '250px', margin: '0 auto',
                            border: '4px solid #003366', position: 'relative', background: '#fff'
                        }}>
                            {config.templateUrl && <img src={config.templateUrl} alt="Bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3 }} />}
                            <div style={{ position: 'relative', zIndex: 1, padding: '20px' }}>
                                <h3 style={{ fontFamily: 'serif', marginTop: '40px' }}>Certificate of Completion</h3>
                                <p>Awarded to <strong>Student Name</strong></p>
                                <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    {config.signatureUrl ? <img src={config.signatureUrl} alt="Sign" style={{ height: '40px' }} /> : <span style={{ fontFamily: 'cursive' }}>Signature</span>}
                                    <div style={{ borderTop: '1px solid #000', width: '100px', margin: '5px 0' }}></div>
                                    <small>{config.authorityName}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="full-width form-actions" style={{ justifyContent: 'flex-end', marginTop: '30px' }}>
                        <button type="submit" className="btn-primary"><FaSave /> Save Configuration</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificateConfig;
