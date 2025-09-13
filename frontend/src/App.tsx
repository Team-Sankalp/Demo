import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { PlanManagement } from './pages/PlanManagement';
import { SubscriptionManagement } from './pages/SubscriptionManagement';
import { UserManagement } from './pages/UserManagement';
import { DiscountManagement } from './pages/DiscountManagement';
import { Analytics } from './pages/Analytics';
import { ComingSoon } from './pages/ComingSoon';
import { mockNotifications } from './data/mockData';
import { NotificationProvider, useNotifications } from './contexts/NotificationContext';
import NotificationToast from './components/Common/NotificationToast';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(mockNotifications);
  const { notifications: toastNotifications, removeNotification } = useNotifications();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications) {
        // Check if the click is outside the notification area
        const notificationArea = document.querySelector('.notification-area');
        if (notificationArea && !notificationArea.contains(event.target as Node)) {
          setShowNotifications(false);
        }
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
          <Navbar 
            onToggleSidebar={toggleSidebar}
            notifications={notifications}
            onNotificationClick={toggleNotifications}
            showNotifications={showNotifications}
          />
          
          <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plans" element={<PlanManagement />} />
              <Route path="/subscriptions" element={<SubscriptionManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/offers" element={<DiscountManagement />} />
              <Route 
                path="/logs" 
                element={
                  <ComingSoon 
                    title="Audit Logs" 
                    description="Comprehensive activity tracking and audit trails"
                    features={[
                      'User activity tracking',
                      'Admin action logs',
                      'System event monitoring',
                      'Export logs to CSV/Excel',
                      'Advanced filtering and search',
                      'Retention policy management'
                    ]}
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ComingSoon 
                    title="System Settings" 
                    description="Configure system preferences and access controls"
                    features={[
                      'Role-based access control',
                      'System configuration',
                      'Security settings',
                      'Notification preferences',
                      'Auto-renewal policies',
                      'Backup and restore'
                    ]}
                  />
                } 
              />
            </Routes>
          </main>
        </div>
        
        {/* Toast Notifications */}
        <NotificationToast 
          notifications={toastNotifications}
          onRemove={removeNotification}
        />
      </div>
    </Router>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;