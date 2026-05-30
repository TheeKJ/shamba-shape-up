'use client';

import { Toaster } from 'react-hot-toast';

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gutter={10}
      toastOptions={{
        duration: 4200,
        style: {
          background: '#FDFCFB',
          border: '1px solid rgba(27, 48, 34, 0.14)',
          borderRadius: '0',
          boxShadow: '0 18px 45px rgba(27, 48, 34, 0.16)',
          color: '#1B3022',
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: '1.45',
          maxWidth: '420px',
          padding: '14px 16px',
        },
        success: {
          iconTheme: {
            primary: '#047857',
            secondary: '#FDFCFB',
          },
        },
        error: {
          duration: 5600,
          iconTheme: {
            primary: '#B91C1C',
            secondary: '#FDFCFB',
          },
        },
        loading: {
          iconTheme: {
            primary: '#D97757',
            secondary: '#FDFCFB',
          },
        },
      }}
    />
  );
}
