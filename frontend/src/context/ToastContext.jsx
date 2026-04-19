import { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000); 
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div 
          className={`fixed top-5 right-5 p-4 rounded shadow-lg text-white z-50 ${
            toast.type === 'success' 
              ? 'bg-green-500 animate-[slideIn_0.3s_ease-out_forwards]' 
              : 'bg-red-500 animate-[shake_0.3s_ease-in-out]'
          }`}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};