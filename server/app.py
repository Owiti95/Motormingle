#!/usr/bin/env python3

# Remote library imports
from flask import Flask, request, session
from flask_restful import Api, Resource
from flask_migrate import Migrate
from flask_cors import CORS


# Local imports
from config import db
from models import User, Event, RSVP, Category

# Initialize the Flask app
app = Flask(__name__)

app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///../instance/app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)

# Initialize the database and migration
db.init_app(app)
migrate = Migrate(app, db)

# Initialize Flask-RESTful and Bcrypt
api = Api(app)


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

# Event list for non-admins
class EventList(Resource):
    def get(self):
        events = Event.query.all()
        # Use limited serialization to avoid circular references
        return [event.to_dict(rules=('-rsvps.event', '-categories.events')) for event in events], 200

class EventDetail(Resource):
    def get(self, event_id):
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}, 404
        
        # Serialize the event data, you can customize this depending on your model
        return event.to_dict(rules=('-rsvps.event', '-categories.events')), 200
    
# RSVP resource
class RSVPList(Resource):
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
    
    # GET: Retrieve the user's RSVP for the event
    def get(self, event_id):
        user_id = session.get('user_id')  # Get the current user's ID from the session

        if not user_id:
            return {"error": "Unauthorized"}, 401  # Return 401 if the user is not logged in

        # Check if the user has RSVP'd to this event
        rsvp = RSVP.query.filter_by(user_id=user_id, event_id=event_id).first()

        if rsvp:
            # If the RSVP exists, return it in JSON format
            return rsvp.to_dict(), 200
        else:
            # If the RSVP does not exist, return a message indicating so
            return {"message": "No RSVP found for this event"}, 404
        
    def delete(self, event_id):
        user_id = session.get('user_id')  # Get the user ID from the session

        if not user_id:
            return {"error": "Unauthorized"}, 401

        # Find the RSVP entry for this user and event
        rsvp = RSVP.query.filter_by(user_id=user_id, event_id=event_id).first()

        if rsvp:
            db.session.delete(rsvp)
            db.session.commit()
            return {"message": "RSVP canceled successfully"}, 200
        else:
            return {"error": "RSVP not found"}, 404
class UserList(Resource):
    def get(self):
        users =User.query.all()
        return [user.to_dict() for user in users], 200

class CategoryList(Resource):
    def get(self):
        categories = Category.query.all()
        return [category.to_dict() for category in categories], 200

# Admin dashboard for event management
class AdminDashboard(Resource):
    def get(self):
        # Check if the user is an admin
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        # Query all events and RSVPs
        events = Event.query.all()
        rsvps = RSVP.query.all()

        # Serialize events and RSVPs with rules to avoid recursion
        return {
            "events": [event.to_dict(rules=('-rsvps', '-categories')) for event in events],
            "attendees": [rsvp.to_dict(rules=('-event', '-user')) for rsvp in rsvps]
        }, 200

# Admin event creation and management
class AdminEvent(Resource):
    def post(self):
        if not is_admin():
            return {"error": "Admin privileges required"}, 403

        data = request.json
        title = data.get('title')
        description = data.get('description')
        date_of_event = data.get('date_of_event')
        location = data.get('location')
        category_ids = data.get('category_ids', []) 

        event = Event(
            title=title,
            description=description,
            date_of_event=date_of_event,
            location=location,
            user_id=session.get('user_id')
        )

        # Associate categories with the event
        categories = Category.query.filter(Category.id.in_(category_ids)).all()
        event.categories.extend(categories)

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
        return [rsvp.to_dict(rules=('-user', '-event')) for rsvp in rsvps], 200  # Exclude user and event from rsvps


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
api.add_resource(EventDetail,'/events/<int:event_id>')
api.add_resource(CategoryList, '/categories')
api.add_resource(UserList,'/users')
api.add_resource(RSVPList, '/events/<int:event_id>/rsvps')

# Admin routes
api.add_resource(AdminDashboard, '/admin/dashboard')
api.add_resource(AdminEvent, '/admin/dashboard/event/<int:event_id>')
api.add_resource(AdminEventAttendees, '/admin/dashboard/event/<int:event_id>/attendees')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
