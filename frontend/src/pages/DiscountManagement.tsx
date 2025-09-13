import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Tag, Calendar, Users, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';

interface Discount {
  id: number;
  code: string;
  description: string;
  discount_type: string;
  discount_value: number;
  min_amount?: number;
  max_discount?: number;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  valid_from?: string;
  valid_until?: string;
  plan_id?: number;
  plan_name?: string;
  created_at: string;
  updated_at: string;
}

interface Plan {
  id: number;
  name: string;
  monthly_price: number;
}

export const DiscountManagement: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: '',
    min_amount: '',
    max_discount: '',
    usage_limit: '',
    is_active: true,
    valid_from: '',
    valid_until: '',
    plan_id: ''
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    fetchDiscounts();
    fetchPlans();
  }, []);

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getDiscounts();
      setDiscounts(data.discounts);
    } catch (err) {
      setError('Failed to load discounts');
      console.error('Discounts fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await apiService.getPlans();
      setPlans(data);
    } catch (err) {
      console.error('Plans fetch error:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const discountData = {
        code: formData.code,
        description: formData.description,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        min_amount: formData.min_amount ? parseFloat(formData.min_amount) : undefined,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : undefined,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : undefined,
        is_active: formData.is_active,
        valid_from: formData.valid_from || undefined,
        valid_until: formData.valid_until || undefined,
        plan_id: formData.plan_id ? parseInt(formData.plan_id) : undefined
      };

      if (editingDiscount) {
        await apiService.updateDiscount(editingDiscount.id, discountData);
      } else {
        await apiService.createDiscount(discountData);
      }
      
      await fetchDiscounts();
      resetForm();
      
      // Show success notification
      addNotification({
        type: 'success',
        title: editingDiscount ? 'Discount Updated' : 'Discount Created',
        message: editingDiscount ? `Discount "${formData.code}" has been updated successfully` : `Discount "${formData.code}" has been created successfully`,
        duration: 5000
      });
    } catch (err) {
      setError('Failed to save discount');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save discount. Please try again.',
        duration: 5000
      });
      console.error('Discount save error:', err);
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      description: discount.description || '',
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
      min_amount: discount.min_amount?.toString() || '',
      max_discount: discount.max_discount?.toString() || '',
      usage_limit: discount.usage_limit?.toString() || '',
      is_active: discount.is_active,
      valid_from: discount.valid_from ? discount.valid_from.split('T')[0] : '',
      valid_until: discount.valid_until ? discount.valid_until.split('T')[0] : '',
      plan_id: discount.plan_id?.toString() || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (discountId: number) => {
    const discount = discounts.find(d => d.id === discountId);
    if (window.confirm('Are you sure you want to delete this discount?')) {
      try {
        await apiService.deleteDiscount(discountId);
        await fetchDiscounts();
        
        // Show success notification
        addNotification({
          type: 'success',
          title: 'Discount Deleted',
          message: `Discount "${discount?.code}" has been deleted successfully`,
          duration: 5000
        });
      } catch (err) {
        setError('Failed to delete discount');
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete discount. Please try again.',
          duration: 5000
        });
        console.error('Discount delete error:', err);
      }
    }
  };

  const toggleDiscountStatus = async (discount: Discount) => {
    try {
      await apiService.updateDiscount(discount.id, {
        is_active: !discount.is_active
      });
      await fetchDiscounts();
      
      // Show success notification
      addNotification({
        type: 'success',
        title: 'Discount Status Updated',
        message: `Discount "${discount.code}" has been ${!discount.is_active ? 'activated' : 'deactivated'}`,
        duration: 5000
      });
    } catch (err) {
      setError('Failed to update discount status');
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update discount status. Please try again.',
        duration: 5000
      });
      console.error('Discount status update error:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      min_amount: '',
      max_discount: '',
      usage_limit: '',
      is_active: true,
      valid_from: '',
      valid_until: '',
      plan_id: ''
    });
    setShowCreateForm(false);
    setEditingDiscount(null);
  };

  const getDiscountTypeColor = (type: string) => {
    switch (type) {
      case 'percentage': return 'bg-blue-100 text-blue-800';
      case 'fixed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const isExpired = (validUntil?: string) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discount Management</h1>
          <p className="text-gray-600">Create and manage discount codes for users</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Discount</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingDiscount ? 'Edit Discount' : 'Create New Discount'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., SAVE20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Value *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={formData.discount_type === 'percentage' ? '20' : '10.00'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.min_amount}
                  onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Discount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.max_discount}
                  onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                <input
                  type="date"
                  value={formData.valid_from}
                  onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan (Optional)</label>
                <select
                  value={formData.plan_id}
                  onChange={(e) => setFormData({ ...formData, plan_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Plans</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Discount description..."
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingDiscount ? 'Update Discount' : 'Create Discount'}
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

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading discounts...</div>
        </div>
      ) : (
        /* Discounts Table */
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Discounts ({discounts.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{discount.code}</div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">{discount.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDiscountTypeColor(discount.discount_type)}`}>
                        {discount.discount_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {discount.discount_type === 'percentage' 
                        ? `${discount.discount_value}%` 
                        : `$${discount.discount_value}`
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        <span>{discount.used_count}</span>
                        {discount.usage_limit && (
                          <span className="text-gray-500">/ {discount.usage_limit}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        <div>
                          {discount.valid_from && (
                            <div>From: {new Date(discount.valid_from).toLocaleDateString()}</div>
                          )}
                          {discount.valid_until && (
                            <div className={isExpired(discount.valid_until) ? 'text-red-600' : ''}>
                              Until: {new Date(discount.valid_until).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {discount.plan_name || 'All Plans'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleDiscountStatus(discount)}
                        className="flex items-center"
                      >
                        {discount.is_active ? (
                          <><ToggleRight className="h-5 w-5 text-green-500" /><span className="ml-1 text-sm text-green-600">Active</span></>
                        ) : (
                          <><ToggleLeft className="h-5 w-5 text-gray-400" /><span className="ml-1 text-sm text-gray-500">Inactive</span></>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(discount)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(discount.id)}
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
