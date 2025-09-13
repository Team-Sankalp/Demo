import React from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { StatCard } from '../components/Common/StatCard';
import { mockChartData } from '../data/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export const Analytics: React.FC = () => {
  const churnData = [
    { month: 'Jul', rate: 3.2 },
    { month: 'Aug', rate: 4.1 },
    { month: 'Sep', rate: 3.8 },
    { month: 'Oct', rate: 4.5 },
    { month: 'Nov', rate: 5.2 },
    { month: 'Dec', rate: 4.8 }
  ];

  const revenueData = [
    { month: 'Jul', revenue: 24500, subscriptions: 820 },
    { month: 'Aug', revenue: 26200, subscriptions: 865 },
    { month: 'Sep', revenue: 27800, subscriptions: 890 },
    { month: 'Oct', revenue: 29100, subscriptions: 920 },
    { month: 'Nov', revenue: 30500, subscriptions: 945 },
    { month: 'Dec', revenue: 28450, subscriptions: 956 }
  ];

  const engagementData = [
    { name: 'High Usage', value: 45, count: 432 },
    { name: 'Medium Usage', value: 35, count: 334 },
    { name: 'Low Usage', value: 20, count: 190 }
  ];

  const planPerformanceData = mockChartData.topPlans.map(plan => ({
    ...plan,
    performance: (plan.subscribers / plan.revenue * 100).toFixed(1),
    churnRate: Math.random() * 10 + 2
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600">Comprehensive analysis of subscription performance and user engagement</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Average Revenue Per User"
          value="$29.75"
          icon={DollarSign}
          change={{ value: '8%', type: 'increase' }}
        />
        <StatCard
          title="Churn Rate"
          value="4.8%"
          icon={TrendingDown}
          change={{ value: '0.4%', type: 'decrease' }}
        />
        <StatCard
          title="Customer Lifetime Value"
          value="$127.50"
          icon={Users}
          change={{ value: '12%', type: 'increase' }}
        />
        <StatCard
          title="Conversion Rate"
          value="12.3%"
          icon={TrendingUp}
          change={{ value: '2.1%', type: 'increase' }}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue & Subscription Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [
                name === 'revenue' ? `$${value.toLocaleString()}` : value,
                name === 'revenue' ? 'Revenue' : 'Subscriptions'
              ]} />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" />
              <Line type="monotone" dataKey="subscriptions" stroke="#10B981" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Engagement Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={engagementData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {engagementData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Churn Rate Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={churnData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Churn Rate']} />
              <Line type="monotone" dataKey="rate" stroke="#EF4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Performance Analysis</h3>
          <div className="space-y-4">
            {planPerformanceData.map((plan, index) => (
              <div key={plan.name} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{plan.name} Plan</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    plan.churnRate < 5 ? 'bg-green-100 text-green-800' :
                    plan.churnRate < 8 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {plan.churnRate.toFixed(1)}% churn
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Subscribers: {plan.subscribers}</div>
                  <div>Revenue: ${plan.revenue.toLocaleString()}</div>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(plan.subscribers / 250 * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🤖 AI-Powered Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">📈 Growth Opportunity</h4>
            <p className="text-sm text-gray-600">Silver plan shows highest growth potential. Consider promotional campaigns to increase adoption by 25%.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">⚠️ Retention Alert</h4>
            <p className="text-sm text-gray-600">Premium plan users show 15% higher churn rate. Recommend adding exclusive features or improved support.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">💡 Pricing Optimization</h4>
            <p className="text-sm text-gray-600">Consider introducing a mid-tier plan between Silver ($19.99) and Gold ($39.99) at $27.99 price point.</p>
          </div>
        </div>
      </div>
    </div>
  );
};