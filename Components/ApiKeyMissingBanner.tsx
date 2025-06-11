
import React from 'react';
import { WarningIcon } from '../constants';

interface ApiKeyMissingBannerProps {
  message?: string;
}

const ApiKeyMissingBanner: React.FC<ApiKeyMissingBannerProps> = ({ message }) => {
  const defaultMessage = "Gemini API Key is not configured or AI initialization failed. Please ensure the API_KEY environment variable is set correctly. Chat functionality will be disabled.";
  return (
    <div className="bg-red-800 border-l-4 border-red-500 text-red-100 p-4" role="alert">
      <div className="flex items-center">
        <WarningIcon className="text-red-300 mr-3" />
        <div>
          <p className="font-bold">Configuration Error</p>
          <p className="text-sm">{message || defaultMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyMissingBanner;
