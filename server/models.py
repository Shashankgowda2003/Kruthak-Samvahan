from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    interviews = db.relationship('Interview', backref='user', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'is_active': self.is_active
        }

class Interview(db.Model):
    __tablename__ = 'interviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_role = db.Column(db.String(100), nullable=False)
    experience_level = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='completed')
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    
    # Add relationship to Review
    review = db.relationship('Review', backref='interview', lazy=True, uselist=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_role': self.job_role,
            'experience_level': self.experience_level,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'feedback_summary': self.review.feedback_text if self.review else None
        }

class Question(db.Model):
    __tablename__ = 'questions'
    
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer, db.ForeignKey('interviews.id'), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    answer_text = db.Column(db.Text)
    emotion_data = db.Column(db.JSON)  # Store emotion analysis data
    suspicious_count = db.Column(db.Integer, default=0)
    
    def to_dict(self):
        return {
            'id': self.id,
            'interview_id': self.interview_id,
            'question_text': self.question_text,
            'answer_text': self.answer_text,
            'emotion_data': self.emotion_data,
            'suspicious_count': self.suspicious_count
        }

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    interview_id = db.Column(db.Integer, db.ForeignKey('interviews.id'), nullable=False)
    overall_score = db.Column(db.Float)
    technical_score = db.Column(db.Float)
    communication_score = db.Column(db.Float)
    confidence_score = db.Column(db.Float)
    feedback_text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'interview_id': self.interview_id,
            'overall_score': self.overall_score,
            'technical_score': self.technical_score,
            'communication_score': self.communication_score,
            'confidence_score': self.confidence_score,
            'feedback_text': self.feedback_text,
            'created_at': self.created_at.isoformat()
        }