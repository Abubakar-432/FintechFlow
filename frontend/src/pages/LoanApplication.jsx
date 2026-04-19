import { useState } from 'react';
import { useToast } from '../context/ToastContext';

export default function LoanApplication() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', cnic: '', phone: '', amount: '', purpose: 'Personal', tenure: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleNext = async () => {
    const newErrors = {};
    if (step === 1) {
      const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
      if (!cnicRegex.test(formData.cnic)) newErrors.cnic = "Format must be XXXXX-XXXXXXX-X";
      if (!formData.name) newErrors.name = "Name is required";
    }
    if (step === 2) {
      if (formData.amount < 5000 || formData.amount > 5000000) newErrors.amount = "Amount must be between 5k and 5M";
      if (formData.tenure < 3 || formData.tenure > 60) newErrors.tenure = "Tenure must be 3-60 months";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      if (step < 3) {
        setStep(step + 1);
      } else {
        setLoading(true);
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/loans/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          
          showToast(`Success! Your Loan ID is ${data.loanId}`, "success");
          setStep(1); 
          setFormData({ name: '', cnic: '', phone: '', amount: '', purpose: 'Personal', tenure: '' });
        } catch (err) {
          showToast(err.message, "error");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md animate-[fadeIn_0.5s_ease-in]">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Apply for a Loan (Step {step} of 3)</h2>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>

      <div className="min-h-[200px]">
        {step === 1 && (
            <div className="space-y-4 animate-[slideIn_0.3s_ease-out_forwards]">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" className="w-full p-2 border rounded dark:bg-gray-700 focus:ring-2 focus:ring-blue-500" 
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">CNIC (XXXXX-XXXXXXX-X)</label>
                    <input type="text" className="w-full p-2 border rounded dark:bg-gray-700 focus:ring-2 focus:ring-blue-500" 
                        value={formData.cnic} onChange={e => setFormData({...formData, cnic: e.target.value})} />
                    {errors.cnic && <span className="text-red-500 text-sm">{errors.cnic}</span>}
                </div>
            </div>
        )}
        
        {step === 2 && (
            <div className="space-y-4 animate-[slideIn_0.3s_ease-out_forwards]">
                <div>
                    <label className="block text-sm font-medium mb-1">Amount (PKR 5k - 5M)</label>
                    <input type="number" className="w-full p-2 border rounded dark:bg-gray-700 focus:ring-2 focus:ring-blue-500" 
                        value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                    {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tenure (3-60 Months)</label>
                    <input type="number" className="w-full p-2 border rounded dark:bg-gray-700 focus:ring-2 focus:ring-blue-500" 
                        value={formData.tenure} onChange={e => setFormData({...formData, tenure: e.target.value})} />
                    {errors.tenure && <span className="text-red-500 text-sm">{errors.tenure}</span>}
                </div>
            </div>
        )}

        {step === 3 && (
            <div className="space-y-2 animate-[slideIn_0.3s_ease-out_forwards] bg-gray-50 dark:bg-gray-700 p-4 rounded">
                <h3 className="font-bold mb-2">Review Details</h3>
                <p><strong>Name:</strong> {formData.name}</p>
                <p><strong>CNIC:</strong> {formData.cnic}</p>
                <p><strong>Amount:</strong> PKR {formData.amount}</p>
                <p><strong>Tenure:</strong> {formData.tenure} Months</p>
            </div>
        )}
      </div>

      <div className="mt-6 flex justify-between border-t pt-4">
         {step > 1 ? <button onClick={() => setStep(step - 1)} disabled={loading} className="px-6 py-2 bg-gray-300 dark:bg-gray-600 rounded">Back</button> : <div></div>}
         <button onClick={handleNext} disabled={loading} className={`px-6 py-2 text-white rounded ${step === 3 ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
            {loading ? 'Processing...' : step === 3 ? 'Submit Application' : 'Next'}
         </button>
      </div>
    </div>
  );
}