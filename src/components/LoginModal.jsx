import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('murat');
  const [password, setPassword] = useState('garanti123');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await onLogin(username, password);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
    }
  };

  const setPreset = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: 'rgba(0,153,68,0.15)',
            border: '2px solid #009944',
            color: '#00c853',
            marginBottom: 12
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Garanti BBVA İnternet</h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Giriş yapmak için bilgilerinizi giriniz</p>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239,68,68,0.15)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.85rem',
            marginBottom: 16
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı / TC No / Müşteri No</label>
            <input
              type="text"
              required
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              required
              className="form-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12, padding: 12 }}>
            Sisteme Giriş Yap
          </button>
        </form>

        {/* Quick Test Presets */}
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #1e2d3b', textAlign: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 10, textTransform: 'uppercase', fontWeight: 600 }}>Hızlı Test Girişleri:</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              className="btn btn-secondary"
              onClick={() => setPreset('murat', 'garanti123')}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              👤 Müşteri (murat)
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setPreset('admin', 'admin123')}
              style={{ fontSize: '0.78rem', padding: '6px 12px' }}
            >
              👑 Yönetici (admin)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
