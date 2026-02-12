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

  const getStyle = () => {
    const base = "fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 border-thick shadow-key font-bold z-50 transition-all duration-300 font-mono text-sm uppercase tracking-wider min-w-[300px] text-center";

    switch (type) {
        case 'success':
            return `${base} bg-[#22c55e] text-white`; // Green
        case 'error':
            return `${base} bg-accent-pop text-white`; // Red
        case 'info':
        default:
             return `${base} bg-fg-primary text-bg-main`; // Black on Yellow
    }
  };

  return (
    <div
      className={`${getStyle()} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
    >
      {message}
    </div>
  );
};
