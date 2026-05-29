import React, { useState } from 'react';
import { Link, ExternalLink, Check, X, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const FitbitConnectButton = ({ onDisconnect, isConnected, isLoading = false }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (isConnecting || isLoading) return;
    
    setIsConnecting(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/fitbit/connect`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirect to Fitbit authorization URL
        window.location.href = data.auth_url;
      } else {
        console.error('Failed to initiate Fitbit connection');
      }
    } catch (error) {
      console.error('Error connecting to Fitbit:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (isLoading) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/auth/fitbit/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        onDisconnect && onDisconnect();
      } else {
        console.error('Failed to disconnect Fitbit');
      }
    } catch (error) {
      console.error('Error disconnecting Fitbit:', error);
    }
  };

  if (isConnected === null) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-500">Checking Fitbit status...</span>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-2 mr-3">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Fitbit Connected</h3>
              <p className="text-xs text-green-600">Your Fitbit account is linked</p>
            </div>
          </div>
          <button
            onClick={handleDisconnect}
            disabled={isLoading}
            className="flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <X className="w-3 h-3 mr-1" />
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-blue-100 rounded-full p-2 mr-3">
            <Link className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Connect Fitbit</h3>
            <p className="text-xs text-blue-600">Sync your sleep data automatically</p>
          </div>
        </div>
        <button
          onClick={handleConnect}
          disabled={isConnecting || isLoading}
          className="flex items-center px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <ExternalLink className="w-3 h-3 mr-1" />
              Connect
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default FitbitConnectButton;
