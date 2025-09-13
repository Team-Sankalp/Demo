import React from 'react';
import { Bell, User, Settings, LogOut, Zap, Menu } from 'lucide-react';
import { Notification } from '../../types';

interface NavbarProps {
  notifications: Notification[];
  onNotificationClick: () => void;
  showNotifications: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  notifications, 
  onNotificationClick, 
  showNotifications,
  onToggleSidebar
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-1 sm:p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
            <span className="text-lg sm:text-xl font-bold text-gray-800">LUMEN</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={onNotificationClick}
              className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                <div className="p-3 sm:p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Notifications</h3>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-3 sm:p-4 text-center text-gray-500 text-sm">
                    No new notifications
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 sm:p-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start space-x-2 sm:space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            notification.type === 'success' ? 'bg-green-500' :
                            notification.type === 'warning' ? 'bg-yellow-500' :
                            notification.type === 'error' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base">{notification.title}</p>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Admin Profile */}
          <div className="relative group">
            <button className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg transition-colors">
              <img 
                src="https://i.pravatar.cc/40?img=1"
                alt="Admin Profile"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full"
              />
              <span className="hidden sm:inline text-sm font-medium text-gray-700">Admin</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-44 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2 sm:p-3 border-b border-gray-200">
                <p className="font-medium text-gray-900 text-sm sm:text-base">Administrator</p>
                <p className="text-xs sm:text-sm text-gray-500">admin@lumen.com</p>
              </div>
              <div className="py-1">
                <a href="#" className="flex items-center space-x-2 w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Settings</span>
                </a>
                <a href="#" className="flex items-center space-x-2 w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Logout</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};