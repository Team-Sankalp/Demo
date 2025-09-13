import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  BarChart3,
  Gift,
  FileText,
  Settings,
  ChevronLeft
} from 'lucide-react';

const sidebarItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard'
  },
  {
    label: 'Plan Management',
    icon: Package,
    path: '/plans'
  },
  {
    label: 'Subscriptions',
    icon: CreditCard,
    path: '/subscriptions'
  },
  {
    label: 'User Management',
    icon: Users,
    path: '/users'
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics'
  },
  {
    label: 'Discounts & Offers',
    icon: Gift,
    path: '/offers'
  },
  {
    label: 'Audit Logs',
    icon: FileText,
    path: '/logs'
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 sm:w-72 bg-gray-900 border-r border-gray-700 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700">
          <span className="text-base sm:text-lg font-semibold text-white">Admin Panel</span>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        <nav className="mt-4 sm:mt-6 px-2 sm:px-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`
                  }
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                >
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};