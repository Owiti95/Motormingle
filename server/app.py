#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS
from flask_bcrypt import Bcrypt

# Local imports
from config import db, app, api

# Set secret key for sessions
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/events.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize bcrypt
bcrypt = Bcrypt(app)

# Helper function to check if user is an admin
def is_admin():
    from models import User
    user_id = session.get('user_id')
    if not user_id:
        return False
    user = User.query.get(user_id)
    print("User ID:", user_id, "Is Admin:", user.is_admin if user else "No user found")  # Debugging line
    return user.is_admin if user else False

# Resource for registering users
class Register(Resource):
    def post(self):
        from models import User
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
        from models import User
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
        from models import Event
        events = Event.query.all()
        return [event.to_dict() for event in events], 200

# Resource for event detail
class EventDetail(Resource):
    def get(self, event_id):
        from models import Event
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}, 404
        return event.to_dict(), 200

# Resource for RSVP (non-admin)
class RSVPList(Resource):
    def get(self, event_id):
        from models import RSVP
        rsvps = RSVP.query.filter_by(event_id=event_id).all()
        return [rsvp.to_dict() for rsvp in rsvps], 200
    
    def post(self, event_id):
        from models import RSVP
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
    
class UserRsvps(Resource):
    def get(self):
        from models import RSVP
        user_id = session.get('user_id')

        if not user_id:
            return {"error": "Unauthorized"}, 401

        rsvps = RSVP.query.filter_by(user_id=user_id).all()
        return [rsvp.to_dict() for rsvp in rsvps], 200

# Admin-specific dashboard for managing events and attendees
class AdminDashboard(Resource):
    def get(self):
        from models import Event, RSVP
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        events = Event.query.all()
        rsvps = RSVP.query.all()

        return {
            "events": [event.to_dict() for event in events],
            "attendees": [rsvp.to_dict() for rsvp in rsvps]
        }, 200

# Admin-specific route for managing events
class AdminEvent(Resource):
    def post(self):
        from models import Event
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        data = request.json
        title = data.get('title')
        description = data.get('description')
        date_of_event = data.get('date_of_event')
        location = data.get('location')
        image_url = data.get('image_url')  # Capture image URL
        category_id = data.get('category_id')

        event = Event(
            title=title,
            description=description,
            date_of_event=date_of_event,
            location=location,
            image_url=image_url,  # Save image URL to the event
            category_id=category_id,
            user_id=session.get('user_id')
        )
        db.session.add(event)
        db.session.commit()

        return event.to_dict(), 201

# Admin-specific route for event detail management (PATCH and DELETE)
class AdminEventDetail(Resource):
    def get(self, event_id):
        from models import Event
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}, 404
        return event.to_dict(), 200

    def patch(self, event_id):
        from models import Event
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
        event.image_url = data.get('image_url', event.image_url)  # Update image URL

        db.session.commit()
        return event.to_dict(), 200

    def delete(self, event_id):
        from models import Event
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
        from models import RSVP
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        rsvps = RSVP.query.filter_by(event_id=event_id).all()
        return [rsvp.to_dict() for rsvp in rsvps], 200

# Resource for logout
class Logout(Resource):
    def post(self):
        session.pop('user_id', None)
        return {"message": "Logged out"}, 200
    
class CheckAdminStatus(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            from models import User
            user = User.query.get(user_id)
            if user and user.is_admin:
                return {"isAdmin": True}, 200
        return {"isAdmin": False}, 200


# Add the API resources to the app
api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(EventList, '/events')
api.add_resource(EventDetail, '/events/<int:event_id>')  # New route for fetching an event by ID
api.add_resource(RSVPList, '/events/<int:event_id>/rsvps')
api.add_resource(UserRsvps, '/events/my-rsvps')


# Admin routes
api.add_resource(AdminDashboard, '/admin/dashboard')
api.add_resource(AdminEvent, '/admin/dashboard/event')  # POST for creating new event
api.add_resource(AdminEventDetail, '/admin/dashboard/event/<int:event_id>')  # PATCH and DELETE for specific event
api.add_resource(AdminEventAttendees, '/admin/dashboard/event/<int:event_id>/attendees')
api.add_resource(CheckAdminStatus, '/check-admin-status')
if __name__ == '__main__':
    app.run(port=5555, debug=True)
