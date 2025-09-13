from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from models.users import User
from models.plans import Plan
from models.subscriptions import Subscription
from models.usage import Usage
from models.discounts import Discount
from models.alerts import Alert
from models.audit_logs import AuditLog
from db import db
from datetime import datetime, timedelta
from sqlalchemy import func, desc, and_, or_

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find admin user
        admin_user = User.query.filter_by(email=email, role='admin').first()
        
        if not admin_user or not check_password_hash(admin_user.password_hash, password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Log the login action
        audit_log = AuditLog(
            user_id=admin_user.id,
            action='LOGIN',
            table_name='users',
            record_id=admin_user.id,
            old_values=None,
            new_values={'login_time': datetime.now().isoformat()},
            ip_address=request.remote_addr,
            user_agent=request.headers.get('User-Agent'),
            created_at=datetime.now()
        )
        db.session.add(audit_log)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': admin_user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/dashboard', methods=['GET'])
def admin_dashboard():
    try:
        # Get dashboard statistics
        total_users = User.query.count()
        active_subscriptions = Subscription.query.filter_by(status='active').count()
        total_plans = Plan.query.count()
        monthly_revenue = db.session.query(func.sum(Subscription.price_paid)).filter(
            Subscription.status == 'active',
            Subscription.created_at >= datetime.now().replace(day=1)
        ).scalar() or 0
        
        # Get recent subscriptions
        recent_subscriptions = Subscription.query.join(User).join(Plan).order_by(
            desc(Subscription.created_at)
        ).limit(5).all()
        
        # Get usage statistics
        total_usage = db.session.query(func.sum(Usage.data_used_gb)).scalar() or 0
        
        # Get alerts
        unread_alerts = Alert.query.filter_by(is_read=False).count()
        
        return jsonify({
            'stats': {
                'total_users': total_users,
                'active_subscriptions': active_subscriptions,
                'total_plans': total_plans,
                'monthly_revenue': float(monthly_revenue),
                'total_usage_gb': float(total_usage),
                'unread_alerts': unread_alerts
            },
            'recent_subscriptions': [{
                'id': sub.id,
                'user_name': sub.user.name,
                'plan_name': sub.plan.name,
                'status': sub.status,
                'price_paid': float(sub.price_paid),
                'created_at': sub.created_at.isoformat() if sub.created_at else None
            } for sub in recent_subscriptions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_users():
    try:
        if request.method == 'GET':
            # Get all users with pagination
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            users = User.query.paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                'users': [user.to_dict() for user in users.items],
                'total': users.total,
                'pages': users.pages,
                'current_page': page
            }), 200
            
        elif request.method == 'POST':
            # Create new user
            data = request.get_json()
            
            # Check if email already exists
            if User.query.filter_by(email=data['email']).first():
                return jsonify({'error': 'Email already exists'}), 400
            
            user = User(
                name=data['name'],
                email=data['email'],
                password_hash=generate_password_hash(data['password']),
                role=data.get('role', 'user'),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            db.session.add(user)
            db.session.commit()
            
            # Create alert for user creation
            alert = Alert(
                user_id=user.id,
                type='user_created',
                title='New User Registered',
                message=f'User {user.name} ({user.email}) has been successfully created with role: {user.role}',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({
                'message': 'User created successfully',
                'user': user.to_dict()
            }), 201
            
        elif request.method == 'PUT':
            # Update user
            data = request.get_json()
            user_id = data.get('id')
            
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            old_data = {
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
            
            user.name = data.get('name', user.name)
            user.email = data.get('email', user.email)
            user.role = data.get('role', user.role)
            user.updated_at = datetime.now()
            
            if 'password' in data:
                user.password_hash = generate_password_hash(data['password'])
            
            db.session.commit()
            
            # Create alert for user update
            changes = []
            if old_data['name'] != user.name:
                changes.append(f"name: {old_data['name']} → {user.name}")
            if old_data['email'] != user.email:
                changes.append(f"email: {old_data['email']} → {user.email}")
            if old_data['role'] != user.role:
                changes.append(f"role: {old_data['role']} → {user.role}")
            
            if changes:
                alert = Alert(
                    user_id=user.id,
                    type='user_updated',
                    title='User Profile Updated',
                    message=f'User {user.name} has been updated. Changes: {", ".join(changes)}',
                    is_read=False,
                    created_at=datetime.now()
                )
                db.session.add(alert)
                db.session.commit()
            
            return jsonify({
                'message': 'User updated successfully',
                'user': user.to_dict()
            }), 200
            
        elif request.method == 'DELETE':
            # Delete user
            user_id = request.args.get('id')
            
            user = User.query.get(user_id)
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            user_name = user.name
            user_email = user.email
            
            db.session.delete(user)
            db.session.commit()
            
            # Create alert for user deletion
            alert = Alert(
                user_id=None,  # User is deleted, so no user_id
                type='user_deleted',
                title='User Account Deleted',
                message=f'User {user_name} ({user_email}) has been permanently deleted from the system',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({'message': 'User deleted successfully'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/plans', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_plans():
    try:
        if request.method == 'GET':
            plans = Plan.query.all()
            return jsonify([plan.to_dict() for plan in plans]), 200
            
        elif request.method == 'POST':
            data = request.get_json()
            
            plan = Plan(
                name=data['name'],
                description=data.get('description'),
                monthly_price=data['monthly_price'],
                monthly_quota_gb=data['monthly_quota_gb'],
                is_active=data.get('is_active', True),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            db.session.add(plan)
            db.session.commit()
            
            # Create alert for plan creation
            alert = Alert(
                user_id=None,  # System alert
                type='plan_created',
                title='New Subscription Plan Created',
                message=f'Plan "{plan.name}" has been created with price ${plan.monthly_price} and {plan.monthly_quota_gb}GB quota',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({
                'message': 'Plan created successfully',
                'plan': plan.to_dict()
            }), 201
            
        elif request.method == 'PUT':
            data = request.get_json()
            plan_id = data.get('id')
            
            plan = Plan.query.get(plan_id)
            if not plan:
                return jsonify({'error': 'Plan not found'}), 404
            
            old_data = {
                'name': plan.name,
                'monthly_price': plan.monthly_price,
                'monthly_quota_gb': plan.monthly_quota_gb,
                'is_active': plan.is_active
            }
            
            plan.name = data.get('name', plan.name)
            plan.description = data.get('description', plan.description)
            plan.monthly_price = data.get('monthly_price', plan.monthly_price)
            plan.monthly_quota_gb = data.get('monthly_quota_gb', plan.monthly_quota_gb)
            plan.is_active = data.get('is_active', plan.is_active)
            plan.updated_at = datetime.now()
            
            db.session.commit()
            
            # Create alert for plan update
            changes = []
            if old_data['name'] != plan.name:
                changes.append(f"name: {old_data['name']} → {plan.name}")
            if old_data['monthly_price'] != plan.monthly_price:
                changes.append(f"price: ${old_data['monthly_price']} → ${plan.monthly_price}")
            if old_data['monthly_quota_gb'] != plan.monthly_quota_gb:
                changes.append(f"quota: {old_data['monthly_quota_gb']}GB → {plan.monthly_quota_gb}GB")
            if old_data['is_active'] != plan.is_active:
                changes.append(f"status: {'Active' if old_data['is_active'] else 'Inactive'} → {'Active' if plan.is_active else 'Inactive'}")
            
            if changes:
                alert = Alert(
                    user_id=None,  # System alert
                    type='plan_updated',
                    title='Subscription Plan Updated',
                    message=f'Plan "{plan.name}" has been updated. Changes: {", ".join(changes)}',
                    is_read=False,
                    created_at=datetime.now()
                )
                db.session.add(alert)
                db.session.commit()
            
            return jsonify({
                'message': 'Plan updated successfully',
                'plan': plan.to_dict()
            }), 200
            
        elif request.method == 'DELETE':
            plan_id = request.args.get('id')
            
            plan = Plan.query.get(plan_id)
            if not plan:
                return jsonify({'error': 'Plan not found'}), 404
            
            plan_name = plan.name
            plan_price = plan.monthly_price
            
            db.session.delete(plan)
            db.session.commit()
            
            # Create alert for plan deletion
            alert = Alert(
                user_id=None,  # System alert
                type='plan_deleted',
                title='Subscription Plan Deleted',
                message=f'Plan "{plan_name}" (${plan_price}) has been permanently deleted from the system',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({'message': 'Plan deleted successfully'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/subscriptions', methods=['GET'])
def manage_subscriptions():
    try:
        subscriptions = Subscription.query.join(User).join(Plan).all()
        
        return jsonify([{
            'id': sub.id,
            'user_name': sub.user.name,
            'user_email': sub.user.email,
            'plan_name': sub.plan.name,
            'status': sub.status,
            'start_date': sub.start_date.isoformat() if sub.start_date else None,
            'end_date': sub.end_date.isoformat() if sub.end_date else None,
            'price_paid': float(sub.price_paid),
            'created_at': sub.created_at.isoformat() if sub.created_at else None
        } for sub in subscriptions]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/analytics', methods=['GET'])
def analytics():
    try:
        # Get subscription trends
        subscription_trends = db.session.query(
            func.date(Subscription.created_at).label('date'),
            func.count(Subscription.id).label('count')
        ).group_by(func.date(Subscription.created_at)).all()
        
        # Get plan popularity
        plan_popularity = db.session.query(
            Plan.name,
            func.count(Subscription.id).label('subscription_count')
        ).join(Subscription).group_by(Plan.id).all()
        
        # Get usage statistics
        usage_stats = db.session.query(
            func.avg(Usage.data_used_gb).label('avg_usage'),
            func.max(Usage.data_used_gb).label('max_usage'),
            func.sum(Usage.data_used_gb).label('total_usage')
        ).first()
        
        return jsonify({
            'subscription_trends': [{'date': str(trend.date), 'count': trend.count} for trend in subscription_trends],
            'plan_popularity': [{'name': plan.name, 'count': plan.subscription_count} for plan in plan_popularity],
            'usage_stats': {
                'avg_usage': float(usage_stats.avg_usage) if usage_stats.avg_usage else 0,
                'max_usage': float(usage_stats.max_usage) if usage_stats.max_usage else 0,
                'total_usage': float(usage_stats.total_usage) if usage_stats.total_usage else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/alerts', methods=['GET', 'PUT'])
def manage_alerts():
    try:
        if request.method == 'GET':
            alerts = Alert.query.join(User).order_by(desc(Alert.created_at)).all()
            
            return jsonify([{
                'id': alert.id,
                'user_name': alert.user.name,
                'type': alert.type,
                'title': alert.title,
                'message': alert.message,
                'is_read': alert.is_read,
                'created_at': alert.created_at.isoformat() if alert.created_at else None
            } for alert in alerts]), 200
            
        elif request.method == 'PUT':
            # Mark alert as read
            data = request.get_json()
            alert_id = data.get('id')
            
            alert = Alert.query.get(alert_id)
            if not alert:
                return jsonify({'error': 'Alert not found'}), 404
            
            alert.is_read = True
            db.session.commit()
            
            return jsonify({'message': 'Alert marked as read'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Discount Management Endpoints
@admin_bp.route('/discounts', methods=['GET', 'POST', 'PUT', 'DELETE'])
def manage_discounts():
    try:
        if request.method == 'GET':
            # List all discounts with pagination
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            discounts = Discount.query.paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                'discounts': [{
                    'id': discount.id,
                    'code': discount.code,
                    'description': discount.description,
                    'discount_type': discount.discount_type,
                    'discount_value': float(discount.discount_value),
                    'min_amount': float(discount.min_amount) if discount.min_amount else None,
                    'max_discount': float(discount.max_discount) if discount.max_discount else None,
                    'usage_limit': discount.usage_limit,
                    'used_count': discount.used_count,
                    'is_active': discount.is_active,
                    'valid_from': discount.valid_from.isoformat() if discount.valid_from else None,
                    'valid_until': discount.valid_until.isoformat() if discount.valid_until else None,
                    'plan_id': discount.plan_id,
                    'plan_name': discount.plan.name if discount.plan else None,
                    'created_at': discount.created_at.isoformat() if discount.created_at else None,
                    'updated_at': discount.updated_at.isoformat() if discount.updated_at else None
                } for discount in discounts.items],
                'total': discounts.total,
                'pages': discounts.pages,
                'current_page': page
            }), 200
        
        elif request.method == 'POST':
            # Create new discount
            data = request.get_json()
            
            required_fields = ['code', 'discount_type', 'discount_value']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400
            
            # Check if discount code already exists
            existing_discount = Discount.query.filter_by(code=data['code']).first()
            if existing_discount:
                return jsonify({'error': 'Discount code already exists'}), 400
            
            discount = Discount(
                code=data['code'],
                description=data.get('description'),
                discount_type=data['discount_type'],
                discount_value=data['discount_value'],
                min_amount=data.get('min_amount'),
                max_discount=data.get('max_discount'),
                usage_limit=data.get('usage_limit'),
                is_active=data.get('is_active', True),
                valid_from=datetime.fromisoformat(data['valid_from']) if data.get('valid_from') else None,
                valid_until=datetime.fromisoformat(data['valid_until']) if data.get('valid_until') else None,
                plan_id=data.get('plan_id'),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            db.session.add(discount)
            db.session.commit()
            
            # Create alert for discount creation
            alert = Alert(
                user_id=None,  # System alert
                type='discount_created',
                title='New Discount Code Created',
                message=f'Discount code "{discount.code}" has been created: {discount.discount_type} {discount.discount_value}% off',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({
                'message': 'Discount created successfully',
                'discount': {
                    'id': discount.id,
                    'code': discount.code,
                    'description': discount.description,
                    'discount_type': discount.discount_type,
                    'discount_value': float(discount.discount_value),
                    'is_active': discount.is_active
                }
            }), 201
        
        elif request.method == 'PUT':
            # Update discount
            data = request.get_json()
            discount_id = data.get('id')
            
            if not discount_id:
                return jsonify({'error': 'Discount ID is required'}), 400
            
            discount = Discount.query.get(discount_id)
            if not discount:
                return jsonify({'error': 'Discount not found'}), 404
            
            # Update fields
            if 'code' in data:
                # Check if new code already exists (excluding current discount)
                existing = Discount.query.filter(
                    and_(Discount.code == data['code'], Discount.id != discount_id)
                ).first()
                if existing:
                    return jsonify({'error': 'Discount code already exists'}), 400
                discount.code = data['code']
            
            if 'description' in data:
                discount.description = data['description']
            if 'discount_type' in data:
                discount.discount_type = data['discount_type']
            if 'discount_value' in data:
                discount.discount_value = data['discount_value']
            if 'min_amount' in data:
                discount.min_amount = data['min_amount']
            if 'max_discount' in data:
                discount.max_discount = data['max_discount']
            if 'usage_limit' in data:
                discount.usage_limit = data['usage_limit']
            if 'is_active' in data:
                discount.is_active = data['is_active']
            if 'valid_from' in data:
                discount.valid_from = datetime.fromisoformat(data['valid_from']) if data['valid_from'] else None
            if 'valid_until' in data:
                discount.valid_until = datetime.fromisoformat(data['valid_until']) if data['valid_until'] else None
            if 'plan_id' in data:
                discount.plan_id = data['plan_id']
            
            discount.updated_at = datetime.now()
            db.session.commit()
            
            # Create alert for discount update
            alert = Alert(
                user_id=None,  # System alert
                type='discount_updated',
                title='Discount Code Updated',
                message=f'Discount code "{discount.code}" has been updated successfully',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({'message': 'Discount updated successfully'}), 200
        
        elif request.method == 'DELETE':
            # Delete discount
            discount_id = request.args.get('id')
            
            if not discount_id:
                return jsonify({'error': 'Discount ID is required'}), 400
            
            discount = Discount.query.get(discount_id)
            if not discount:
                return jsonify({'error': 'Discount not found'}), 404
            
            discount_code = discount.code
            
            db.session.delete(discount)
            db.session.commit()
            
            # Create alert for discount deletion
            alert = Alert(
                user_id=None,  # System alert
                type='discount_deleted',
                title='Discount Code Deleted',
                message=f'Discount code "{discount_code}" has been permanently deleted from the system',
                is_read=False,
                created_at=datetime.now()
            )
            db.session.add(alert)
            db.session.commit()
            
            return jsonify({'message': 'Discount deleted successfully'}), 200
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Enhanced User Management with Subscriptions
@admin_bp.route('/users/detailed', methods=['GET'])
def get_detailed_users():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        role_filter = request.args.get('role', '')
        
        query = User.query
        
        # Apply search filter
        if search:
            query = query.filter(
                or_(
                    User.name.ilike(f'%{search}%'),
                    User.email.ilike(f'%{search}%')
                )
            )
        
        # Apply role filter
        if role_filter:
            query = query.filter(User.role == role_filter)
        
        users = query.paginate(page=page, per_page=per_page, error_out=False)
        
        detailed_users = []
        for user in users.items:
            # Get user's subscriptions
            subscriptions = Subscription.query.filter_by(user_id=user.id).all()
            active_subscription = next((sub for sub in subscriptions if sub.status == 'active'), None)
            
            # Get user's usage
            total_usage = db.session.query(func.sum(Usage.data_used_gb)).filter_by(user_id=user.id).scalar() or 0
            
            detailed_users.append({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'updated_at': user.updated_at.isoformat() if user.updated_at else None,
                'subscriptions': [{
                    'id': sub.id,
                    'plan_name': sub.plan.name if sub.plan else None,
                    'status': sub.status,
                    'start_date': sub.start_date.isoformat() if sub.start_date else None,
                    'end_date': sub.end_date.isoformat() if sub.end_date else None,
                    'price_paid': float(sub.price_paid) if sub.price_paid else None
                } for sub in subscriptions],
                'active_subscription': {
                    'id': active_subscription.id,
                    'plan_name': active_subscription.plan.name if active_subscription and active_subscription.plan else None,
                    'status': active_subscription.status if active_subscription else None,
                    'start_date': active_subscription.start_date.isoformat() if active_subscription and active_subscription.start_date else None,
                    'end_date': active_subscription.end_date.isoformat() if active_subscription and active_subscription.end_date else None,
                    'price_paid': float(active_subscription.price_paid) if active_subscription and active_subscription.price_paid else None
                } if active_subscription else None,
                'total_usage_gb': float(total_usage),
                'subscription_count': len(subscriptions)
            })
        
        return jsonify({
            'users': detailed_users,
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Enhanced Analytics
@admin_bp.route('/analytics/detailed', methods=['GET'])
def get_detailed_analytics():
    try:
        # User Analytics
        total_users = User.query.count()
        active_users = User.query.join(Subscription).filter(Subscription.status == 'active').distinct().count()
        new_users_this_month = User.query.filter(
            User.created_at >= datetime.now().replace(day=1)
        ).count()
        
        # Subscription Analytics
        total_subscriptions = Subscription.query.count()
        active_subscriptions = Subscription.query.filter_by(status='active').count()
        cancelled_subscriptions = Subscription.query.filter_by(status='cancelled').count()
        
        # Revenue Analytics
        total_revenue = db.session.query(func.sum(Subscription.price_paid)).scalar() or 0
        monthly_revenue = db.session.query(func.sum(Subscription.price_paid)).filter(
            Subscription.created_at >= datetime.now().replace(day=1)
        ).scalar() or 0
        
        # Usage Analytics
        total_usage = db.session.query(func.sum(Usage.data_used_gb)).scalar() or 0
        average_usage_per_user = total_usage / total_users if total_users > 0 else 0
        
        # Plan Popularity
        plan_stats = db.session.query(
            Plan.name,
            func.count(Subscription.id).label('subscription_count'),
            func.sum(Subscription.price_paid).label('total_revenue')
        ).join(Subscription, Plan.id == Subscription.plan_id).group_by(Plan.id, Plan.name).all()
        
        # Monthly Trends (last 6 months)
        monthly_trends = []
        for i in range(6):
            month_start = datetime.now().replace(day=1) - timedelta(days=30*i)
            month_end = month_start + timedelta(days=30)
            
            month_revenue = db.session.query(func.sum(Subscription.price_paid)).filter(
                and_(
                    Subscription.created_at >= month_start,
                    Subscription.created_at < month_end
                )
            ).scalar() or 0
            
            month_subscriptions = Subscription.query.filter(
                and_(
                    Subscription.created_at >= month_start,
                    Subscription.created_at < month_end
                )
            ).count()
            
            monthly_trends.append({
                'month': month_start.strftime('%b %Y'),
                'revenue': float(month_revenue),
                'subscriptions': month_subscriptions
            })
        
        monthly_trends.reverse()
        
        # Usage Distribution
        usage_ranges = [
            ('0-10 GB', 0, 10),
            ('10-50 GB', 10, 50),
            ('50-100 GB', 100, 100),
            ('100+ GB', 100, 1000)
        ]
        
        usage_distribution = []
        for range_name, min_gb, max_gb in usage_ranges:
            if max_gb == 1000:  # 100+ GB
                count = db.session.query(func.count(Usage.id)).filter(
                    Usage.data_used_gb >= min_gb
                ).scalar()
            else:
                count = db.session.query(func.count(Usage.id)).filter(
                    and_(
                        Usage.data_used_gb >= min_gb,
                        Usage.data_used_gb < max_gb
                    )
                ).scalar()
            
            percentage = (count / total_users * 100) if total_users > 0 else 0
            usage_distribution.append({
                'range': range_name,
                'count': count,
                'percentage': round(percentage, 1)
            })
        
        # Discount Analytics
        total_discounts = Discount.query.count()
        active_discounts = Discount.query.filter_by(is_active=True).count()
        used_discounts = db.session.query(func.sum(Discount.used_count)).scalar() or 0
        
        return jsonify({
            'user_analytics': {
                'total_users': total_users,
                'active_users': active_users,
                'new_users_this_month': new_users_this_month,
                'user_growth_rate': round((new_users_this_month / total_users * 100), 2) if total_users > 0 else 0
            },
            'subscription_analytics': {
                'total_subscriptions': total_subscriptions,
                'active_subscriptions': active_subscriptions,
                'cancelled_subscriptions': cancelled_subscriptions,
                'conversion_rate': round((active_subscriptions / total_users * 100), 2) if total_users > 0 else 0
            },
            'revenue_analytics': {
                'total_revenue': float(total_revenue),
                'monthly_revenue': float(monthly_revenue),
                'average_revenue_per_user': float(total_revenue / total_users) if total_users > 0 else 0,
                'revenue_growth_rate': 12.5  # Placeholder - would calculate from historical data
            },
            'usage_analytics': {
                'total_usage_gb': float(total_usage),
                'average_usage_per_user': float(average_usage_per_user),
                'usage_distribution': usage_distribution
            },
            'plan_analytics': {
                'plan_popularity': [{
                    'plan_name': stat.name,
                    'subscription_count': stat.subscription_count,
                    'total_revenue': float(stat.total_revenue) if stat.total_revenue else 0
                } for stat in plan_stats]
            },
            'trends': {
                'monthly_revenue_trend': monthly_trends,
                'monthly_subscription_trend': monthly_trends
            },
            'discount_analytics': {
                'total_discounts': total_discounts,
                'active_discounts': active_discounts,
                'used_discounts': int(used_discounts),
                'discount_usage_rate': round((used_discounts / total_discounts * 100), 2) if total_discounts > 0 else 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
