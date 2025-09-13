# 🚀 Complete Subscription Management System

A full-stack subscription management platform built with React, Flask, and MySQL, featuring real-time notifications, comprehensive analytics, and responsive design.

## 🌟 Features

### 📊 **Admin Dashboard**
- **Real-time Analytics**: Comprehensive insights and metrics
- **User Management**: Complete user lifecycle management
- **Plan Management**: Create, edit, and manage subscription plans
- **Discount Management**: Advanced discount code system
- **Alert System**: Real-time notifications for all operations

### 🎯 **Key Capabilities**
- ✅ **User Management**: Registration, profiles, role-based access
- ✅ **Plan Management**: Flexible subscription plan creation
- ✅ **Analytics Dashboard**: Revenue, usage, and growth metrics
- ✅ **Discount System**: Percentage and fixed amount discounts
- ✅ **Real-time Notifications**: Toast notifications for all CRUD operations
- ✅ **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- ✅ **Database Integration**: MySQL with SQLAlchemy ORM
- ✅ **RESTful APIs**: Complete backend API system

## 🛠️ **Tech Stack**

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Flask** with Python 3.13
- **SQLAlchemy** ORM
- **MySQL** database
- **Flask-CORS** for cross-origin requests
- **Werkzeug** for password hashing

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ and npm
- Python 3.13+
- MySQL 8.0+

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Team-Sankalp/Demo.git
   cd Demo
   ```

2. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Update config.py with your MySQL credentials
   # Create database: lumen_supcription
   
   python app.py
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001

## 📱 **Screenshots**

### Dashboard
- Real-time metrics and analytics
- Revenue trends and user statistics
- Interactive charts and graphs

### Plan Management
- Create and manage subscription plans
- Real-time notifications
- Form validation and error handling

### User Management
- Complete user profiles
- Role-based access control
- Subscription tracking

### Analytics
- Comprehensive business intelligence
- Revenue and usage analytics
- Growth trend analysis

## 🔧 **API Endpoints**

### Admin APIs
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/users` - User management
- `GET /admin/plans` - Plan management
- `GET /admin/analytics` - Analytics data
- `GET /admin/discounts` - Discount management
- `GET /admin/alerts` - Alert system

### CRUD Operations
- **Users**: Create, Read, Update, Delete
- **Plans**: Create, Read, Update, Delete
- **Discounts**: Create, Read, Update, Delete
- **Alerts**: Real-time notification system

## 🎨 **Features in Detail**

### 📊 **Analytics Dashboard**
- **User Analytics**: Total users, active users, growth rates
- **Revenue Analytics**: Monthly revenue, ARPU, growth trends
- **Usage Analytics**: Data consumption patterns and distribution
- **Plan Analytics**: Popularity and performance metrics
- **Discount Analytics**: Usage rates and effectiveness

### 🔔 **Notification System**
- **Real-time Alerts**: Instant feedback for all operations
- **Toast Notifications**: User-friendly popup messages
- **System Alerts**: Database-stored alert history
- **Error Handling**: Graceful error management

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Perfect for tablet interfaces
- **Desktop Ready**: Full-featured desktop experience
- **Touch-Friendly**: Intuitive touch interactions

## 🗄️ **Database Schema**

### Core Tables
- **users**: User accounts and profiles
- **plans**: Subscription plan definitions
- **subscriptions**: User subscription records
- **usage**: Data usage tracking
- **discounts**: Discount code management
- **alerts**: System notifications
- **audit_logs**: Activity tracking

## 🚀 **Deployment**

### Backend Deployment
1. Set up MySQL database
2. Update configuration in `config.py`
3. Install dependencies: `pip install -r requirements.txt`
4. Run migrations and seed data
5. Deploy with Gunicorn or similar WSGI server

### Frontend Deployment
1. Build for production: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API endpoints for production

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 **Team**

**Team Sankalp** - Building innovative solutions for subscription management.

## 🔗 **Links**

- **Repository**: https://github.com/Team-Sankalp/Demo
- **Organization**: https://github.com/orgs/Team-Sankalp/repositories

---

**Built with ❤️ by Team Sankalp**