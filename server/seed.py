from config import db
from app import app
from models import User, Event, RSVP, Category
from datetime import datetime
from flask_bcrypt import Bcrypt
from faker import Faker  
# Instantiate Faker
fake = Faker()

bcrypt = Bcrypt()

print("Starting seed...")

with app.app_context():
    db.drop_all()
    db.create_all()
    print("Created all tables.")

    # Create users
    try:
        users = []
        for _ in range(5):  # Create 5 random users
            user = User(
                name=fake.name(),
                email=fake.email(),
                password_hash=bcrypt.generate_password_hash("password").decode('utf-8')
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()
        print("Users added successfully.")
    except Exception as e:
        print(f"Error creating users: {e}")

    # Create events without category_id
    try:
        events = []
        for _ in range(5):  # Create 5 random events
            event = Event(
                title=fake.catch_phrase(),
                description=fake.text(),
                date_of_event=fake.future_datetime(end_date="+30d"),
                location=fake.city(),
                user_id=fake.random_element(elements=[1, 2, 3, 4, 5])  # Associate with random user
            )
            events.append(event)
        db.session.add_all(events)
        db.session.commit()
        print("Events added successfully.")
    except Exception as e:
        print(f"Error creating events: {e}")

    # Create RSVPs
    try:
        rsvps = []
        for _ in range(5):  # Create 5 random RSVPs
            rsvp = RSVP(
                status=fake.random_element(elements=["Attending", "Not Attending"]),
                user_id=fake.random_element(elements=[1, 2, 3, 4, 5]),  # Associate with random user
                event_id=fake.random_element(elements=[1, 2, 3, 4, 5])  # Associate with random event
            )
            rsvps.append(rsvp)
        db.session.add_all(rsvps)
        db.session.commit()
        print("RSVPs added successfully.")
    except Exception as e:
        print(f"Error creating RSVPs: {e}")

    # Create categories without event_id
    try:
        categories = []
        for _ in range(5):  # Create 5 random categories
            category = Category(
                name=fake.word().capitalize()
            )
            categories.append(category)
        db.session.add_all(categories)
        db.session.commit()
        print("Categories added successfully.")
    except Exception as e:
        print(f"Error creating categories: {e}")

    # Associate events and categories
    try:
        for i in range(1, 6):
            event = Event.query.get(i)
            category = Category.query.get(fake.random_int(min=1, max=5))
            event.categories.append(category)
        db.session.commit()
        print("Events and categories associated successfully.")
    except Exception as e:
        print(f"Error associating events and categories: {e}")

print("Seeded the database successfully.")