
from sqlalchemy.orm import validates
from config import db
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy_serializer import SerializerMixin
import bcrypt

metadata=MetaData()

#create the Flask SQLAlchemy extension
db =SQLAlchemy(metadata=metadata)


class User(db.Model,SerializerMixin):
    __tablename__ = 'users'

    serialize_rules=('-rsvps.users','-events.users',)
    
    id =db.Column(db.Integer,primary_key=True)
    name =db.Column(db.String,nullable=False)
    email =db.Column(db.String,unique=True, nullable=False)
    password_hash =db.Column(db.String,nullable=False) 
    is_admin =db.Column(db.Boolean,default=False)
    
    #one-to-many relationship: one user can have multiple RSVPs
    rsvps=db.relationship('RSVP',back_populates='user')
    
    #one-to-many relationship: one user can create multiple events
    events=db.relationship('Event',back_populates='user')

    
    def set_password(self,password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self,password):
        return bcrypt.check_password_hash(self.password_hash,password)
    
    def __repr__(self):
        return f'<User {self.name},Name:{self.name},Email:{self.email}>'

class Event(db.Model,SerializerMixin):
    __tablename__ = 'events'

    serialize_rules=('-rsvps.events','-category.events')
    
    id =db.Column(db.Integer, primary_key=True)
    title =db.Column(db.String, nullable=False)
    description =db.Column(db.String, nullable=False)
    date_of_event =db.Column(db.DateTime, nullable=False)
    location=db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    
    #one-to-many relationship: one event can have multiple RSVPs
    rsvps=db.relationship('RSVP',back_populates='event')
    
    #one-to-many relationship: one event can has many categories
    categories=db.relationship('Category', back_populates='event')
    
    
    def __repr__(self):
        return f'<Event {self.title},Description:{self.description},date_of_event:{self.date_of_event},location:{self.location}>'

class RSVP(db.Model,SerializerMixin):
    __tablename__ = 'rsvps'

    serialize_rules=('-user.rsvps','event.rsvps')
    
    id=db.Column(db.Integer,primary_key=True)
    status=db.Column(db.String, nullable=False)
    user_id=db.Column(db.Integer,db.ForeignKey('users.id'),nullable=False)
    event_id=db.Column(db.Integer,db.ForeignKey('events.id'),nullable=False)

    #link RSVP to user
    user=db.relationship('User',back_populates='rsvps')

    #link RSVP to event
    event=db.relationship('Event',back_populates='rsvps')

    VALID_STATUSES =['Attending','Not Attending']
    @validates('status')
    def validate_status(self,key,status):
        valid_statuses=['Attending','Not Attending']
        if status not in valid_statuses:
            raise ValueError("Status must be 'Attending','Not Attending'")
        return status
    
    def __repr__(self):
        return f'<RSVP {self.status} by User {self.user_id} for Event {self.event_id}>'


class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    serialize_rules=('-event.categories',)


    id =db.Column(db.Integer,primary_key=True)
    name =db.Column(db.String,unique=True, nullable=False)
    event_id =db.Column(db.Integer,db.ForeignKey('events.id'),nullable=False)

    #back-populates the relationship to link the category to its event
    event=db.relationship('Event',back_populates='categories')

    def __repr__(self):
        return f'<Category {self.name} for Event {self.event.title}>'