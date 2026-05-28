import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const GoogleLoginButton = ({ onError }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Google Login failed');
      }

      const data = await res.json();
      login(data.access_token, data.name, data.email);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google Login Error:', err);
      if (onError) onError(err.message);
    }
  };

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
    }
  }, [clientId]);

  return <div id="google-signin-btn" className="w-full"></div>;
};

export default GoogleLoginButton;
