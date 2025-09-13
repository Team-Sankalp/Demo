from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
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
    CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'], supports_credentials=True)
    
    # Register blueprints
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(user_bp, url_prefix='/user')
    
    # Create tables and insert demo data
    with app.app_context():
        db.create_all()
        create_demo_data()
    
    return app

def create_demo_data():
    """Create demo admin and user if they don't exist"""
    # Create demo admin user
    admin_user = User.query.filter_by(email='admin@example.com').first()
    if not admin_user:
        admin_user = User(
            name='Admin User',
            email='admin@example.com',
            password_hash=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(admin_user)
        print("Demo admin user created: admin@example.com / admin123")
    
    # Create demo regular user
    demo_user = User.query.filter_by(email='user@example.com').first()
    if not demo_user:
        demo_user = User(
            name='Demo User',
            email='user@example.com',
            password_hash=generate_password_hash('user123'),
            role='user'
        )
        db.session.add(demo_user)
        print("Demo user created: user@example.com / user123")
    
    # Create demo plans
    basic_plan = Plan.query.filter_by(name='Basic Plan').first()
    if not basic_plan:
        basic_plan = Plan(
            name='Basic Plan',
            description='Perfect for light users with basic data needs',
            monthly_price=29.99,
            monthly_quota_gb=10,
            is_active=True
        )
        db.session.add(basic_plan)
        print("Demo Basic Plan created")
    
    premium_plan = Plan.query.filter_by(name='Premium Plan').first()
    if not premium_plan:
        premium_plan = Plan(
            name='Premium Plan',
            description='Ideal for heavy users with unlimited data',
            monthly_price=59.99,
            monthly_quota_gb=100,
            is_active=True
        )
        db.session.add(premium_plan)
        print("Demo Premium Plan created")
    
    # Create demo subscription for the user
    if demo_user and basic_plan:
        demo_subscription = Subscription.query.filter_by(user_id=demo_user.id).first()
        if not demo_subscription:
            demo_subscription = Subscription(
                user_id=demo_user.id,
                plan_id=basic_plan.id,
                status='active',
                start_date=datetime.now().date(),
                end_date=None,
                price_paid=29.99
            )
            db.session.add(demo_subscription)
            print("Demo subscription created for user")
    
    db.session.commit()
    print("Demo data setup completed!")

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5001)
