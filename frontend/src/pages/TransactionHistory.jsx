import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatPKR';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const { showToast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Dynamic Deployment URL
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/transactions`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      showToast("Failed to fetch transactions", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredTx = transactions.filter(tx => {
    const matchesFilter = filter === 'all' ? true : tx.type === filter;
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCredits = filteredTx.filter(t => t.type === 'credit').reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalDebits = filteredTx.filter(t => t.type === 'debit').reduce((sum, t) => sum + parseFloat(t.amount), 0);

  return (
    <div className="animate-[fadeIn_0.5s_ease-in] max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Transaction History</h2>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 dark:bg-green-900 p-4 rounded text-center shadow">
          <p className="text-sm font-bold text-green-800 dark:text-green-200">Credits</p>
          <p className="text-xl font-black text-green-600">{formatPKR(totalCredits)}</p>
        </div>
        <div className="bg-red-100 dark:bg-red-900 p-4 rounded text-center shadow">
          <p className="text-sm font-bold text-red-800 dark:text-red-200">Debits</p>
          <p className="text-xl font-black text-red-600">{formatPKR(totalDebits)}</p>
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded text-center shadow">
          <p className="text-sm font-bold text-blue-800 dark:text-blue-200">Net Flow</p>
          <p className="text-xl font-black text-blue-600">{formatPKR(totalCredits - totalDebits)}</p>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="text" 
          placeholder="Search descriptions..." 
          className="flex-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          value={search} onChange={e => setSearch(e.target.value)} 
        />
        <select 
          className="p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          value={filter} onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
        </select>
      </div>

      {/* Skeleton Loader Logic (Trap Defeated) */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow animate-pulse">
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded-full w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTx.length === 0 ? <p className="text-center text-gray-500 py-8">No transactions found.</p> : null}
          
          {filteredTx.map((tx, index) => (
            <div 
              key={tx.id} 
              className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded shadow animate-[slideIn_0.5s_ease-out_forwards] opacity-0"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div>
                <p className="font-bold">{tx.description}</p>
                <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs rounded-full ${tx.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {tx.type.toUpperCase()}
                </span>
                <p className={`font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatPKR(tx.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}