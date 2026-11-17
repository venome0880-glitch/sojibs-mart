import React, { useState } from 'react';
import { Upload, Save, CheckCircle, Flame, Image as ImageIcon, Link, Phone, Facebook, Globe, Sparkles, RefreshCw, Trash2 } from 'lucide-react';

export default function StoreSettings({
  config = {},
  adminToken,
  onSaveSettings,
  onPhotoUploaded
}) {
  const [shopName, setShopName] = useState(config.shopName || "Sojib's Mart");
  const [whatsappNumber, setWhatsappNumber] = useState(config.whatsappNumber || "880 01796017442");
  const [facebookPage, setFacebookPage] = useState(config.facebookPage || "https://www.facebook.com/profile.php?id=61595742304637");
  const [productPhotoUrl, setProductPhotoUrl] = useState(config.productPhotoUrl || "");
  const [logoImageUrl, setLogoImageUrl] = useState(config.logoImageUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(config.faviconUrl || "");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingField, setUploadingField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Photo Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('productPhoto', file);

    setIsUploading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setProductPhotoUrl(data.photoUrl);
      onPhotoUploaded(data.photoUrl);
      setSuccessMsg('Product photo uploaded successfully! Store page updated.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error uploading photo: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Logo or Favicon Upload
  const handleBrandingUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingField(field);
    try {
      const res = await fetch('/api/admin/upload-customizer-image', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (field === 'logo') {
        setLogoImageUrl(data.imageUrl);
      } else if (field === 'favicon') {
        setFaviconUrl(data.imageUrl);
      }
      setSuccessMsg(`${field === 'logo' ? 'Logo' : 'Favicon'} uploaded successfully! Click 'Save Settings' to apply.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Upload error: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');

    try {
      await onSaveSettings({
        shopName,
        whatsappNumber,
        facebookPage,
        productPhotoUrl,
        logoImageUrl,
        faviconUrl
      });
      setSuccessMsg('Store information and branding updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
          Store Settings & Product Photo
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
          Upload your product heater photo and manage WhatsApp and Facebook channel links.
        </p>
      </div>

      {successMsg && (
        <div style={{
          backgroundColor: '#f0fdf4',
          color: '#15803d',
          border: '1.5px solid #86efac',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 700
        }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Upload Product Photo Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={19} color="var(--color-primary)" />
          <span>Heater Product Photo (Glowing Red Coil)</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          Upload a high quality photo of your electric room heater. It will replace the default graphic on the storefront with pulsing glowing effects.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {productPhotoUrl ? (
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-primary)',
              overflow: 'hidden',
              backgroundColor: '#fafafa'
            }}>
              <img
                src={productPhotoUrl}
                alt="Uploaded heater"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-subtle)',
              fontSize: '0.8rem',
              textAlign: 'center',
              padding: '0.5rem'
            }}>
              <Flame size={32} color="var(--color-primary)" />
              <span>Default SVG Graphic Active</span>
            </div>
          )}

          <div>
            <label
              className="btn-primary hover-lift"
              style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.75rem 1.4rem' }}
            >
              <Upload size={16} />
              <span>{isUploading ? 'Uploading...' : 'Upload Product Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
            </label>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-subtle)', marginTop: '0.5rem' }}>
              Supports JPG, PNG, WEBP (Max 5MB).
            </div>
          </div>
        </div>
      </div>

      {/* 2. Logo & Favicon Branding Card */}
      <div style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        marginBottom: '2rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={19} color="var(--color-primary)" />
          <span>Store Logo & Browser Favicon</span>
        </h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
          Customize your store logo shown on the header and the favicon shown on browser tabs and bookmarks.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Logo Box */}
          <div style={{
            backgroundColor: '#fafafa',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Flame size={16} color="var(--color-primary)" />
              <span>Header Logo</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
              {logoImageUrl ? (
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #d4d4d8', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={logoImageUrl} alt="Store logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={24} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                  <Upload size={14} />
                  <span>{uploadingField === 'logo' ? 'Uploading...' : 'Upload Logo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleBrandingUpload(e, 'logo')}
                    style={{ display: 'none' }}
                  />
                </label>

                {logoImageUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoImageUrl('')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
                  >
                    Remove Logo
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              className="form-input"
              value={logoImageUrl}
              onChange={(e) => setLogoImageUrl(e.target.value)}
              placeholder="Or enter logo image URL..."
              style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}
            />
          </div>

          {/* Favicon Box */}
          <div style={{
            backgroundColor: '#fafafa',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem'
          }}>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <Globe size={16} color="var(--color-primary)" />
              <span>Browser Tab Favicon</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
              {faviconUrl ? (
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #d4d4d8', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={faviconUrl} alt="Favicon" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
              ) : logoImageUrl ? (
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #d4d4d8', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={logoImageUrl} alt="Favicon from logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
                </div>
              ) : (
                <div style={{ width: '56px', height: '56px', borderRadius: '10px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={24} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}>
                    <Upload size={14} />
                    <span>{uploadingField === 'favicon' ? 'Uploading...' : 'Upload Favicon'}</span>
                    <input
                      type="file"
                      accept=".ico,.png,.svg,.jpg,.webp,image/*"
                      onChange={(e) => handleBrandingUpload(e, 'favicon')}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {logoImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFaviconUrl(logoImageUrl)}
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                    >
                      Use Logo
                    </button>
                  )}
                </div>

                {faviconUrl && (
                  <button
                    type="button"
                    onClick={() => setFaviconUrl('')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-danger)', fontSize: '0.78rem', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
                  >
                    Reset Favicon
                  </button>
                )}
              </div>
            </div>

            <input
              type="text"
              className="form-input"
              value={faviconUrl}
              onChange={(e) => setFaviconUrl(e.target.value)}
              placeholder="Or enter favicon URL (.ico, .png)..."
              style={{ fontSize: '0.8rem', fontFamily: 'monospace' }}
            />
          </div>
        </div>
      </div>

      {/* 3. Shop Info & Links */}
      <form onSubmit={handleSaveInfo} style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Contact Channels & Shop Details
        </h3>

        <div className="form-group">
          <label className="form-label">
            Shop Name
          </label>
          <input
            type="text"
            className="form-input"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Phone size={14} color="#15803d" />
            <span>WhatsApp Business Number</span>
          </label>
          <input
            type="text"
            className="form-input"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="e.g. 880 01796017442"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Facebook size={14} color="#1d4ed8" />
            <span>Facebook Page URL</span>
          </label>
          <input
            type="url"
            className="form-input"
            value={facebookPage}
            onChange={(e) => setFacebookPage(e.target.value)}
            placeholder="https://www.facebook.com/..."
            required
          />
        </div>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary hover-lift"
            style={{ padding: '0.75rem 1.6rem' }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
