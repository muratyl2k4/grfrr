import React, { useState } from 'react';
import { Search, Plus, FileText, Edit2, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export default function TransactionTable({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onDownloadReceipt
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, IN, OUT

  const filtered = transactions.filter(tx => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      (tx.title || '').toLowerCase().includes(term) ||
      (tx.description || '').toLowerCase().includes(term) ||
      (tx.receiver_name || '').toLowerCase().includes(term) ||
      (tx.receiver_iban || '').toLowerCase().includes(term) ||
      (tx.fast_ref_no || '').toLowerCase().includes(term);

    if (!matchSearch) return false;
    if (filterType === 'IN') return tx.is_credit;
    if (filterType === 'OUT') return !tx.is_credit;
    return true;
  });

  return (
    <div className="card">
      {/* Top Header & Search Controls */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Hesap Hareketleri</h3>
          <span style={{
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            padding: '3px 10px',
            borderRadius: 12,
            fontSize: '0.8rem',
            fontWeight: 700
          }}>
            {filtered.length} Kayıt
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              className="form-input"
              placeholder="İşlem veya alacaklı ara..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ paddingLeft: 36, width: '100%' }}
            />
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: 8, padding: 3, border: '1px solid #e2e8f0' }}>
            <button
              className="btn"
              onClick={() => setFilterType('ALL')}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                backgroundColor: filterType === 'ALL' ? '#009944' : 'transparent',
                color: filterType === 'ALL' ? '#fff' : '#64748b',
                borderRadius: 6
              }}
            >
              Tümü
            </button>
            <button
              className="btn"
              onClick={() => setFilterType('IN')}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                backgroundColor: filterType === 'IN' ? '#16a34a' : 'transparent',
                color: filterType === 'IN' ? '#fff' : '#64748b',
                borderRadius: 6
              }}
            >
              Gelen (+)
            </button>
            <button
              className="btn"
              onClick={() => setFilterType('OUT')}
              style={{
                padding: '6px 14px',
                fontSize: '0.8rem',
                backgroundColor: filterType === 'OUT' ? '#dc2626' : 'transparent',
                color: filterType === 'OUT' ? '#fff' : '#64748b',
                borderRadius: 6
              }}
            >
              Giden (-)
            </button>
          </div>

          {/* Add Transaction Button */}
          <button className="btn btn-primary" onClick={onAddTransaction}>
            <Plus size={18} /> ➕ Yeni İşlem Ekle
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.75rem' }}>
              <th style={{ padding: '12px 10px' }}>Tarih / Saat</th>
              <th style={{ padding: '12px 10px' }}>Açıklama (Başlık)</th>
              <th style={{ padding: '12px 10px' }}>Alacaklı / Taraf</th>
              <th style={{ padding: '12px 10px' }}>Etiket</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Tutar</th>
              <th style={{ padding: '12px 10px', textAlign: 'right' }}>Bakiye</th>
              <th style={{ padding: '12px 10px', textAlign: 'center' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  Aramanızla eşleşen işlem bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((tx, idx) => {

                const isKesinti =
                  tx.parent_transaction != null ||
                  (tx.description || '').startsWith('KESİNTİ') ||
                  (tx.tag || '') === 'Faiz / Komisyon' ||
                  (tx.receiver_name || '').startsWith('KESİNTİ');

                return (
                  <tr
                    key={tx.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: idx % 2 === 1 ? '#f8fafc' : '#ffffff',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td style={{ padding: '14px 10px', whiteSpace: 'nowrap', color: '#334155' }}>
                      <div style={{ fontWeight: 600 }}>{tx.transaction_date}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{tx.transaction_time}</div>
                    </td>

                    <td style={{ padding: '14px 10px', maxWidth: 280, fontWeight: 600, color: '#0f172a' }}>
                      {tx.title || tx.description}
                    </td>

                    <td style={{ padding: '14px 10px', color: '#334155' }}>
                      <div style={{ fontWeight: 600 }}>{tx.receiver_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>{tx.receiver_iban}</div>
                    </td>

                    <td style={{ padding: '14px 10px' }}>
                      <span style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {tx.tag || 'Para Transferi'}
                      </span>
                    </td>

                    <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 700, fontSize: '0.95rem' }}>
                      <span style={{
                        color: tx.is_credit ? '#16a34a' : '#dc2626',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {tx.is_credit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                        {tx.formatted_amount}
                      </span>
                    </td>

                    <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>
                      {tx.formatted_balance_after}
                    </td>

                    <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {!isKesinti && (
                          <button
                            className="btn btn-outline-green"
                            title="Vektör PDF Dekont İndir"
                            onClick={() => onDownloadReceipt(tx.id)}
                            style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          >
                            <FileText size={14} /> Dekont
                          </button>
                        )}

                        {!isKesinti && (
                          <button
                            className="btn btn-secondary"
                            title="İşlemi Düzenle"
                            onClick={() => onEditTransaction(tx)}
                            style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          >
                            <Edit2 size={14} />
                          </button>
                        )}

                        {!isKesinti && (
                          <button
                            className="btn btn-danger"
                            title="İşlemi Sil"
                            onClick={() => onDeleteTransaction(tx.id)}
                            style={{ padding: '5px 9px', fontSize: '0.78rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
