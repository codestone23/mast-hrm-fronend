'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log error to console
    console.error('Error occurred:', error);
  }, [error]);

  const handleGoHome = () => {
    router.push('/');
  };

  const handleRetry = () => {
    reset();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ef4444' }}>
        Đã xảy ra lỗi
      </h1>
      
      <p style={{ fontSize: '1.125rem', marginBottom: '2rem', color: '#6b7280' }}>
        Có lỗi không mong muốn đã xảy ra. Vui lòng thử lại.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleRetry}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Thử lại
        </button>
        
        <button
          onClick={handleGoHome}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Về trang chủ
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px' }}>
          <summary style={{ cursor: 'pointer', color: '#6b7280' }}>
            Chi tiết lỗi (chỉ hiển thị trong development)
          </summary>
          <pre style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '0.5rem',
            overflow: 'auto',
            fontSize: '0.875rem'
          }}>
            {error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
