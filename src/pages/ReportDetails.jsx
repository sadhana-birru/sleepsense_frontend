import React from 'react';
import { useLocation, Navigate, Link } from 'react-router-dom';
import ReportDashboard from '../components/ReportDashboard';
import { ArrowLeft } from 'lucide-react';

export default function ReportDetails() {
  const location = useLocation();
  const reportData = location.state?.reportData;

  // If accessed directly without a report, bounce back to check-in
  if (!reportData) {
    return <Navigate to="/checkin" replace />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6 flex items-center justify-between">
         <Link to="/dashboard" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
           <ArrowLeft size={20} />
           <span>Back to Dashboard</span>
         </Link>
         
         <div className="text-sm text-gray-500">
           Generated: {new Date().toLocaleTimeString()}
         </div>
      </div>
      
      {/* We reuse the existing ReportDashboard component to display the data */}
      {/* Wrapping in a tall container so it looks great full screen */}
      <div className="min-h-[70vh]">
         <ReportDashboard data={reportData} isLoading={false} error={null} />
      </div>
    </div>
  );
}
