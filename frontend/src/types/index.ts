export interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: 'Active' | 'Suspended' | 'Inactive';
  joinDate: string;
  region: string;
  lastActivity: string;
}

export interface Plan {
  id: string;
  name: string;
  quota: string;
  speed: string;
  price: number;
  validity: string;
  isActive: boolean;
  subscribers: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planName: string;
  status: 'Active' | 'Expired' | 'Cancelled' | 'Expiring Soon';
  startDate: string;
  endDate: string;
  price: number;
  autoRenew: boolean;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  monthlyRenewals: number;
  monthlyCancellations: number;
  monthlyRevenue: number;
}