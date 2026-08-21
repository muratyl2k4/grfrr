import React from 'react';
import { User, LogOut, ShieldCheck } from 'lucide-react';

export default function Navbar({ currentUser, customer, onLogout }) {
  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo & Profile Avatar: EKMEK TEKNESİ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div 
            onClick={onLogout}
            title="Giriş Ekranına Dön / Kullanıcı Değiştir"
            style={{
              background: 'linear-gradient(135deg, #009944 0%, #007735 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.25rem',
              padding: '8px 18px',
              borderRadius: 10,
              letterSpacing: 0.5,
              boxShadow: '0 4px 12px rgba(0, 153, 68, 0.25)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <User size={20} />
            EKMEK TEKNESİ
          </div>
        </div>


        {/* Logged in User Profile Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {currentUser && currentUser.is_superuser && (
            <span style={{
              backgroundColor: '#fef9c3',
              color: '#854d0e',
              border: '1px solid #fef08a',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <ShieldCheck size={14} /> YÖNETİCİ (ADMIN)
            </span>
          )}

          {customer && (
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '6px 14px',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <User size={16} color="#009944" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{customer.full_name}</span>
            </div>
          )}

          <button className="btn btn-secondary" onClick={onLogout}>
            <LogOut size={16} /> Çıkış Yap
          </button>
        </div>
      </div>
    </nav>
  );
}
