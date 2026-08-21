import React, { useState } from 'react';
import { Lock, UserCheck, Shield } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setErrorMsg(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol ediniz.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f4f6f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 20,
        width: '100%',
        maxWidth: 440,
        padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
        textAlign: 'center'
      }}>
        {/* Brand Logo Header */}
        <div style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #009944 0%, #007735 100%)',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '1.4rem',
          padding: '10px 24px',
          borderRadius: 12,
          letterSpacing: 0.5,
          marginBottom: 16,
          boxShadow: '0 6px 16px rgba(0, 153, 68, 0.25)'
        }}>
          EKMEK TEKNESİ
        </div>

        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
          Sisteme Giriş Yapın
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: 24 }}>
          Devam etmek için kullanıcı bilgilerinizi giriniz.
        </p>

        {errorMsg && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.85rem',
            marginBottom: 20,
            textAlign: 'left'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı / TC No / Müşteri No</label>
            <input
              type="text"
              required
              className="form-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Kullanıcı adı giriniz"
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
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: '100%', marginTop: 12, padding: 13, fontSize: '0.95rem' }}
          >
            {submitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </div>
  );
}

