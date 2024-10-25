
# MotorMingle

## Description
MotorMingle is an Event Management System designed to facilitate the organization and participation in various events. It provides a user-friendly interface for both attendees and admins, allowing seamless event creation, RSVP management, and administrative oversight.

## Features
- **User Management**: Users can register, log in, and manage their profiles.
- **Event Management**: Users can create, update, and delete events, while admins can manage all events and users.
- **RSVP Functionality**: Users can RSVP to events and update their status (Attending/Not Attending).
- **Categories**: Events can be categorized, making it easier for users to find relevant events.
- **Admin Dashboard**: A comprehensive dashboard for admins to monitor events and attendees.
- **Email Validation**: Ensures that users provide valid email addresses during registration.
- **Secure Authentication**: Passwords are hashed for security, ensuring user data protection.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used
### Backend
- **Framework**: Flask, Flask-Restful
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Authentication**: Flask-Bcrypt
- **CORS**: Flask-CORS
- **Serialization**: sqlalchemy-serializer
- **Migrations**: Flask-Migrate

### Frontend
- **Framework**: React
- **Routing**: React Router
- **State Management**: Context API
- **Styling**: CSS, for responsive design
- **API Communication**:Fetch API for making HTTP requests to the backend

## Installation Instructions
### Backend
1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   ```
2. **Navigate to the project directory**:
   ```bash
   cd <your-project-directory>
   ```
3.**Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
5. **Initialize the database** (if using migrations):
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```
6. **Start the Flask server**:
   ```bash
   flask run
   ```

### Frontend
1. **Navigate to the frontend directory**:
   ```bash
   cd <frontend-directory>
   ```
2. **Install frontend dependencies**:
   ```bash
   npm install
   ```
3. **Start the React application**:
   ```bash
   npm start
   ```

## API Endpoints
### User Endpoints
- **Register**: `POST /register` - Register a new user.
- **Login**: `POST /login` - Authenticate a user.
- **Logout**: `POST /logout` - Log out the current user.

### Event Endpoints
- **Get All Events**: `GET /events` - Retrieve a list of all events.
- **Get Event Details**: `GET /events/<event_id>` - Retrieve details of a specific event.
- **RSVP to Event**: `POST /events/<event_id>/rsvps` - RSVP to a specific event.
- **Get User RSVPs**: `GET /events/my-rsvps` - Retrieve RSVPs for the logged-in user.

### Admin Endpoints
- **Admin Dashboard**: `GET /admin/dashboard` - View all events and RSVPs.
- **Create Event**: `POST /admin/dashboard/event` - Create a new event.
- **Update Event**: `PATCH /admin/dashboard/event/<event_id>` - Update details of an existing event.
- **Delete Event**: `DELETE /admin/dashboard/event/<event_id>` - Delete a specific event.
- **Check Admin Status**: `GET /check-admin-status` - Verify if the current user has admin privileges.

## Models

### User
- **Attributes**:
  - `id`: Unique identifier (Primary Key).
  - `name`: User's name.
  - `email`: Unique email address.
  - `password_hash`: Hashed password for secure storage.
  - `is_admin`: Boolean flag indicating admin status.
- **Relationships**:
  - One user can have multiple RSVPs (One-to-Many).
  - One user can create multiple events (One-to-Many).

### Event
- **Attributes**:
  - `id`: Unique identifier (Primary Key).
  - `title`: Title of the event.
  - `description`: Description of the event.
  - `date_of_event`: Date of the event.
  - `location`: Location of the event.
  - `image_url`: URL for the event image.
  - `user_id`: Foreign key linking to the creator (User).
  - `category_id`: Foreign key linking to the event's category.
  - `time`: Scheduled time for the event.
  - `booked_tickets`: Number of tickets booked.
  - `available_tickets`: Number of tickets available.
- **Relationships**:
  - One event can have multiple RSVPs (One-to-Many).
  - Many events can belong to multiple categories (Many-to-Many).

### RSVP
- **Attributes**:
  - `id`: Unique identifier (Primary Key).
  - `status`: Status of the RSVP (e.g., Attending, Not Attending).
  - `user_id`: Foreign key linking to the user who RSVP'd.
  - `event_id`: Foreign key linking to the event.
- **Relationships**:
  - Each RSVP is linked to one user and one event (Many-to-One).

### Category
- **Attributes**:
  - `id`: Unique identifier (Primary Key).
  - `name`: Unique name for the category.
- **Relationships**:
  - Many categories can be associated with many events (Many-to-Many).

## Usage
- Start the Flask server and the React application. Access the frontend at `http://localhost:3000`.
- The frontend interacts with the API hosted at `http://localhost:5555`.
- Users can register, log in, view events, RSVP, and manage events based on their role (attendee or admin).

## Contributing
Contributions are welcome! Please fork the repository, create a new branch for your feature or bug fix, and submit a pull request. Ensure your code adheres to the project's coding standards.

## Acknowledgments
- Thank you to the open-source community for the libraries and frameworks used in this project.
- Special thanks to all contributors who help improve the project.
