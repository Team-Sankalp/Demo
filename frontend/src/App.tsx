import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Layout/Navbar';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { PlanManagement } from './pages/PlanManagement';
import { SubscriptionManagement } from './pages/SubscriptionManagement';
import { UserManagement } from './pages/UserManagement';
import { Analytics } from './pages/Analytics';
import { ComingSoon } from './pages/ComingSoon';
import { mockNotifications } from './data/mockData';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState(mockNotifications);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleNotifications = () => setShowNotifications(!showNotifications);

  // Close notifications when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (showNotifications) setShowNotifications(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>
          <Navbar 
            onToggleSidebar={toggleSidebar}
            notifications={notifications}
            onNotificationClick={toggleNotifications}
            showNotifications={showNotifications}
          />
          
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plans" element={<PlanManagement />} />
              <Route path="/subscriptions" element={<SubscriptionManagement />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route 
                path="/offers" 
                element={
                  <ComingSoon 
                    title="Discounts & Offers" 
                    description="Manage promotional campaigns and discount codes"
                    features={[
                      'Create percentage-based discounts',
                      'Seasonal promotional campaigns',
                      'Discount usage analytics',
                      'Auto-expiring offers',
                      'Bulk discount applications'
                    ]}
                  />
                } 
              />
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
      </div>
    </Router>
  );
}

export default App;