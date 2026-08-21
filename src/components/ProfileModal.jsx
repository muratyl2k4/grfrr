import React, { useState, useEffect } from 'react';
import { X, Camera, User, Check, Building, CreditCard, Hash, MapPin } from 'lucide-react';

export default function ProfileModal({ isOpen, onClose, customer, onSaveProfile }) {
  const [fullName, setFullName] = useState('');
  const [customerNo, setCustomerNo] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [iban, setIban] = useState('');
  const [address, setAddress] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFullName(customer.full_name || '');
      setCustomerNo(customer.customer_no || '');
      setTcNo(customer.tc_no || '');
      setBranchName(customer.branch_name || '');
      setAccountNo(customer.account_no || '');
      setIban(customer.iban || '');
      setAddress(customer.address || '');
      setPhotoPreview(customer.profile_photo || '');
      setPhotoFile(null);
    }
  }, [customer, isOpen]);

  if (!isOpen || !customer) return null;

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('customer_no', customerNo);
      formData.append('tc_no', tcNo);
      formData.append('branch_name', branchName);
      formData.append('account_no', accountNo);
      formData.append('iban', iban);
      formData.append('address', address);

      if (photoFile) {
        formData.append('profile_photo', photoFile);
      }

      await onSaveProfile(customer.id, formData);
      onClose();
    } catch (err) {
      alert('Profil güncellenirken hata oluştu: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        maxWidth: 620,
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid #e2e8f0'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f8fafc',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <User size={22} color="#009944" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Profil Düzenle
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: 4,
              borderRadius: 8,
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {/* Profile Photo Uploader Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 24,
            padding: 16,
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            border: '1px dashed #cbd5e1'
          }}>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <div style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                backgroundColor: '#e2e8f0',
                border: '3px solid #009944',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Profil Fotoğrafı"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <User size={48} color="#64748b" />
                )}
              </div>
              <label htmlFor="profile-photo-input" style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#009944',
                color: '#fff',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                border: '2px solid #fff'
              }}>
                <Camera size={16} />
              </label>
              <input
                id="profile-photo-input"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
              Profil Fotoğrafını Değiştir
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
              (PNG, JPG veya WEBP)
            </span>
          </div>

          {/* Input Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {/* Ad Soyad */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                AD SOYAD / UNVAN
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Müşteri No */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                MÜŞTERİ NO
              </label>
              <input
                type="text"
                value={customerNo}
                onChange={(e) => setCustomerNo(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* TC Kimlik No */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                TC KİMLİK NO
              </label>
              <input
                type="text"
                value={tcNo}
                onChange={(e) => setTcNo(e.target.value)}
                maxLength={11}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Şube İsmi */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                ŞUBE İSMİ
              </label>
              <input
                type="text"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Hesap No */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                HESAP NO (Örn: 480 6638248)
              </label>
              <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* IBAN */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                IBAN NUMARASI
              </label>
              <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Adres */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                ADRES (Dekont ve Hesap Özetlerinde Çıkar)
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
            marginTop: 24,
            paddingTop: 16,
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#fff',
                color: '#64748b',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 24px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: '#009944',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 153, 68, 0.25)'
              }}
            >
              <Check size={18} />
              {submitting ? 'Kaydediliyor...' : 'Profili Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
