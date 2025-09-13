from db import db
from datetime import datetime

class Plan(db.Model):
    __tablename__ = 'plans'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    monthly_price = db.Column(db.Numeric(10, 2), nullable=False)
    monthly_quota_gb = db.Column(db.Integer, nullable=False)
    is_active = db.Column(db.Boolean, nullable=True)
    created_at = db.Column(db.DateTime, nullable=True)
    updated_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    subscriptions = db.relationship('Subscription', backref='plan', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'monthly_price': float(self.monthly_price),
            'monthly_quota_gb': self.monthly_quota_gb,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
