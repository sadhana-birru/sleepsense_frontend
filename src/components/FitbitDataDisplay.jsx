import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Bed, Clock, Activity, Calendar, Loader2, AlertCircle } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL;


const FitbitDataDisplay = ({ date, onDataUpdate }) => {
  const [sleepData, setSleepData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSleepData = useCallback(async (targetDate) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/fitbit/sleep/${targetDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSleepData(data);
        onDataUpdate && onDataUpdate(data);
      } else if (response.status === 404) {
        setSleepData(null);
        setError(`No sleep data available for ${targetDate}`);
      } else {
        setError('Failed to fetch sleep data');
      }
    } catch (error) {
      console.error('Error fetching Fitbit sleep data:', error);
      setError('Error fetching sleep data');
    } finally {
      setIsLoading(false);
    }
  }, [onDataUpdate]);

  useEffect(() => {
    if (date) {
      fetchSleepData(date);
    }
  }, [date, fetchSleepData]);

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatMinutes = (minutes) => {
    if (!minutes) return '0 min';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} min`;
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading Fitbit data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center text-yellow-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (!sleepData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center text-gray-500">
          <Moon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">No Fitbit sleep data available for {date}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Moon className="w-5 h-5 mr-2 text-blue-500" />
          Fitbit Sleep Data
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {sleepData.date || date}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Bed className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-800">Total Sleep</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {formatMinutes(sleepData.total_minutes_asleep)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">Time in Bed</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {formatMinutes(sleepData.total_time_in_bed)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Activity className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-800">Efficiency</span>
          </div>
          <p className="text-2xl font-bold text-purple-900">
            {sleepData.sleep_efficiency || 0}%
          </p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <Moon className="w-4 h-4 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-800">Deep Sleep</span>
          </div>
          <p className="text-2xl font-bold text-indigo-900">
            {formatMinutes(sleepData.sleep_stages?.deep)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Sleep Time:</span>
          <span className="font-medium text-gray-800">
            {formatTime(sleepData.sleep_start_time)} - {formatTime(sleepData.sleep_end_time)}
          </span>
        </div>

        {sleepData.sleep_stages && (
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Sleep Stages</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Deep Sleep:</span>
                <span className="font-medium text-gray-800">{formatMinutes(sleepData.sleep_stages.deep)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Light Sleep:</span>
                <span className="font-medium text-gray-800">{formatMinutes(sleepData.sleep_stages.light)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">REM Sleep:</span>
                <span className="font-medium text-gray-800">{formatMinutes(sleepData.sleep_stages.rem)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Awake:</span>
                <span className="font-medium text-gray-800">{formatMinutes(sleepData.sleep_stages.wake)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center text-xs text-gray-500 bg-gray-50 rounded p-2">
          <span className="mr-1">Data source:</span>
          <span className="font-medium text-blue-600">Fitbit</span>
        </div>
      </div>
    </div>
  );
};

export default FitbitDataDisplay;
