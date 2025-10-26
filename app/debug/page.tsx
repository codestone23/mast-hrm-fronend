'use client';

import React from 'react';
import DevDebugPage from '@/components/debug/DevDebugPage';

const DebugPage = () => {
  // Chỉ hiển thị trong development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🚀 Development Debug Page</h1>
      <p>This page is only visible in development mode.</p>
      <DevDebugPage />
    </div>
  );
};

export default DebugPage;

