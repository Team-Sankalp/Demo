import React, { useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { Plan } from '../types';
import { mockPlans } from '../data/mockData';

export const PlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    quota: '',
    speed: '',
    price: '',
    validity: '30 days'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id 
          ? {
              ...plan,
              ...formData,
              price: parseFloat(formData.price)
            }
          : plan
      ));
      setEditingPlan(null);
    } else {
      // Create new plan
      const newPlan: Plan = {
        id: Date.now().toString(),
        ...formData,
        price: parseFloat(formData.price),
        isActive: true,
        subscribers: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPlans([...plans, newPlan]);
    }
    
    setFormData({ name: '', quota: '', speed: '', price: '', validity: '30 days' });
    setShowCreateForm(false);
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      quota: plan.quota,
      speed: plan.speed,
      price: plan.price.toString(),
      validity: plan.validity
    });
    setShowCreateForm(true);
  };

  const handleDelete = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      setPlans(plans.filter(plan => plan.id !== planId));
    }
  };

  const togglePlanStatus = (planId: string) => {
    setPlans(plans.map(plan => 
      plan.id === planId 
        ? { ...plan, isActive: !plan.isActive }
        : plan
    ));
  };

  const resetForm = () => {
    setFormData({ name: '', quota: '', speed: '', price: '', validity: '30 days' });
    setShowCreateForm(false);
    setEditingPlan(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan Management</h1>
          <p className="text-gray-600">Create and manage subscription plans</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingPlan ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Premium"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quota</label>
              <input
                type="text"
                required
                value={formData.quota}
                onChange={(e) => setFormData({ ...formData, quota: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 100GB"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Speed</label>
              <input
                type="text"
                required
                value={formData.speed}
                onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 500 Mbps"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="29.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
              <select
                value={formData.validity}
                onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="30 days">30 days</option>
                <option value="90 days">90 days</option>
                <option value="1 year">1 year</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-5 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Plans ({plans.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Speed</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribers</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{plan.name}</div>
                    <div className="text-sm text-gray-500">Created {plan.createdAt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.quota}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.speed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plan.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.validity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.subscribers}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => togglePlanStatus(plan.id)}
                      className="flex items-center"
                    >
                      {plan.isActive ? (
                        <><ToggleRight className="h-5 w-5 text-green-500" /><span className="ml-1 text-sm text-green-600">Active</span></>
                      ) : (
                        <><ToggleLeft className="h-5 w-5 text-gray-400" /><span className="ml-1 text-sm text-gray-500">Inactive</span></>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};