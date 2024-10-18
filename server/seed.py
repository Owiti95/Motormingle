from config import db
from app import app
from models import User, Event, RSVP, Category
from datetime import datetime, time
from flask_bcrypt import Bcrypt

# Initialize Bcrypt for password hashing
bcrypt = Bcrypt()

print("Starting seed...")

# Use the application context to access the database
with app.app_context():
    # Drop all existing tables and create new ones
    db.drop_all()
    db.create_all()
    print("Created all tables.")

    # Create users manually
    try:
        users = [
            User(name="Purity", email="purity@example.com", password_hash=bcrypt.generate_password_hash("password").decode('utf-8')),
            User(name="Hannington", email="hannington@example.com", password_hash=bcrypt.generate_password_hash("password").decode('utf-8')),
            User(name="Isaac", email="isaac@example.com", password_hash=bcrypt.generate_password_hash("password").decode('utf-8')),
            User(name="Elsie", email="elsie@example.com", password_hash=bcrypt.generate_password_hash("password").decode('utf-8')),
            User(name="Baimet", email="baimet@example.com", password_hash=bcrypt.generate_password_hash("password").decode('utf-8')),
            User(name="AdminUser", email="adminuser@example.com", password_hash=bcrypt.generate_password_hash("password").decode('utf-8'), is_admin=True),
        ]
        
        # Add all users to the session and commit
        db.session.add_all(users)
        db.session.commit()
        print("Users added successfully.")
    except Exception as e:
        print(f"Error creating users: {e}")

    # Create events manually
    try:
        events = [
            Event(
                title="Formula 1 Tournament",
                description="Join fellow motorsport enthusiasts for an experience of Formula 1 excitement simulation",
                date_of_event=datetime(2024, 11, 1),
                time=time(19, 0),  # New time added
                location="Gamers Arcade",
                available_tickets=100,
                booked_tickets=98,
                user_id=1
            ),
            Event(
                title="Off Road Adventure",
                description="An off-road adventure with 4x4 vehicles",
                date_of_event=datetime(2024, 11, 15),
                time=time(10, 30),  # New time added
                location="Lodwar",
                available_tickets=50,
                booked_tickets=7,
                user_id=2
            ),
            Event(
                title="Car Auction",
                description="Get the best deals",
                date_of_event=datetime(2024, 12, 10),
                time=time(16, 0),  # New time added
                location="Nairobi",
                available_tickets=200,
                booked_tickets=130,
                user_id=3
            ),
            Event(
                title="Expo",
                description="Explore and discover",
                date_of_event=datetime(2024, 12, 5),
                time=time(12, 0),  # New time added
                location="Nairobi",
                available_tickets=75,
                booked_tickets=15,
                user_id=4
            ),
            Event(
                title="Tournament",
                description="Top drivers compete",
                date_of_event=datetime(2024, 12, 20),
                time=time(9, 0),  # New time added
                location="Kisumu",
                available_tickets=30,
                booked_tickets=4,
                user_id=5
            ),
        ]
        
        # Add events to the session and print formatted time
        for event in events:
            db.session.add(event)
            print(f"Added event: {event.title}, Time: {event.time.strftime('%H:%M')}")  # Print formatted time
        
        # Commit events to the database
        db.session.commit()
        print("Events added successfully.")
    except Exception as e:
        print(f"Error creating events: {e}")

    # Create RSVPs manually
    try:
        rsvps = [
            RSVP(status="Attending", user_id=1, event_id=1),
            RSVP(status="Not Attending", user_id=2, event_id=2),
            RSVP(status="Attending", user_id=3, event_id=3),
            RSVP(status="Attending", user_id=4, event_id=4),
            RSVP(status="Not Attending", user_id=5, event_id=5),
        ]
        
        # Add RSVPs to the session and commit
        db.session.add_all(rsvps)
        db.session.commit()
        print("RSVPs added successfully.")
    except Exception as e:
        print(f"Error creating RSVPs: {e}")

    # Create categories manually
    try:
        categories = [
            Category(name="Competition"),
            Category(name="Sales"),
            Category(name="Show"),
            Category(name="Experience"),
            Category(name="Gaming"),
        ]
        
        # Add categories to the session and commit
        db.session.add_all(categories)
        db.session.commit()
        print("Categories added successfully.")
    except Exception as e:
        print(f"Error creating categories: {e}")

    # Associate events and categories
    try:
        event_category_associations = [
            (1, 5),
            (2, 4),
            (3, 2),
            (4, 3),
            (5, 1),
        ]

        # Loop through associations and append categories to events
        for event_id, category_id in event_category_associations:
            event = db.session.get(Event, event_id)  # Use session.get instead of Event.query.get
            category = db.session.get(Category, category_id)
            if event and category:
                event.categories.append(category)  # Add category to event

        # Commit associations to the database
        db.session.commit()
        print("Events and categories associated successfully.")
    except Exception as e:
        print(f"Error associating events and categories: {e}")

print("Seeded the database successfully.")
