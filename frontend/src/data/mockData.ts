import { User, Plan, Subscription, Notification, DashboardStats } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    plan: 'Gold',
    status: 'Active',
    joinDate: '2024-01-15',
    region: 'North America',
    lastActivity: '2024-12-20'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    plan: 'Silver',
    status: 'Active',
    joinDate: '2024-02-10',
    region: 'Europe',
    lastActivity: '2024-12-19'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@example.com',
    plan: 'Premium',
    status: 'Suspended',
    joinDate: '2024-03-05',
    region: 'Asia',
    lastActivity: '2024-12-18'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    plan: 'Bronze',
    status: 'Active',
    joinDate: '2024-01-20',
    region: 'North America',
    lastActivity: '2024-12-20'
  },
  {
    id: '5',
    name: 'Alex Wilson',
    email: 'alex.wilson@example.com',
    plan: 'Gold',
    status: 'Inactive',
    joinDate: '2024-04-12',
    region: 'Europe',
    lastActivity: '2024-11-30'
  }
];

export const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Bronze',
    quota: '10GB',
    speed: '100 Mbps',
    price: 9.99,
    validity: '30 days',
    isActive: true,
    subscribers: 156,
    createdAt: '2023-12-01'
  },
  {
    id: '2',
    name: 'Silver',
    quota: '50GB',
    speed: '200 Mbps',
    price: 19.99,
    validity: '30 days',
    isActive: true,
    subscribers: 243,
    createdAt: '2023-12-01'
  },
  {
    id: '3',
    name: 'Gold',
    quota: '100GB',
    speed: '500 Mbps',
    price: 39.99,
    validity: '30 days',
    isActive: true,
    subscribers: 189,
    createdAt: '2023-12-01'
  },
  {
    id: '4',
    name: 'Premium',
    quota: 'Unlimited',
    speed: '1 Gbps',
    price: 59.99,
    validity: '30 days',
    isActive: true,
    subscribers: 78,
    createdAt: '2023-12-01'
  }
];

export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Doe',
    userEmail: 'john.doe@example.com',
    planName: 'Gold',
    status: 'Active',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    price: 39.99,
    autoRenew: true
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@example.com',
    planName: 'Silver',
    status: 'Expiring Soon',
    startDate: '2024-11-25',
    endDate: '2024-12-25',
    price: 19.99,
    autoRenew: false
  },
  {
    id: '3',
    userId: '3',
    userName: 'Mike Chen',
    userEmail: 'mike.chen@example.com',
    planName: 'Premium',
    status: 'Cancelled',
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    price: 59.99,
    autoRenew: false
  },
  {
    id: '4',
    userId: '4',
    userName: 'Emily Davis',
    userEmail: 'emily.davis@example.com',
    planName: 'Bronze',
    status: 'Active',
    startDate: '2024-12-10',
    endDate: '2025-01-09',
    price: 9.99,
    autoRenew: true
  }
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'New Subscription',
    message: 'John Doe subscribed to Gold Plan',
    timestamp: '2024-12-20T10:30:00Z',
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Plan Cancellations',
    message: 'Silver Plan cancelled by 3 users this week',
    timestamp: '2024-12-20T09:15:00Z',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update',
    message: 'Plan pricing updated successfully',
    timestamp: '2024-12-20T08:45:00Z',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Payment Failed',
    message: '2 payments failed this morning',
    timestamp: '2024-12-20T07:30:00Z',
    read: false
  }
];

export const mockDashboardStats: DashboardStats = {
  totalUsers: 1247,
  activeSubscriptions: 956,
  monthlyRenewals: 234,
  monthlyCancellations: 45,
  monthlyRevenue: 28450
};

export const mockChartData = {
  topPlans: [
    { name: 'Silver', subscribers: 243, revenue: 4857 },
    { name: 'Gold', subscribers: 189, revenue: 7556 },
    { name: 'Bronze', subscribers: 156, revenue: 1558 },
    { name: 'Premium', subscribers: 78, revenue: 4679 }
  ],
  subscriptionTrend: [
    { month: 'Jul', active: 820, cancelled: 23 },
    { month: 'Aug', active: 865, cancelled: 31 },
    { month: 'Sep', active: 890, cancelled: 28 },
    { month: 'Oct', active: 920, cancelled: 35 },
    { month: 'Nov', active: 945, cancelled: 42 },
    { month: 'Dec', active: 956, cancelled: 45 }
  ]
};