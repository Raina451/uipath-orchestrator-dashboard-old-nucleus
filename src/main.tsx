import { enableMapSet } from "immer";
enableMapSet();
import React, { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { initializeUiPathSDK } from '@/lib/uipath';
import '@/index.css';
import { HomePage } from '@/pages/HomePage';
import { ProcessesPage } from '@/pages/ProcessesPage';
import { JobsPage } from '@/pages/JobsPage';
import { QueuesPage } from '@/pages/QueuesPage';
import { AssetsPage } from '@/pages/AssetsPage';
import { RobotsPage } from '@/pages/RobotsPage';
import { AppLayout } from '@/components/layout/AppLayout';
function AppRouter() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  useEffect(() => {
    async function initialize() {
      try {
        await initializeUiPathSDK();
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Failed to initialize SDK:', err);
        setIsAuthenticated(false);
      } finally {
        setIsInitializing(false);
      }
    }
    initialize();
  }, []);
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Initializing UiPath SDK...</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-semibold text-gray-900">Authentication Required</h1>
          <p className="text-sm text-gray-500">
            Please configure your UiPath credentials in the .env file to access the dashboard.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
        <Route path="/processes" element={<AppLayout><ProcessesPage /></AppLayout>} />
        <Route path="/jobs" element={<AppLayout><JobsPage /></AppLayout>} />
        <Route path="/queues" element={<AppLayout><QueuesPage /></AppLayout>} />
        <Route path="/assets" element={<AppLayout><AssetsPage /></AppLayout>} />
        <Route path="/robots" element={<AppLayout><RobotsPage /></AppLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster richColors closeButton position="top-right" />
    </BrowserRouter>
  );
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  </StrictMode>,
);