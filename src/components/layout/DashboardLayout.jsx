import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-main)' }}>
      {/* Glowing background shapes to give depth to glass elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-[#7D6BDB]/12 blur-[100px] pointer-events-none" />
      <div className="absolute top-[35%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#22D3EE]/12 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[15%] w-[45%] h-[45%] rounded-full bg-[#E9D5FF]/18 blur-[120px] pointer-events-none" />

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-h-screen relative z-10 w-full md:ml-20 lg:ml-64 transition-all duration-300">
        <TopNav onMenuClick={() => setSidebarOpen(true)} />
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex-1 p-6 overflow-y-auto"
            style={{ minHeight: 'calc(100vh - 65px)' }}
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
