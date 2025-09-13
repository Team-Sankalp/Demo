from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models.users import User
from models.audit_logs import AuditLog
from db import db
from datetime import datetime

user_bp = Blueprint('user', __name__)

@user_bp.route('/signup', methods=['POST'])
def user_signup():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        if not all([name, email, password]):
            return jsonify({'error': 'Name, email, and password are required'}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Create new user
        new_user = User(
            name=name,
            email=email,
            password_hash=generate_password_hash(password),
            role='user'
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Log the signup action
        audit_log = AuditLog(
            user_id=new_user.id,
            action='user_signup',
            details=f'New user registered: {email}'
        )
        db.session.add(audit_log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': new_user.to_dict(),
            'redirect_url': '/user/dashboard'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@user_bp.route('/login', methods=['POST'])
def user_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(email=email, role='user').first()
        
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Log the login action
        audit_log = AuditLog(
            user_id=user.id,
            action='user_login',
            details=f'User login from IP: {request.remote_addr}'
        )
        db.session.add(audit_log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict(),
            'redirect_url': '/user/dashboard'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Placeholder routes for future development
@user_bp.route('/dashboard', methods=['GET'])
def user_dashboard():
    return jsonify({'message': 'User dashboard - to be implemented'}), 200

@user_bp.route('/subscriptions', methods=['GET', 'POST'])
def my_subscriptions():
    return jsonify({'message': 'My subscriptions - to be implemented'}), 200

@user_bp.route('/recommendations', methods=['GET'])
def plan_recommendations():
    return jsonify({'message': 'Plan recommendations - to be implemented'}), 200

@user_bp.route('/usage', methods=['GET'])
def usage_history():
    return jsonify({'message': 'Usage history - to be implemented'}), 200

@user_bp.route('/billing', methods=['GET'])
def billing():
    return jsonify({'message': 'Billing - to be implemented'}), 200
