from db import db
from datetime import datetime

class Discount(db.Model):
    __tablename__ = 'discounts'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    plan_id = db.Column(db.Integer, db.ForeignKey('plans.id', ondelete='CASCADE'), nullable=True)
    code = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=True)
    discount_type = db.Column(db.String(20), nullable=False, default='percentage')
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    min_amount = db.Column(db.Numeric(10, 2), nullable=True)
    max_discount = db.Column(db.Numeric(10, 2), nullable=True)
    usage_limit = db.Column(db.Integer, nullable=True)
    used_count = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=True, default=True)
    valid_from = db.Column(db.DateTime, nullable=True)
    valid_until = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    
    # Relationship
    plan = db.relationship('Plan', backref='discounts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'plan_id': self.plan_id,
            'code': self.code,
            'description': self.description,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_amount': float(self.min_amount) if self.min_amount else None,
            'max_discount': float(self.max_discount) if self.max_discount else None,
            'usage_limit': self.usage_limit,
            'used_count': self.used_count,
            'is_active': self.is_active,
            'valid_from': self.valid_from.isoformat() if self.valid_from else None,
            'valid_until': self.valid_until.isoformat() if self.valid_until else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
