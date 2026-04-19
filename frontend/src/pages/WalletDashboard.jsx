import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useCountUp } from '../hooks/useCountUp';
import { formatPKR } from '../utils/formatPKR';

export default function WalletDashboard() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const { showToast } = useToast();
  
  const animatedBalance = useCountUp(balance);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet`);
      const data = await res.json();
      setBalance(data.balance);
    } catch (error) {
      showToast("Failed to load wallet data", "error");
    }
  };

  const handleTransaction = async (type) => {
    if (!amount || amount <= 0) {
      showToast("Please enter a valid amount", "error");
      return;
    }
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wallet/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setBalance(data.balance);
      setAmount('');
      showToast(data.message, "success");
      
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);

    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-in] max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">Wallet Dashboard</h2>
      
      <div className={`p-10 rounded-xl shadow-lg mb-8 text-center text-white transition-all duration-300 ${isAnimating ? 'scale-105 bg-green-500' : 'bg-gradient-to-r from-blue-600 to-indigo-700'}`}>
        <h3 className="text-lg opacity-80 uppercase tracking-wide">Available Balance</h3>
        <p className="text-5xl font-black mt-2 tracking-tight">
          {formatPKR(animatedBalance)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-green-600">Deposit Funds</h3>
          <input 
            type="number" 
            placeholder="Amount in PKR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 mb-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-4 focus:ring-green-500 focus:outline-none transition-shadow"
          />
          <button 
            onClick={() => handleTransaction('deposit')}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded transition-colors"
          >
            Deposit
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-red-600">Withdraw Funds</h3>
          <input 
            type="number" 
            placeholder="Amount in PKR"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 mb-4 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-4 focus:ring-red-500 focus:outline-none transition-shadow"
          />
          <button 
            onClick={() => handleTransaction('withdraw')}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}