'use client';

import React, { useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';
import TokenManager from '@/utils/token';

const TokenStatus: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<{
    isValid: boolean;
    isExpired: boolean;
    isExpiringSoon: boolean;
    expirationTime: Date | null;
    timeUntilExpiry: string | null;
  }>({
    isValid: false,
    isExpired: true,
    isExpiringSoon: true,
    expirationTime: null,
    timeUntilExpiry: null,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateTokenInfo = () => {
    const token = TokenManager.getAccessToken();
    
    if (!token) {
      setTokenInfo({
        isValid: false,
        isExpired: true,
        isExpiringSoon: true,
        expirationTime: null,
        timeUntilExpiry: null,
      });
      return;
    }

    const isValid = TokenManager.isValidToken(token);
    const isExpired = TokenManager.isAccessTokenExpired();
    const isExpiringSoon = TokenManager.isTokenExpiringSoon(token, 5);
    const expirationTime = TokenManager.getTokenExpiration(token);
    
    let timeUntilExpiry: string | null = null;
    if (expirationTime) {
      const now = new Date();
      const diff = expirationTime.getTime() - now.getTime();
      
      if (diff > 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        timeUntilExpiry = `${minutes}m ${seconds}s`;
      } else {
        timeUntilExpiry = 'Expired';
      }
    }

    setTokenInfo({
      isValid,
      isExpired,
      isExpiringSoon,
      expirationTime,
      timeUntilExpiry,
    });
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      await authService.refreshTokenIfNeeded();
      updateTokenInfo();
    } catch (error) {
      console.error('Error refreshing token:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    updateTokenInfo();
    
    // Cập nhật mỗi giây
    const interval = setInterval(updateTokenInfo, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Chỉ hiển thị trong development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <h3 className="font-semibold text-sm mb-2">Token Status</h3>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Valid:</span>
          <span className={tokenInfo.isValid ? 'text-green-600' : 'text-red-600'}>
            {tokenInfo.isValid ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Expired:</span>
          <span className={tokenInfo.isExpired ? 'text-red-600' : 'text-green-600'}>
            {tokenInfo.isExpired ? 'Yes' : 'No'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Expiring Soon:</span>
          <span className={tokenInfo.isExpiringSoon ? 'text-yellow-600' : 'text-green-600'}>
            {tokenInfo.isExpiringSoon ? 'Yes' : 'No'}
          </span>
        </div>
        
        {tokenInfo.timeUntilExpiry && (
          <div className="flex justify-between">
            <span>Time Left:</span>
            <span className={tokenInfo.isExpiringSoon ? 'text-yellow-600' : 'text-gray-600'}>
              {tokenInfo.timeUntilExpiry}
            </span>
          </div>
        )}
        
        {tokenInfo.expirationTime && (
          <div className="flex justify-between">
            <span>Expires At:</span>
            <span className="text-gray-600">
              {tokenInfo.expirationTime.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-200">
        <button
          onClick={handleRefreshToken}
          disabled={isRefreshing}
          className="w-full px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
        </button>
      </div>
    </div>
  );
};

export default TokenStatus;
