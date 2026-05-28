import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from '../components/InputForm';
import { useAuth } from '../hooks/useAuth';

export default function CheckIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleGenerateReport = async (formData, audioBlob) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('data', JSON.stringify(formData));

      if (audioBlob) {
        data.append('audio', audioBlob, 'voice_sample.wav');
      }


      // Important: Add the authorization header if token exists
      const headers = {};
      if (token && token !== 'null' && token !== 'undefined') {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers,
        body: data,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          logout();
          navigate('/login');
        }
        throw new Error(errData.detail || 'Failed to generate report');
      }

      const result = await response.json();
      
      // Navigate to the Report view, passing the result data via state
      navigate('/report', { state: { reportData: result } });

    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 md:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-700">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          Initiate <span className="text-gradient-primary">Tracking</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Complete your daily health scan. Provide biometric data and a brief audio check-in to generate a comprehensive emotional stability report.
        </p>
      </div>

      {error && (
        <div className="glass-panel border-rose-500/20 bg-rose-500/10 p-4 mb-8 text-rose-400 text-center rounded-xl">
          {error}
        </div>
      )}

      {/* The InputForm Component (modified to look premium in index.css) */}
      <InputForm onSubmit={handleGenerateReport} isLoading={isLoading} />
    </div>
  );
}
