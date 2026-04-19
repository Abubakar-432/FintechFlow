import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

import WalletDashboard from './pages/WalletDashboard';
import TransactionHistory from './pages/TransactionHistory';
import LoanApplication from './pages/LoanApplication';
import LoanStatus from './pages/LoanStatus';
import EmiCalculator from './pages/EmiCalculator';

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 font-sans">
          
          <nav className="p-4 shadow-md bg-gray-100 dark:bg-gray-800 flex flex-wrap justify-between items-center gap-4">
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">FintechFlow</h1>
            
            <div className="flex flex-wrap gap-4">
              <NavLink to="/" className={({isActive}) => isActive ? "text-blue-500 font-bold" : "hover:text-blue-400 transition-colors"}>Wallet</NavLink>
              <NavLink to="/transactions" className={({isActive}) => isActive ? "text-blue-500 font-bold" : "hover:text-blue-400 transition-colors"}>Transactions</NavLink>
              <NavLink to="/apply-loan" className={({isActive}) => isActive ? "text-blue-500 font-bold" : "hover:text-blue-400 transition-colors"}>Apply Loan</NavLink>
              <NavLink to="/loans" className={({isActive}) => isActive ? "text-blue-500 font-bold" : "hover:text-blue-400 transition-colors"}>Loan Status</NavLink>
              <NavLink to="/emi" className={({isActive}) => isActive ? "text-blue-500 font-bold" : "hover:text-blue-400 transition-colors"}>EMI Calculator</NavLink>
            </div>

            <button 
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded bg-gray-200 dark:bg-gray-700 transition-colors"
            >
              {isDark ? '☀️ Light' : '🌙 Dark'}
            </button>
          </nav>

          <main className="p-4 md:p-8 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<WalletDashboard />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/apply-loan" element={<LoanApplication />} />
              <Route path="/loans" element={<LoanStatus />} />
              <Route path="/emi" element={<EmiCalculator />} />
            </Routes>
          </main>

        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}