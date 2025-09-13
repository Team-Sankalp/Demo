import React, { useState } from 'react';
import { Filter, Download, MoreHorizontal, AlertCircle } from 'lucide-react';
import { Subscription } from '../types';
import { mockSubscriptions } from '../data/mockData';

export const SubscriptionManagement: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesFilter = filter === 'all' || sub.status.toLowerCase() === filter.toLowerCase().replace(' ', ' ');
    const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.planName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'expiring soon': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (subscriptionId: string, action: string) => {
    setSubscriptions(subscriptions.map(sub => {
      if (sub.id === subscriptionId) {
        switch (action) {
          case 'cancel':
            return { ...sub, status: 'Cancelled' as const };
          case 'reactivate':
            return { ...sub, status: 'Active' as const };
          default:
            return sub;
        }
      }
      return sub;
    }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage all user subscriptions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
                <option value="expiring soon">Expiring Soon</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Search users, emails, or plans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          <div className="text-sm text-gray-500">
            Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {subscriptions.filter(s => s.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {subscriptions.filter(s => s.status === 'Expiring Soon').length}
            </div>
            <div className="text-sm text-gray-500">Expiring Soon</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {subscriptions.filter(s => s.status === 'Expired').length}
            </div>
            <div className="text-sm text-gray-500">Expired</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {subscriptions.filter(s => s.status === 'Cancelled').length}
            </div>
            <div className="text-sm text-gray-500">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto Renew</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{subscription.userName}</div>
                      <div className="text-sm text-gray-500">{subscription.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{subscription.planName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
                      {subscription.status === 'Expiring Soon' && <AlertCircle className="h-3 w-3 mr-1" />}
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${subscription.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{subscription.startDate}</div>
                    <div className="text-xs text-gray-500">to {subscription.endDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      subscription.autoRenew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.autoRenew ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="relative group">
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <div className="py-1">
                          {subscription.status === 'Active' ? (
                            <button
                              onClick={() => handleAction(subscription.id, 'cancel')}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Cancel Subscription
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(subscription.id, 'reactivate')}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              Reactivate
                            </button>
                          )}
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Force Upgrade
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Force Downgrade
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No subscriptions found</p>
            <p>Try adjusting your search criteria or filter settings.</p>
          </div>
        </div>
      )}
    </div>
  );
};