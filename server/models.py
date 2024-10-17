
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
=======


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
=======
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

    serialize_rules = ('-events', '-rsvps.user', '-rsvps.event') # exclude circular references when serializing
    
    # Define columns in the users table
    id = db.Column(db.Integer, primary_key=True)  # Primary key as unique identifier
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)  # password hash for secure storagerequired
    is_admin = db.Column(db.Boolean, default=False)  # Boolean field to check if the user is an admin
    
   
    # one user can have multiple RSVPs (One-to-Many relationship)
    rsvps = db.relationship('RSVP', back_populates='user')
    
    # one user can create multiple events (One-to-Many relationship)
    events = db.relationship('Event', back_populates='user')



    # Email validation method
    @validates('email')
    def validate_email(self, key, email):
        # Regular expression for validating an email
        valid_email = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if not re.match(valid_email, email):
            raise ValueError("Invalid email")
        return email



    # method to set password (hashes the password using bcrypt)
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    # method to check if the entered password matches the hashed password
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    # string representation of the User object
    def __repr__(self):
        return f'<User {self.name}, Name: {self.name}, Email: {self.email}>'

# Association table for the Many-to-Many relationship between Event and Category
# This table has two columns: event_id and category_id, both of which are foreign keys that form the composite primary key
event_categories = Table('event_categories', db.Model.metadata,
    db.Column('event_id', db.Integer, db.ForeignKey('events.id'), primary_key=True),  # Foreign key to the events table
    db.Column('category_id', db.Integer, db.ForeignKey('categories.id'), primary_key=True)  # Foreign key to the categories table
)


class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'

    serialize_rules = ('-user.events', '-rsvps.event', '-categories.events')
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    date_of_event = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # foreign key linking to the user who created the event

    # one event can have multiple RSVPs (one-to-many relationship)
    rsvps = db.relationship('RSVP', back_populates='event')  # Connects Event with RSVP
    
    # many-to-many relationship between event and category
    categories = db.relationship('Category', secondary=event_categories, back_populates='events')

    # adding back_populates to define the inverse relationship with the user
    user = db.relationship('User', back_populates='events')

    def __repr__(self):
        return f'<Event {self.title}, Description: {self.description}, Date of Event: {self.date_of_event}, Location: {self.location}>'


class RSVP(db.Model, SerializerMixin):
    __tablename__ = 'rsvps'

    serialize_rules = ('-user.rsvps', '-event.rsvps', '-user.events')
    
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False)  # RSVP status
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # foreign key linking to the user who RSVPed
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)  # foreign key linking to the event

    
    # RSVP is linked to User (many-to-one relationship)
    user = db.relationship('User', back_populates='rsvps')
    
    # RSVP is linked to Event (many-to-one relationship)
    event = db.relationship('Event', back_populates='rsvps')

    # predefined valid statuses for RSVPs
    VALID_STATUSES = ['Attending', 'Not Attending']

    # validation method for RSVP status checks if the provided status is valid
    @validates('status')
    def validate_status(self, key, status):
        if status not in self.VALID_STATUSES:
            raise ValueError("Status must be 'Attending' or 'Not Attending'")
        return status

    def __repr__(self):
        return f'<RSVP {self.status} by User {self.user_id} for Event {self.event_id}>'

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    serialize_rules = ('-events.categories', '-events.user')
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    # many-to-many relationship between category and event
    events = db.relationship('Event', secondary=event_categories, back_populates='categories')


    def __repr__(self):
        return f'<Category {self.name}>'


