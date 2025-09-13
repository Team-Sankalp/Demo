from db import db
from datetime import datetime

class Usage(db.Model):
    __tablename__ = 'usage'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    data_used_gb = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'data_used_gb': float(self.data_used_gb),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
