import { useState } from 'react';
import { formatPKR } from '../utils/formatPKR';
import { useCountUp } from '../hooks/useCountUp';

export default function EmiCalculator() {
  const [formData, setFormData] = useState({ principal: '', annualRate: '', months: '' });
  const [results, setResults] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const animatedEmi = useCountUp(results?.emi || 0);
  const animatedTotal = useCountUp(results?.totalPayable || 0);
  const animatedInterest = useCountUp(results?.totalInterest || 0);

  const calculateEmi = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(formData).toString();
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/emi-calculator?${query}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setResults(data);

      let balance = parseFloat(formData.principal);
      const monthlyRate = (parseFloat(formData.annualRate) / 100) / 12;
      const newSchedule = [];

      for (let month = 1; month <= parseInt(formData.months); month++) {
        const interestForMonth = balance * monthlyRate;
        const principalForMonth = data.emi - interestForMonth;
        balance -= principalForMonth;

        newSchedule.push({
          month,
          principalComponent: Math.round(principalForMonth),
          interestComponent: Math.round(interestForMonth),
          remainingBalance: Math.max(0, Math.round(balance))
        });
      }
      setSchedule(newSchedule);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-in]">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">EMI Calculator & Amortization</h2>
      
      <form onSubmit={calculateEmi} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Principal (PKR)</label>
          <input type="number" required className="w-full p-2 border rounded dark:bg-gray-700"
            value={formData.principal} onChange={e => setFormData({...formData, principal: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">Annual Interest Rate (%)</label>
          <input type="number" step="0.1" required className="w-full p-2 border rounded dark:bg-gray-700"
            value={formData.annualRate} onChange={e => setFormData({...formData, annualRate: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">Tenure (Months)</label>
          <input type="number" required className="w-full p-2 border rounded dark:bg-gray-700"
            value={formData.months} onChange={e => setFormData({...formData, months: e.target.value})} />
        </div>
        <div className="md:col-span-3 flex justify-end">
           <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
             {loading ? 'Calculating...' : 'Calculate'}
           </button>
        </div>
        {error && <p className="md:col-span-3 text-red-500">{error}</p>}
      </form>

      {results && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded shadow text-center">
              <h3 className="text-sm font-bold uppercase text-blue-800 dark:text-blue-200">Monthly EMI</h3>
              <p className="text-3xl font-black mt-2 text-blue-600 dark:text-white">{formatPKR(animatedEmi)}</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-6 rounded shadow text-center">
              <h3 className="text-sm font-bold uppercase text-green-800 dark:text-green-200">Total Payable</h3>
              <p className="text-3xl font-black mt-2 text-green-600 dark:text-white">{formatPKR(animatedTotal)}</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900 p-6 rounded shadow text-center">
              <h3 className="text-sm font-bold uppercase text-red-800 dark:text-red-200">Total Interest</h3>
              <p className="text-3xl font-black mt-2 text-red-600 dark:text-white">{formatPKR(animatedInterest)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="p-3 border-b">Month</th>
                  <th className="p-3 border-b">Principal</th>
                  <th className="p-3 border-b">Interest</th>
                  <th className="p-3 border-b">Remaining Balance</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, index) => (
                  <tr key={index} className="border-b dark:border-gray-600 even:bg-gray-50 dark:even:bg-gray-800 animate-[fadeIn_0.5s_ease-in]" style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}>
                    <td className="p-3">{row.month}</td>
                    <td className="p-3 text-green-600 dark:text-green-400">{formatPKR(row.principalComponent)}</td>
                    <td className="p-3 text-red-600 dark:text-red-400">{formatPKR(row.interestComponent)}</td>
                    <td className="p-3 font-bold">{formatPKR(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}