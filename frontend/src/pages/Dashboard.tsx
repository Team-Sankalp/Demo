import React from 'react';
import { Users, CreditCard, TrendingUp, TrendingDown, Plus, BarChart2, UserPlus, Tag } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from 'recharts';
import { StatCard } from '../components/Common/StatCard';
import { mockDashboardStats, mockChartData } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const stats = mockDashboardStats;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's a snapshot of your subscription business.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          change={{ value: '12.5%', type: 'increase' }}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
          change={{ value: '8.2%', type: 'increase' }}
        />
        <StatCard
          title="Monthly Renewals"
          value={stats.monthlyRenewals}
          icon={TrendingUp}
          change={{ value: '15.3%', type: 'increase' }}
        />
        <StatCard
          title="Cancellations"
          value={stats.monthlyCancellations}
          icon={TrendingDown}
          change={{ value: '3.1%', type: 'decrease' }}
        />
      </div>

      {/* Revenue & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium opacity-90 mb-1">Monthly Revenue</h3>
            <p className="text-4xl font-bold mb-2">${stats.monthlyRevenue.toLocaleString()}</p>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="h-4 w-4 mr-1.5" />
            <span>+18.7% vs last month</span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-lg transition-colors">
              <Plus className="h-6 w-6 mb-2" />
              <span className="font-medium text-sm text-center">New Plan</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg transition-colors">
              <UserPlus className="h-6 w-6 mb-2" />
              <span className="font-medium text-sm text-center">Add User</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-lg transition-colors">
              <BarChart2 className="h-6 w-6 mb-2" />
              <span className="font-medium text-sm text-center">Analytics</span>
            </button>
            <button className="flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-lg transition-colors">
              <Tag className="h-6 w-6 mb-2" />
              <span className="font-medium text-sm text-center">New Offer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Plans Chart */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Plans by Subscribers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockChartData.topPlans} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f3f4f6'}} />
              <Bar dataKey="subscribers" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockChartData.subscriptionTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="active" stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="cancelled" stroke="#EF4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};