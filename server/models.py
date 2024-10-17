from sqlalchemy.ext.associationproxy import association_proxy  # Helps create a proxy to simplify many-to-many relationships
from sqlalchemy.orm import validates  # Provides validation hooks for model attributes
from config import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData, Table  # MetaData for schema definition & table for defining association tables
from sqlalchemy_serializer import SerializerMixin
from flask_bcrypt import Bcrypt
import re


bcrypt = Bcrypt()
metadata = MetaData()

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    
    # Relationships
    rsvps = db.relationship('RSVP', back_populates='user', cascade="all, delete-orphan")
    events = db.relationship('Event', back_populates='user', cascade="all, delete-orphan")
    
    # Serialization rules to avoid circular references
    serialize_rules = ('-rsvps.user', '-events.user', '-rsvps.event')

    # Email validation method
    @validates('email')
    def validate_email(self, key, email):
        # Regular expression for validating an email
        valid_email = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(valid_email, email):
            raise ValueError("Invalid email")
        return email

    # Method to set password (hashes the password using bcrypt)
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # Method to check if the entered password matches the hashed password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    # String representation of the User object
    def _repr_(self):
        return f'<User {self.name}, Name: {self.name}, Email: {self.email}>'


# Association table for the Many-to-Many relationship between Event and Category
event_categories = Table('event_categories', db.Model.metadata,
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True),  # Foreign key to the events table
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)  # Foreign key to the categories table
)


class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', back_populates='events')
    rsvps = db.relationship('RSVP', back_populates='event', cascade="all, delete-orphan")
    
    # Avoiding circular references in serialization
    serialize_rules = ('-user.events', '-rsvps.event', '-categories')
    def _repr_(self):
        return f'<Event {self.title}, Description: {self.description}, Date of Event: {self.date_of_event}, Location: {self.location}>'


class RSVP(db.Model, SerializerMixin):
    __tablename__ = 'rsvps'
    
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(20), nullable=False)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    
    # Relationships
    user = db.relationship('User', back_populates='rsvps')
    event = db.relationship('Event', back_populates='rsvps')
    
    # Avoiding circular references in serialization
    serialize_rules = ('-user.rsvps', '-event.rsvps')

    # Validation for status field
    VALID_STATUSES = ['Attending', 'Not Attending']
    
    @validates('status')
    def validate_status(self, key, status):
        if status not in self.VALID_STATUSES:
            raise ValueError("Status must be 'Attending' or 'Not Attending'")
        return status

    def _repr_(self):
        return f'<RSVP {self.status} by User {self.user_id} for Event {self.event_id}>'


class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    
    # Avoiding circular references in serialization
    serialize_rules = ('-events',)

    events = db.relationship('Event', back_populates='category')

    def _repr_(self):
        return f'<Category {self.name}>'