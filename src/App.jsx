import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerCard from './components/CustomerCard';
import TransactionTable from './components/TransactionTable';
import TransactionModal from './components/TransactionModal';
import ProfileModal from './components/ProfileModal';
import LoginScreen from './components/LoginScreen';

const API_BASE = 'https://2121kralbenim.pythonanywhere.com/api';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check saved session token on load (1-week validity)
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('garanti_auth');
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        const now = Date.now();
        if (parsed.timestamp && (now - parsed.timestamp) < ONE_WEEK_MS) {
          setCurrentUser(parsed.user);
          if (parsed.customer) {
            setCustomer(parsed.customer);
            fetchInitialData(parsed.customer);
          } else {
            fetchInitialData();
          }
        } else {
          // Token expired (> 1 week)
          localStorage.removeItem('garanti_auth');
        }
      }
    } catch (e) {
      console.error('Error reading saved session:', e);
    }
  }, []);

  const fetchInitialData = async (targetCustomer = null) => {
    setLoading(true);
    try {
      let custObj = targetCustomer || customer;
      
      if (!custObj) {
        const custsRes = await fetch(`${API_BASE}/customers/`);
        if (custsRes.ok) {
          const custsData = await custsRes.json();
          if (custsData.length > 0) {
            custObj = custsData[0];
            setCustomer(custObj);
          }
        }
      }

      const targetCustId = custObj ? custObj.id : 1;

      // 1. Fetch Customer Profile
      const custRes = await fetch(`${API_BASE}/customers/${targetCustId}/`);
      if (custRes.ok) {
        const custData = await custRes.json();
        setCustomer(custData);
      }

      // 2. Fetch Transactions for Customer (Limit memory to last 1 week: &days=7)
      const txRes = await fetch(`${API_BASE}/transactions/?customer=${targetCustId}&days=7`);
      if (txRes.ok) {
        const txData = await txRes.json();
        setTransactions(txData);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    const res = await fetch(`${API_BASE}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setCurrentUser(data.user);
      
      // Save 1-week session token to localStorage
      localStorage.setItem('garanti_auth', JSON.stringify({
        user: data.user,
        customer: data.customer,
        token: data.token,
        timestamp: Date.now()
      }));

      if (data.customer) {
        setCustomer(data.customer);
        await fetchInitialData(data.customer);
      } else {
        await fetchInitialData();
      }
    } else {
      throw new Error(data.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol ediniz.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('garanti_auth');
    setCurrentUser(null);
    setCustomer(null);
    setTransactions([]);
  };

  // Add or Update Transaction
  const handleSaveTransaction = async (formData) => {
    try {
      let res;
      if (editingTx && editingTx.id) {
        res = await fetch(`${API_BASE}/transactions/${editingTx.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } else {
        res = await fetch(`${API_BASE}/transactions/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      }

      if (res.ok) {
        setIsTxModalOpen(false);
        setEditingTx(null);
        await fetchInitialData();
      } else {
        const errData = await res.json();
        alert('İşlem kaydedilemedi: ' + JSON.stringify(errData));
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  // Save Customer Profile & Photo
  const handleSaveProfile = async (customerId, formData) => {
    try {
      const res = await fetch(`${API_BASE}/customers/${customerId}/`, {
        method: 'PATCH',
        body: formData // Multipart FormData handles text & image upload automatically
      });

      if (res.ok) {
        const updatedCustomer = await res.json();
        setCustomer(updatedCustomer);
        await fetchInitialData(updatedCustomer);
      } else {
        const errData = await res.json();
        alert('Profil güncellenemedi: ' + JSON.stringify(errData));
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  // Delete Transaction
  const handleDeleteTransaction = async (txId) => {
    if (!window.confirm('Bu işlemi silmek istediğinizden emin misiniz? Bakiye otomatik yeniden hesaplanacaktır.')) return;
    try {
      const res = await fetch(`${API_BASE}/transactions/${txId}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchInitialData();
      } else {
        alert('İşlem silinemedi.');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  // Download Receipt PDF
  const handleDownloadReceipt = (txId) => {
    window.open(`${API_BASE}/transactions/${txId}/receipt/`, '_blank');
  };

  // Download Statement PDF
  const handleDownloadStatement = (period = 'all') => {
    if (customer && customer.id) {
      window.open(`${API_BASE}/customers/${customer.id}/statement/?days=${period}`, '_blank');
    }
  };


  // STRICT AUTH GATE: Show LoginScreen until logged in!
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <Navbar
        currentUser={currentUser}
        customer={customer}
        onLogout={handleLogout}
      />

      <main className="app-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Yükleniyor...</div>
          </div>
        ) : (
          <>
            {customer && (
              <CustomerCard
                customer={customer}
                onDownloadStatement={handleDownloadStatement}
                onEditProfile={() => setIsProfileModalOpen(true)}
              />
            )}

            <TransactionTable
              transactions={transactions}
              onAddTransaction={() => {
                setEditingTx(null);
                setIsTxModalOpen(true);
              }}
              onEditTransaction={(tx) => {
                setEditingTx(tx);
                setIsTxModalOpen(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
              onDownloadReceipt={handleDownloadReceipt}
            />
          </>
        )}
      </main>

      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        editingTransaction={editingTx}
        customerId={customer ? customer.id : 1}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        customer={customer}
        onSaveProfile={handleSaveProfile}
      />
    </div>
  );
}
