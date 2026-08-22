import React, { useState, useEffect } from 'react';
import { X, Save, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function TransactionModal({ isOpen, onClose, onSave, editingTransaction, customerId }) {
  const [formData, setFormData] = useState({
    customer: customerId || 1,
    transaction_type: 'HESAPTAN FAST',
    fast_ref_no: '',
    receiver_name: '',
    receiver_branch: 'HÜRRİYET',
    receiver_account_no: '00667 / 6605251',
    receiver_iban: '',
    commission: '7.97',
    bsmv: '0.40',
    amount: '',
    is_credit: false,
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_time: '23:08:50',
    amount_in_words: '',
    description: '',
    tag: 'Para Transferi'
  });

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        customer: editingTransaction.customer || customerId || 1,
        transaction_type: editingTransaction.transaction_type || 'HESAPTAN FAST',
        receiver_branch: editingTransaction.receiver_branch || 'HÜRRİYET',
        receiver_account_no: editingTransaction.receiver_account_no || '00667 / 6605251'
      });
    } else {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const defaultRef = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      setFormData({
        customer: customerId || 1,
        transaction_type: 'HESAPTAN FAST',
        fast_ref_no: defaultRef,
        receiver_name: '',
        receiver_branch: 'HÜRRİYET',
        receiver_account_no: '00667 / 6605251',
        receiver_iban: 'TR',
        commission: '7.97',
        bsmv: '0.40',
        amount: '',
        is_credit: false,
        transaction_date: now.toISOString().split('T')[0],
        transaction_time: timeStr,
        amount_in_words: '',
        description: `FAST-CEP ŞUBE-${defaultRef}`,
        tag: 'Para Transferi'
      });
    }
  }, [editingTransaction, customerId, isOpen]);

  // Handle transaction_type switch
  const handleTypeChange = (typeVal) => {
    const isHavale = typeVal === 'HESAPTAN HESABA HAVALE';
    const recUpper = formData.receiver_name.toUpperCase();
    const newCommission = isHavale ? '3.99' : '7.97';
    const newBsmv = isHavale ? '0.20' : '0.40';
    const newDesc = isHavale
      ? (recUpper ? `${recUpper}-HVL-CEP ŞUBE` : 'HVL-CEP ŞUBE')
      : (recUpper ? `${recUpper}-FAST-CEP ŞUBE-${formData.fast_ref_no}` : `FAST-CEP ŞUBE-${formData.fast_ref_no}`);

    setFormData(prev => ({
      ...prev,
      transaction_type: typeVal,
      commission: newCommission,
      bsmv: newBsmv,
      description: newDesc
    }));
  };

  // Auto-format description when receiver_name or fast_ref_no changes
  const handleReceiverNameChange = (val) => {
    const uppercaseVal = val.toUpperCase();
    const isHavale = formData.transaction_type === 'HESAPTAN HESABA HAVALE';
    const autoDesc = isHavale
      ? (uppercaseVal ? `${uppercaseVal}-HVL-CEP ŞUBE` : 'HVL-CEP ŞUBE')
      : (uppercaseVal ? `${uppercaseVal}-FAST-CEP ŞUBE-${formData.fast_ref_no}` : `FAST-CEP ŞUBE-${formData.fast_ref_no}`);

    setFormData(prev => ({
      ...prev,
      receiver_name: val,
      description: autoDesc
    }));
  };


  const handleRefNoChange = (val) => {
    const namePart = formData.receiver_name ? formData.receiver_name.toUpperCase() : '';
    const autoDesc = namePart ? `${namePart}-FAST-CEP ŞUBE-${val}` : `FAST-CEP ŞUBE-${val}`;
    setFormData(prev => ({
      ...prev,
      fast_ref_no: val,
      description: autoDesc
    }));
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Final check for description auto-format
    let finalDesc = formData.description;
    if (!finalDesc || !finalDesc.includes('FAST-CEP ŞUBE')) {
      const namePart = formData.receiver_name ? formData.receiver_name.trim().toUpperCase() : 'ALICI';
      finalDesc = `${namePart}-FAST-CEP ŞUBE-${formData.fast_ref_no}`;
    }
    onSave({
      ...formData,
      description: finalDesc
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
            {editingTransaction ? '✏️ İşlem Düzenle' : '➕ Yeni İşlem Ekle'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* İşlem Türü Selection */}
          <div className="form-group">
            <label className="form-label">İşlem Türü</label>
            <select
              className="form-select"
              value={formData.transaction_type}
              onChange={e => handleTypeChange(e.target.value)}
              style={{ fontWeight: 700 }}
            >
              <option value="HESAPTAN FAST">HESAPTAN FAST (Başka Bankaya Transfer / FAST)</option>
              <option value="HESAPTAN HESABA HAVALE">HESAPTAN HESABA HAVALE (Garantiden Garantiye)</option>
            </select>
          </div>

          {/* Direction Toggle */}
          <div className="form-group">
            <label className="form-label">İşlem Yönü</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                type="button"
                className="btn"
                onClick={() => setFormData({ ...formData, is_credit: false })}
                style={{
                  backgroundColor: !formData.is_credit ? 'rgba(239, 68, 68, 0.2)' : '#121c24',
                  color: !formData.is_credit ? '#f87171' : '#94a3b8',
                  border: !formData.is_credit ? '1px solid #ef4444' : '1px solid #1e2d3b'
                }}
              >
                <ArrowUpRight size={16} /> Giden Para (-)
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => setFormData({ ...formData, is_credit: true })}
                style={{
                  backgroundColor: formData.is_credit ? 'rgba(16, 185, 129, 0.2)' : '#121c24',
                  color: formData.is_credit ? '#34d399' : '#94a3b8',
                  border: formData.is_credit ? '1px solid #10b981' : '1px solid #1e2d3b'
                }}
              >
                <ArrowDownLeft size={16} /> Gelen Para (+)
              </button>
            </div>
          </div>

          {/* Extra Havale Fields */}
          {formData.transaction_type === 'HESAPTAN HESABA HAVALE' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Alacaklı Şube</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Örn: HÜRRİYET"
                  value={formData.receiver_branch}
                  onChange={e => setFormData({ ...formData, receiver_branch: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Alacaklı Hesap No</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Örn: 00667 / 6605251"
                  value={formData.receiver_account_no}
                  onChange={e => setFormData({ ...formData, receiver_account_no: e.target.value })}
                />
              </div>
            </div>
          )}


          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Alacaklı Ad Soyad</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="Örn: MUSTAFA EMRE DAVAZ"
                value={formData.receiver_name}
                onChange={e => handleReceiverNameChange(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tutar (TL)</label>
              <input
                type="number"
                step="0.01"
                required
                className="form-input"
                placeholder="Örn: 2500.00"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alacaklı IBAN</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="TR56 0006 2000 1122 3344 5566 77"
              value={formData.receiver_iban}
              onChange={e => setFormData({ ...formData, receiver_iban: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Açıklama (Otomatik Oluşturulur: ALICI-FAST-CEP ŞUBE-NO)</label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="MUSTAFA EMRE DAVAZ-FAST-CEP ŞUBE-7105994370"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Komisyon (TL)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.commission}
                onChange={e => setFormData({ ...formData, commission: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">BSMV (TL)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={formData.bsmv}
                onChange={e => setFormData({ ...formData, bsmv: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Etiket</label>
              <select
                className="form-select"
                value={formData.tag}
                onChange={e => setFormData({ ...formData, tag: e.target.value })}
              >
                <option value="Para Transferi">Para Transferi</option>
                <option value="Faiz / Komisyon">Faiz / Komisyon</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">İşlem Tarihi</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.transaction_date}
                onChange={e => setFormData({ ...formData, transaction_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">İşlem Saati (Saniye dahil)</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="23:08:50"
                value={formData.transaction_time}
                onChange={e => setFormData({ ...formData, transaction_time: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">FAST Ref No</label>
              <input
                type="text"
                className="form-input"
                placeholder="7105994370"
                value={formData.fast_ref_no}
                onChange={e => handleRefNoChange(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">İşlem Türü</label>
              <input
                type="text"
                className="form-input"
                value={formData.transaction_type}
                onChange={e => setFormData({ ...formData, transaction_type: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
