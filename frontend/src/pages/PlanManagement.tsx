import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { apiService } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';

interface Plan {
  id: number;
  name: string;
  description: string;
  monthly_price: number;
  monthly_quota_gb: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const PlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    monthly_price: '',
    monthly_quota_gb: '',
    is_active: true
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPlans();
      setPlans(data);
    } catch (err) {
      setError('Failed to load plans');
      console.error('Plans fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submitting) return; // Prevent multiple submissions
    
    // Validate form data
    if (!formData.name.trim()) {
      setError('Plan name is required');
      return;
    }
    
    if (!formData.monthly_price || parseFloat(formData.monthly_price) <= 0) {
      setError('Monthly price must be greater than 0');
      return;
    }
    
    if (!formData.monthly_quota_gb || parseInt(formData.monthly_quota_gb) <= 0) {
      setError('Monthly quota must be greater than 0');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
    if (editingPlan) {
      // Update existing plan
        await apiService.updatePlan(editingPlan.id, {
          name: formData.name,
          description: formData.description,
          monthly_price: parseFloat(formData.monthly_price),
          monthly_quota_gb: parseInt(formData.monthly_quota_gb),
          is_active: formData.is_active
        });
    } else {
      // Create new plan
        await apiService.createPlan({
          name: formData.name,
          description: formData.description,
          monthly_price: parseFloat(formData.monthly_price),
          monthly_quota_gb: parseInt(formData.monthly_quota_gb),
          is_active: formData.is_active
        });
      }
      
      // Refresh plans list
      await fetchPlans();
      resetForm();
      
      // Show success message
      setSuccess(editingPlan ? `Plan "${formData.name}" updated successfully!` : `Plan "${formData.name}" created successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
      // Show success notification (with error handling)
      try {
        addNotification({
          type: 'success',
          title: editingPlan ? 'Plan Updated' : 'Plan Created',
          message: editingPlan ? `Plan "${formData.name}" has been updated successfully` : `Plan "${formData.name}" has been created successfully`,
          duration: 5000
        });
      } catch (notificationError) {
        console.warn('Notification error:', notificationError);
        // Don't let notification errors break the main flow
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save plan';
      setError(errorMessage);
      try {
        addNotification({
          type: 'error',
          title: 'Error',
          message: errorMessage,
          duration: 5000
        });
      } catch (notificationError) {
        console.warn('Notification error:', notificationError);
      }
      console.error('Plan save error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      monthly_price: plan.monthly_price.toString(),
      monthly_quota_gb: plan.monthly_quota_gb.toString(),
      is_active: plan.is_active
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (planId: number) => {
    const plan = plans.find(p => p.id === planId);
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        await apiService.deletePlan(planId);
        await fetchPlans();
        
        // Show success notification
        addNotification({
          type: 'success',
          title: 'Plan Deleted',
          message: `Plan "${plan?.name}" has been deleted successfully`,
          duration: 5000
        });
      } catch (err) {
        setError('Failed to delete plan');
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete plan. Please try again.',
          duration: 5000
        });
        console.error('Plan delete error:', err);
      }
    }
  };

  const togglePlanStatus = async (plan: Plan) => {
    try {
      await apiService.updatePlan(plan.id, {
        is_active: !plan.is_active
      });
      await fetchPlans();
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Plan Status Updated',
        message: `Plan "${plan.name}" has been ${!plan.is_active ? 'activated' : 'deactivated'}`,
        duration: 5000
      });
    } catch (err) {
      setError('Failed to update plan status');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update plan status. Please try again.',
        duration: 5000
      });
      console.error('Plan status update error:', err);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', monthly_price: '', monthly_quota_gb: '', is_active: true });
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
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Quota (GB)</label>
              <input
                type="number"
                required
                value={formData.monthly_quota_gb}
                onChange={(e) => setFormData({ ...formData, monthly_quota_gb: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.monthly_price}
                onChange={(e) => setFormData({ ...formData, monthly_price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="29.99"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={formData.is_active ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'active' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Plan description..."
                rows={3}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex space-x-3">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  submitting
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {submitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>{submitting ? 'Saving...' : (editingPlan ? 'Update Plan' : 'Create Plan')}</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading plans...</div>
        </div>
      ) : (
        /* Plans Table */
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Plans ({plans.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quota (GB)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{plan.name}</div>
                      <div className="text-sm text-gray-500">Created {new Date(plan.created_at).toLocaleDateString()}</div>
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{plan.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{plan.monthly_quota_gb} GB</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${plan.monthly_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                        onClick={() => togglePlanStatus(plan)}
                      className="flex items-center"
                    >
                        {plan.is_active ? (
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
      )}
    </div>
  );
};