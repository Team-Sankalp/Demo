from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os

from config import Config
from db import db
from models.users import User
from models.plans import Plan
from models.subscriptions import Subscription
from models.usage import Usage
from models.discounts import Discount
from models.audit_logs import AuditLog
from models.alerts import Alert

from routes.admin_routes import admin_bp
from routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    
    # Create tables and insert demo data
    with app.app_context():
        db.create_all()
        create_demo_data()
    
    return app

def create_demo_data():
    """Create demo data if tables are empty"""
    try:
        # Check if data already exists
        if User.query.count() > 0:
            print("Demo data already exists, skipping creation.")
            return
            
        print("Creating demo data...")
        
        # Create demo admin user
        admin_user = User(
            name='Admin User',
            email='admin@example.com',
            password_hash=generate_password_hash('admin123'),
            role='admin',
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(admin_user)
        
        # Create demo regular user
        demo_user = User(
            name='Demo User',
            email='user@example.com',
            password_hash=generate_password_hash('user123'),
            role='user',
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(demo_user)
        
        # Create demo plans
        basic_plan = Plan(
            name='Basic Plan',
            description='Perfect for light users with basic data needs',
            monthly_price=29.99,
            monthly_quota_gb=10,
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(basic_plan)
        
        premium_plan = Plan(
            name='Premium Plan',
            description='Ideal for heavy users with unlimited data',
            monthly_price=59.99,
            monthly_quota_gb=100,
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(premium_plan)
        
        # Commit users and plans first to get IDs
        db.session.commit()
        
        # Create demo subscription for the user
        demo_subscription = Subscription(
            user_id=demo_user.id,
            plan_id=basic_plan.id,
            status='active',
            start_date=datetime.now().date(),
            end_date=None,
            price_paid=29.99,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(demo_subscription)
        
        # Create demo usage data
        usage1 = Usage(
            user_id=demo_user.id,
            date=datetime.now().date(),
            data_used_gb=5.2,
            created_at=datetime.now()
        )
        db.session.add(usage1)
        
        usage2 = Usage(
            user_id=demo_user.id,
            date=(datetime.now().date() - datetime.timedelta(days=1)),
            data_used_gb=3.8,
            created_at=datetime.now()
        )
        db.session.add(usage2)
        
        # Create demo alerts
        alert1 = Alert(
            user_id=admin_user.id,
            type='info',
            title='System Update',
            message='Database migration completed successfully',
            is_read=False,
            created_at=datetime.now()
        )
        db.session.add(alert1)
        
        alert2 = Alert(
            user_id=demo_user.id,
            type='warning',
            title='Data Usage Alert',
            message='You have used 80% of your monthly quota',
            is_read=False,
            created_at=datetime.now()
        )
        db.session.add(alert2)
        
        # Create demo discount
        discount = Discount(
            plan_id=basic_plan.id,
            discount_percentage=20.00,
            discount_code='SAVE20',
            description='20% off Basic Plan for new users',
            start_date=datetime.now().date(),
            end_date=(datetime.now().date() + datetime.timedelta(days=30)),
            is_active=True,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        db.session.add(discount)
        
        # Create demo audit log
        audit_log = AuditLog(
            user_id=admin_user.id,
            action='CREATE',
            table_name='users',
            record_id=admin_user.id,
            old_values=None,
            new_values={'name': 'Admin User', 'email': 'admin@example.com'},
            ip_address='127.0.0.1',
            user_agent='Mozilla/5.0',
            created_at=datetime.now()
        )
        db.session.add(audit_log)
        
        db.session.commit()
        print("✅ Demo data created successfully!")
        print("📧 Admin: admin@example.com / admin123")
        print("👤 User: user@example.com / user123")
        
    except Exception as e:
        print(f"❌ Error creating demo data: {e}")
        db.session.rollback()

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
