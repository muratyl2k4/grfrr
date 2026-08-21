import React, { useState } from 'react';
import { User, Download, Edit3 } from 'lucide-react';

export default function CustomerCard({ customer, onDownloadStatement, onEditProfile }) {
  const [period, setPeriod] = useState('all');

  if (!customer) return null;

  const formattedBalance = parseFloat(customer.current_balance || 0).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + ' TL';

  return (
    <div className="card" style={{ marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 28 }}>
        {/* Left Customer Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 153, 68, 0.1)',
              border: '3px solid #009944',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#009944',
              overflow: 'hidden',
              flexShrink: 0
            }}>
              {customer.profile_photo ? (
                <img
                  src={customer.profile_photo}
                  alt={customer.full_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={38} />
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{customer.full_name}</h2>
                <button
                  onClick={onEditProfile}
                  title="Profili Düzenle"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 8,
                    border: '1.5px solid #009944',
                    backgroundColor: 'rgba(0, 153, 68, 0.08)',
                    color: '#009944',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Edit3 size={15} />
                  Profili Düzenle
                </button>
              </div>
              <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, marginTop: 4, display: 'block' }}>
                Garanti BBVA Müşterisi ({customer.customer_no}) • {customer.branch_name} Şubesi
              </span>
            </div>
          </div>

          <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '0.85rem', color: '#475569' }}>
            <div><strong>TC No:</strong> {customer.tc_no}</div>
            <div><strong>Hesap No:</strong> {customer.account_no}</div>
            <div style={{ gridColumn: 'span 2' }}><strong>IBAN:</strong> {customer.iban}</div>
          </div>
        </div>

        {/* Right Balance Banner & Action */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 14,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)'
        }}>
          <div>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }}>
              KULLANILABİLİR BAKİYE
            </span>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#009944', margin: '6px 0 14px 0', letterSpacing: -0.5 }}>
              {formattedBalance}
            </div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
              * Tüm giden ve gelen hareketler kronolojik olarak anlık hesaplanır.
            </p>
          </div>

          {/* Period Selector Dropdown & Download Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                border: '1.5px solid #2563eb',
                fontSize: '0.95rem',
                fontWeight: 600,
                backgroundColor: '#fff',
                color: '#0f172a',
                cursor: 'pointer',
                outline: 'none',
                minWidth: 140,
                boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)'
              }}
            >
              <option value="all">Tümü</option>
              <option value="1">Son 1 Gün</option>
              <option value="7">Son 1 Hafta</option>
              <option value="30">Son 1 Ay</option>
            </select>

            <button
              onClick={() => onDownloadStatement(period)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#fff',
                color: '#0f172a',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                flex: 1
              }}
            >
              <Download size={18} color="#0f172a" />
              Hesap Hareketi Çıkar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
