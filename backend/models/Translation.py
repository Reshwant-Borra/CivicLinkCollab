from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum

Base = declarative_base()

class LanguageEnum(str, Enum):
    SPANISH = "es"
    CHINESE = "zh"
    ARABIC = "ar"
    HINDI = "hi"
    KOREAN = "ko"
    VIETNAMESE = "vi"
    TAGALOG = "tl"

class CategoryEnum(str, Enum):
    VOTING = "voting"
    REGISTRATION = "registration"
    IDENTIFICATION = "identification"
    DEADLINES = "deadlines"
    LOCATIONS = "locations"
    GENERAL = "general"

class DifficultyEnum(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

class Translation(Base):
    __tablename__ = 'translations'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    english = Column(String(500), nullable=False)
    translated = Column(String(500), nullable=False)
    language = Column(String(2), nullable=False)  # Language code
    explanation = Column(Text, nullable=False)
    category = Column(String(20), default='general')
    audio_url = Column(String(500))
    verified = Column(Boolean, default=False)
    verified_by = Column(Integer, ForeignKey('users.id'))
    verified_at = Column(DateTime)
    usage_count = Column(Integer, default=0)
    tags = Column(JSON)  # List of strings
    difficulty = Column(String(20), default='beginner')
    context = Column(Text)
    related_terms = Column(JSON)  # List of translation IDs
    feedback = Column(JSON)  # List of feedback objects
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    verifier = relationship("User", foreign_keys=[verified_by])
    
    def __repr__(self):
        return f"<Translation(id={self.id}, english='{self.english}', language='{self.language}')>"
    
    def to_dict(self):
        """Convert model to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'english': self.english,
            'translated': self.translated,
            'language': self.language,
            'explanation': self.explanation,
            'category': self.category,
            'audio_url': self.audio_url,
            'verified': self.verified,
            'verified_by': self.verified_by,
            'verified_at': self.verified_at.isoformat() if self.verified_at else None,
            'usage_count': self.usage_count,
            'tags': self.tags or [],
            'difficulty': self.difficulty,
            'context': self.context,
            'related_terms': self.related_terms or [],
            'feedback': self.feedback or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def increment_usage(self):
        """Increment usage count"""
        self.usage_count += 1
        return self.usage_count
    
    def add_feedback(self, user_id, helpful, comment=None):
        """Add user feedback to translation"""
        if not self.feedback:
            self.feedback = []
        
        # Check if user already provided feedback
        for fb in self.feedback:
            if fb.get('user_id') == user_id:
                return False  # Feedback already exists
        
        feedback_entry = {
            'user_id': user_id,
            'helpful': helpful,
            'comment': comment,
            'created_at': datetime.utcnow().isoformat()
        }
        
        self.feedback.append(feedback_entry)
        return True
