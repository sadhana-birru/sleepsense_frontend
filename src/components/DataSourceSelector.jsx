import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Moon, Edit3, Check, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;


const DataSourceSelector = ({ 
  date, 
  onDataSourceChange, 
  onFitbitDataUpdate,
  isFitbitConnected = false 
}) => {
  const [dataSource, setDataSource] = useState('manual');
  const [fitbitData, setFitbitData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFitbitData = useCallback(async () => {
    if (!date) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/fitbit/sleep/${date}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setFitbitData(data);
        onFitbitDataUpdate && onFitbitDataUpdate(data);
      } else if (response.status === 404) {
        setFitbitData(null);
        setError(`No Fitbit data available for ${date}`);
      } else {
        setError('Failed to fetch Fitbit data');
      }
    } catch (error) {
      console.error('Error fetching Fitbit data:', error);
      setError('Error fetching Fitbit data');
    } finally {
      setIsLoading(false);
    }
  }, [date, onFitbitDataUpdate]);

  useEffect(() => {
    if (isFitbitConnected && dataSource === 'fitbit') {
      fetchFitbitData();
    }
  }, [dataSource, date, isFitbitConnected]); // Remove fetchFitbitData to prevent infinite loop

  const handleDataSourceChange = (newSource) => {
    setDataSource(newSource);
    onDataSourceChange && onDataSourceChange(newSource);
  };

  
  return (
    <div className="bg-charcoal-800/60 p-4 rounded-xl border border-white/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-blue-400" />
          <span className="text-sm font-medium text-gray-200">Data Source</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => handleDataSourceChange('manual')}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dataSource === 'manual' 
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/40" 
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Edit3 size={14} />
          Manual Entry
        </button>

        <button
          type="button"
          onClick={() => handleDataSourceChange('fitbit')}
          disabled={!isFitbitConnected}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dataSource === 'fitbit' 
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/40" 
              : isFitbitConnected
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-600 cursor-not-allowed opacity-50"
          }`}
        >
          <Moon size={14} />
          Fitbit Data
          {!isFitbitConnected && <AlertCircle size={12} />}
        </button>

        <button
          type="button"
          onClick={() => handleDataSourceChange('mixed')}
          disabled={!isFitbitConnected}
          className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            dataSource === 'mixed' 
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/40" 
              : isFitbitConnected
                ? "text-gray-400 hover:text-white hover:bg-white/5"
                : "text-gray-600 cursor-not-allowed opacity-50"
          }`}
        >
          <Activity size={14} />
          Mixed
          {!isFitbitConnected && <AlertCircle size={12} />}
        </button>
      </div>

      {dataSource === 'fitbit' && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent mr-2"></div>
              Loading Fitbit data...
            </div>
          ) : error ? (
            <div className="flex items-center text-yellow-600 text-sm p-2 bg-yellow-500/10 rounded-lg">
              <AlertCircle size={14} className="mr-2" />
              {error}
            </div>
          ) : fitbitData ? (
            <div className="text-sm text-gray-300 p-2 bg-blue-500/10 rounded-lg">
              <div className="flex items-center mb-2">
                <Check size={14} className="text-green-400 mr-2" />
                <span className="text-green-400 font-medium">Fitbit data loaded</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>Sleep: {Math.round((fitbitData.total_minutes_asleep || 0) / 60 * 10) / 10}h</div>
                <div>Efficiency: {fitbitData.sleep_efficiency || 0}%</div>
                <div>Deep: {Math.round((fitbitData.sleep_stages?.deep || 0) / 60 * 10) / 10}h</div>
                <div>REM: {Math.round((fitbitData.sleep_stages?.rem || 0) / 60 * 10) / 10}h</div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 p-2 bg-charcoal-700/50 rounded-lg">
              No Fitbit data available for {date}
            </div>
          )}
        </div>
      )}

      {dataSource === 'mixed' && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <div className="text-sm text-gray-300 p-2 bg-purple-500/10 rounded-lg">
            <div className="flex items-center mb-2">
              <Activity size={14} className="text-purple-400 mr-2" />
              <span className="text-purple-400 font-medium">Mixed data entry</span>
            </div>
            <p className="text-xs text-gray-400">
              Fitbit data will be loaded as defaults. You can override any values manually.
            </p>
          </div>
          
          {fitbitData && (
            <div className="mt-2 text-xs text-gray-400">
              <div className="flex items-center mb-1">
                <Check size={12} className="text-green-400 mr-1" />
                Fitbit data available as defaults
              </div>
            </div>
          )}
        </div>
      )}

      {!isFitbitConnected && (
        <div className="text-xs text-gray-500 text-center">
          Connect your Fitbit account to use Fitbit data sources
        </div>
      )}
    </div>
  );
};

export default DataSourceSelector;
