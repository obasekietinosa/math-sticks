import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message || !visible) return null;

  const bgColors = {
    success: '#22c55e', // green-500
    error: '#ef4444',   // red-500
    info: '#3b82f6',    // blue-500
  };

  return (
    <div
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-white font-bold z-50 transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      style={{ backgroundColor: bgColors[type] }}
    >
      {message}
    </div>
  );
};
