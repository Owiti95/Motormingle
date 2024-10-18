from config import db
from app import app
from models import User, Event, RSVP, Category
from datetime import datetime
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

print("Starting seed...")

with app.app_context():
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
        
        db.session.add_all(users)
        db.session.commit()
        print("Users added successfully.")
    except Exception as e:
        print(f"Error creating users: {e}")

    # Create events manually
    try:
        events = [
            Event(title="Formula 1 Tournament", description="join fellow motorsport enthusiasts for an experience of Formula 1 excitement simulation", date_of_event=datetime(2024, 11, 1), location="Gamers Arcade", user_id=1),
            Event(title="Off road", description="An off-road adventure with 4x4 vehicles", date_of_event=datetime(2024, 11, 15), location="Lodwar", user_id=2),
            Event(title="Car Auction", description="Get the best deals", date_of_event=datetime(2024, 12, 10), location="Nairobi", user_id=3),
            Event(title="Expo", description="Explore and discover", date_of_event=datetime(2024, 12, 5), location="Nairobi", user_id=4),
            Event(title="Tournament", description="Top drivers compete", date_of_event=datetime(2024, 12, 20), location="Kisumu", user_id=5),
        ]
        db.session.add_all(events)
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
        db.session.add_all(rsvps)
        db.session.commit()
        print("RSVPs added successfully.")
    except Exception as e:
        print(f"Error creating RSVPs: {e}")

    # Create categories manually
    try:
        categories = [
            Category(name="Competition"),
            Category(name="sales"),
            Category(name="show"),
            Category(name="experience"),
            Category(name="Gaming"),
        ]
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

        for event_id, category_id in event_category_associations:
            event = Event.query.get(event_id)
            category = Category.query.get(category_id)
            event.categories.append(category)

        db.session.commit()
        print("Events and categories associated successfully.")
    except Exception as e:
        print(f"Error associating events and categories: {e}")

print("Seeded the database successfully.")