#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import Flask, request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# Local imports
from config import db
from models import User, Event, RSVP, Category

# Initialize the Flask app
app = Flask(__name__)

# Set secret key for sessions
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
CORS(app)

# Initialize the database and migration
db.init_app(app)
migrate = Migrate(app, db)

# Initialize Flask-RESTful
api = Api(app)

# Initialize bcrypt
bcrypt = Bcrypt(app)

# Helper function to check if user is an admin
def is_admin():
    user_id = session.get('user_id')
    if not user_id:
        return False
    user = User.query.get(user_id)
    return user.is_admin

# Resource for registering users
class Register(Resource):
    def post(self):
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return {"error": "Missing required fields"}, 400

        if User.query.filter_by(email=email).first():
            return {"error": "Email already exists"}, 400

        user = User(name=name, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return user.to_dict(), 201

# Resource for login
class Login(Resource):
    def post(self):
        data = request.json
        email = data.get('email')
        password = data.get('password')

        user = User.query.filter_by(email=email).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return {"message": "Login successful", "user": user.to_dict()}, 200
        else:
            return {"error": "Invalid credentials"}, 401

# Resource for event management (non-admin)
class EventList(Resource):
    def get(self):
        events = Event.query.all()
        return [event.to_dict() for event in events], 200

# Resource for RSVP (non-admin)
class RSVPList(Resource):

    def get(self, event_id):
        # Retrieve RSVPs for the given event_id
        rsvps = RSVP.query.filter_by(event_id=event_id).all()
        return [rsvp.to_dict() for rsvp in rsvps], 200
    
    
    def post(self, event_id):
        data = request.json
        status = data.get('status')
        user_id = session.get('user_id')

        if not user_id:
            return {"error": "Unauthorized"}, 401

        rsvp = RSVP.query.filter_by(user_id=user_id, event_id=event_id).first()

        if not rsvp:
            rsvp = RSVP(status=status, user_id=user_id, event_id=event_id)
            db.session.add(rsvp)
        else:
            rsvp.status = status

        db.session.commit()
        return rsvp.to_dict(), 201

# Admin-specific dashboard for managing events and attendees
class AdminDashboard(Resource):
    def get(self):
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        events = Event.query.all()
        rsvps = RSVP.query.all()

        return {
            "events": [event.to_dict() for event in events],
            "attendees": [rsvp.to_dict() for rsvp in rsvps]
        }, 200

# Admin-specific route for event management
class AdminEvent(Resource):
    def post(self):
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        data = request.json
        title = data.get('title')
        description = data.get('description')
        date_of_event = data.get('date_of_event')
        location = data.get('location')
        category_id = data.get('category_id')

        event = Event(
            title=title,
            description=description,
            date_of_event=date_of_event,
            location=location,
            category_id=category_id,
            user_id=session.get('user_id')
        )
        db.session.add(event)
        db.session.commit()

        return event.to_dict(), 201

    def patch(self, event_id):
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        data = request.json
        event = Event.query.get(event_id)

        if not event:
            return {"error": "Event not found"}, 404

        event.title = data.get('title', event.title)
        event.description = data.get('description', event.description)
        event.date_of_event = data.get('date_of_event', event.date_of_event)
        event.location = data.get('location', event.location)

        db.session.commit()
        return event.to_dict(), 200

    def delete(self, event_id):
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        event = Event.query.get(event_id)
        if event:
            db.session.delete(event)
            db.session.commit()
            return {"message": "Event deleted"}, 200
        else:
            return {"error": "Event not found"}, 404

# Admin-specific route for viewing attendees
class AdminEventAttendees(Resource):
    def get(self, event_id):
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        rsvps = RSVP.query.filter_by(event_id=event_id).all()
        return [rsvp.to_dict() for rsvp in rsvps], 200

# Resource for logout
class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        return {"message": "Logged out"}, 200

# Add the API resources to the app
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(EventList, '/events')
api.add_resource(RSVPList, '/events/<int:event_id>/rsvps')

# Admin routes
api.add_resource(AdminDashboard, '/admin/dashboard')
api.add_resource(AdminEvent, '/admin/dashboard/event/<int:event_id>')
api.add_resource(AdminEventAttendees, '/admin/dashboard/event/<int:event_id>/attendees')

if __name__ == '__main__':
    app.run(port=5555, debug=True)