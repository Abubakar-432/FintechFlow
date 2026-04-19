import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { formatPKR } from '../utils/formatPKR';

export default function LoanStatus() {
  const [loans, setLoans] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/loans`);
      const data = await res.json();
      setLoans(data);
    } catch (error) {
      showToast("Failed to fetch loans", "error");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/loans/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      showToast(data.message, "success");
      setLoans(loans.map(loan => loan.id === id ? { ...loan, status: newStatus } : loan));
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-in] max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Loan Applications</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loans.length === 0 ? <p className="col-span-3 text-center text-gray-500 py-8">No loan applications yet.</p> : null}

        {loans.map((loan) => (
          <div key={loan.id} className="group h-64 w-full perspective-1000 bg-transparent">
            <div className="flip-card-inner relative w-full h-full text-center transition-transform duration-700 transform-style-3d">
              
              <div className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex flex-col justify-between border-t-4 border-blue-500">
                <div>
                  <h3 className="text-xl font-black text-gray-800 dark:text-white">{formatPKR(loan.amount)}</h3>
                  <p className="text-sm text-gray-500 mt-1">{loan.applicant}</p>
                </div>
                <div className="my-2">
                  <p className="text-xs uppercase tracking-wider text-gray-400">Purpose</p>
                  <p className="font-medium">{loan.purpose}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                    loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800 animate-pulse' : 
                    loan.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {loan.status}
                  </span>
                </div>
              </div>

              <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gray-100 dark:bg-gray-700 shadow-lg rounded-lg p-6 flex flex-col justify-center gap-4">
                 <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Admin Actions</h4>
                 <button 
                    onClick={() => updateStatus(loan.id, 'approved')} 
                    disabled={loan.status !== 'pending'}
                    className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-2 rounded transition-colors"
                 >
                   Approve Loan
                 </button>
                 <button 
                    onClick={() => updateStatus(loan.id, 'rejected')} 
                    disabled={loan.status !== 'pending'}
                    className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2 rounded transition-colors"
                 >
                   Reject Loan
                 </button>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}