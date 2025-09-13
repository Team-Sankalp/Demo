import React, { useState, useEffect } from 'react';
import { Users, CreditCard, TrendingUp, TrendingDown, Plus, BarChart2, UserPlus, Tag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/Common/StatCard';
import { apiService } from '../services/api';

interface DashboardData {
  stats: {
    total_users: number;
    active_subscriptions: number;
    total_plans: number;
    monthly_revenue: number;
    total_usage_gb: number;
    unread_alerts: number;
  };
  recent_subscriptions: Array<{
    id: number;
    user_name: string;
    plan_name: string;
    status: string;
    price_paid: number;
    created_at: string;
  }>;
}

export const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{error || 'Failed to load data'}</div>
        </div>
      </div>
    );
  }

  const { stats } = dashboardData;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's a snapshot of your subscription business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <StatCard
          title="Total Users"
          value={stats.total_users.toLocaleString()}
          icon={Users}
          change={{ value: '12.5%', type: 'increase' }}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.active_subscriptions.toLocaleString()}
          icon={CreditCard}
          change={{ value: '8.2%', type: 'increase' }}
        />
        <StatCard
          title="Total Plans"
          value={stats.total_plans.toLocaleString()}
          icon={TrendingUp}
          change={{ value: '15.3%', type: 'increase' }}
        />
        <StatCard
          title="Unread Alerts"
          value={stats.unread_alerts.toLocaleString()}
          icon={TrendingDown}
          change={{ value: '3.1%', type: 'decrease' }}
        />
      </div>

      {/* Revenue & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-4 sm:p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-medium opacity-90 mb-1">Monthly Revenue</h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">${stats.monthly_revenue.toLocaleString()}</p>
          </div>
          <div className="flex items-center text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
            <span>+18.7% vs last month</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            <button className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 sm:p-4 rounded-lg transition-colors">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
              <span className="font-medium text-xs sm:text-sm text-center">New Plan</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 p-3 sm:p-4 rounded-lg transition-colors">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
              <span className="font-medium text-xs sm:text-sm text-center">Add User</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 p-3 sm:p-4 rounded-lg transition-colors">
              <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
              <span className="font-medium text-xs sm:text-sm text-center">Analytics</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 text-orange-700 p-3 sm:p-4 rounded-lg transition-colors">
              <Tag className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mb-1 sm:mb-2" />
              <span className="font-medium text-xs sm:text-sm text-center">New Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {/* Recent Subscriptions */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Subscriptions</h3>
          <div className="space-y-3">
            {dashboardData.recent_subscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{subscription.user_name}</p>
                  <p className="text-sm text-gray-600">{subscription.plan_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${subscription.price_paid}</p>
                  <p className="text-sm text-gray-600">{subscription.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Usage Statistics</h3>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total_usage_gb.toFixed(1)} GB</p>
              <p className="text-sm text-gray-600">Total Data Used</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-semibold text-green-600">{stats.active_subscriptions}</p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-600">{stats.total_plans}</p>
                <p className="text-xs text-gray-600">Plans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};