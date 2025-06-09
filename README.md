# Private Jet Booking MVP

This project is a full-stack Minimum Viable Product (MVP) for a private jet booking platform.

## Project Structure

- `frontend/`: Next.js application with Tailwind CSS
- `backend/`: FastAPI application

## Setup and Installation

### Prerequisites

- Node.js (LTS version)
- Python 3.9+
- pnpm (recommended for monorepo)

### 1. Clone the repository

```bash
git clone <repository-url>
cd private-jet-booking
```

### 2. Frontend Setup

Navigate to the `frontend/` directory and install dependencies:

```bash
cd frontend
pnpm install
```

### 3. Backend Setup

Navigate to the `backend/` directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

### 4. Database Setup (Backend)

From the `backend/` directory, run database migrations to create tables:

```bash
python -m alembic upgrade head
```

### 5. Environment Variables

Create a `.env` file in both `frontend/` and `backend/` directories based on the provided `.env.example` files.

**`backend/.env.example`**
```
SECRET_KEY="your-super-secret-key"
DATABASE_URL="sqlite:///./sql_app.db"
```

**`frontend/.env.local.example`**
```
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api"
```

### 6. Running the Applications

#### Frontend

```bash
cd frontend
pnpm dev
```

#### Backend

```bash
cd backend
uvicorn main:app --reload
```

## Backend Overview

The `backend/` directory contains the FastAPI application, serving as the API for the private jet booking platform.

### Detailed Data Models

The application uses SQLAlchemy for ORM with a relational database (SQLite by default). The key data models are defined in `backend/models.py` and have corresponding Pydantic schemas in `backend/schemas.py` for request validation and response serialization.

*   **User**: Manages user accounts, including authentication details, roles (`user` or `admin`), and links to memberships and ownership shares.
    *   `id`: UUID, primary key
    *   `name`: String
    *   `email`: String, unique
    *   `passwordHash`: String
    *   `role`: String, default `user`
    *   `membershipId`: Foreign key to `Membership`

*   **Jet**: Represents a private jet available for booking or fractional ownership.
    *   `id`: UUID, primary key
    *   `name`: String
    *   `type`: String (e.g., `light`, `mid`, `large`)
    *   `baseLocation`: String
    *   `capacity`: Integer
    *   `hourlyRate`: Float
    *   `available`: Boolean, default `True`

*   **Booking**: Stores information about a user's reservation for a jet.
    *   `id`: UUID, primary key
    *   `userId`: Foreign key to `User`
    *   `jetId`: Foreign key to `Jet`
    *   `origin`: String
    *   `destination`: String
    *   `startTime`: DateTime
    *   `endTime`: DateTime
    *   `status`: String (e.g., `booked`, `cancelled`)

*   **Membership**: Defines different membership plans for users, offering benefits like included flight hours and discounted rates.
    *   `id`: UUID, primary key
    *   `name`: String, unique
    *   `hoursIncluded`: Integer
    *   `hourlyRate`: Float
    *   `annualPrice`: Float

*   **OwnershipShare**: Represents a user's fractional ownership of a specific jet, including allocated and remaining flight hours.
    *   `id`: UUID, primary key
    *   `userId`: Foreign key to `User`
    *   `jetId`: Foreign key to `Jet`
    *   `shareFraction`: Float (e.g., 0.0625 for 1/16)
    *   `hoursAllocated`: Integer
    *   `hoursRemaining`: Integer

### API Endpoints

The backend exposes a RESTful API with the following main routers:

*   **Auth (`/api/auth`)**:
    *   `POST /register`: Register a new user.
    *   `POST /login`: Authenticate a user and return a JWT access token.

*   **Jets (`/api/jets`)**:
    *   `GET /`: Search for available jets based on criteria like origin, destination, and date.
    *   `GET /{jet_id}`: Retrieve details of a specific jet.

*   **Bookings (`/api/bookings`)**:
    *   `POST /`: Create a new booking (requires authentication).
    *   `GET /`: Get all bookings for the current authenticated user.
    *   `GET /{booking_id}`: Get details of a specific booking (requires authentication, owner or admin).
    *   `DELETE /{booking_id}`: Cancel a booking (requires authentication, owner or admin).

*   **Memberships (`/api/memberships`)**:
    *   `GET /`: Get all available membership plans.
    *   `POST /enroll`: Enroll a user in a membership plan (requires authentication).
    *   `GET /users/{user_id}/membership`: Get a user's current membership plan (requires authentication, owner or admin).

*   **Ownership Shares (`/api/ownership-shares`)**:
    *   `GET /`: Get all ownership shares for the current authenticated user.
    *   `GET /{share_id}`: Get details of a specific ownership share (requires authentication, owner or admin).
    *   `POST /`: Purchase a new ownership share (requires authentication).

*   **Admin (`/api/admin`)**:
    *   Protected routes for managing users, jets, bookings, and memberships (requires admin role).
        *   `GET /users/`: List all users.
        *   `GET /users/{user_id}`: Get user details.
        *   `PUT /users/{user_id}`: Update user details.
        *   `DELETE /users/{user_id}`: Delete a user.
        *   `GET /jets/`: List all jets.
        *   `POST /jets/`: Create a new jet.
        *   `PUT /jets/{jet_id}`: Update jet details.
        *   `DELETE /jets/{jet_id}`: Delete a jet.
        *   `GET /bookings/`: List all bookings.
        *   `PUT /bookings/{booking_id}`: Update booking details.
        *   `DELETE /bookings/{booking_id}`: Delete a booking.
        *   `GET /memberships/`: List all memberships.
        *   `POST /memberships/`: Create a new membership.
        *   `PUT /memberships/{membership_id}`: Update membership details.
        *   `DELETE /memberships/{membership_id}`: Delete a membership.
        *   `GET /ownership-shares/`: List all ownership shares.
        *   `POST /ownership-shares/`: Create a new ownership share.
        *   `PUT /ownership-shares/{share_id}`: Update ownership share details.
        *   `DELETE /ownership-shares/{share_id}`: Delete an ownership share.

## Frontend Overview

The `frontend/` directory contains the Next.js application, which provides the user interface for the private jet booking platform. It utilizes Tailwind CSS for styling and is structured around modular React components and Next.js's App Router.

### Key Pages and Components

*   **`/` (Home Page)** (`frontend/src/app/page.tsx`):
    *   The main landing page for the application, serving as the entry point for users.
    *   It provides a welcoming message and links to key functionalities like jet search and user authentication.

*   **`/search` (Jet Search Page)** (`frontend/src/app/search/page.tsx`):
    *   Allows users to search for available private jets based on various criteria such as location, dates, and jet type.
    *   Displays search results and provides options to view jet details or proceed with booking.

*   **`/booking` (Booking Page)** (`frontend/src/app/booking/page.tsx`):
    *   Facilitates the booking process for selected jets.
    *   Users can review booking details, enter passenger information, and confirm their reservations.
    *   Integrates with the backend booking API to create new reservations.

*   **`/profile` (User Profile Page)** (`frontend/src/app/profile/page.tsx`):
    *   Displays user-specific information, including personal details, past and upcoming bookings, membership status, and fractional ownership shares.
    *   Allows users to manage their account settings and view their activity.

*   **`/auth/login` (Login Page)** (`frontend/src/app/auth/login/page.tsx`):
    *   Provides a form for existing users to log into their accounts using their email and password.
    *   Handles authentication requests to the backend and redirects users upon successful login.

*   **`/auth/register` (Register Page)** (`frontend/src/app/auth/register/page.tsx`):
    *   Enables new users to create an account by providing their email and desired password.
    *   Communicates with the backend registration API to create new user profiles.

*   **`/memberships` (Memberships Page)** (`frontend/src/app/memberships/page.tsx`):
    *   Showcases available membership plans (e.g., Gold, Silver, Bronze) with their respective benefits.
    *   Provides options for users to view details, compare plans, and enroll in a membership.

*   **`/ownership-shares` (Ownership Shares Page)** (`frontend/src/app/ownership-shares/page.tsx`):
    *   Presents information regarding fractional jet ownership opportunities.
    *   Allows users to view their current ownership shares, allocated flight hours, and options for purchasing new shares.

*   **`/admin/dashboard` (Admin Dashboard)** (`frontend/src/app/admin/dashboard/page.tsx`):
    *   A protected route accessible only to administrators.
    *   Provides a central hub for administrators to navigate to different management sections (jets, bookings, users, memberships, ownership shares).

*   **`/admin/manage-jets` (Manage Jets Page)** (`frontend/src/app/admin/manage-jets/page.tsx`):
    *   Allows administrators to view, add, edit, and delete private jet listings in the system.
    *   Provides tools for managing jet details, availability, and hourly rates.

*   **`/admin/manage-bookings` (Manage Bookings Page)** (`frontend/src/app/admin/manage-bookings/page.tsx`):
    *   Enables administrators to view, modify, and cancel all user bookings.
    *   Offers a comprehensive overview of booking statuses and details for administrative oversight.

*   **`/admin/manage-memberships` (Manage Memberships Page)** (`frontend/src/app/admin/manage-memberships/page.tsx`):
    *   Provides administrators with tools to manage membership plans and user enrollments.
    *   Allows for creating, updating, and deleting membership types and assigning/revoking memberships.

*   **`/admin/manage-ownership-shares` (Manage Ownership Shares Page)** (`frontend/src/app/admin/manage-ownership-shares/page.tsx`):
    *   Allows administrators to manage fractional ownership shares, including assigning shares to users, updating percentages, and tracking allocated hours.

*   **`Navbar` Component** (`frontend/src/components/Navbar.tsx`):
    *   A reusable navigation bar component displayed at the top of most pages.
    *   Provides consistent navigation links to main sections like Home, Search, Bookings, Profile, Memberships, Ownership Shares, and Admin Dashboard (if applicable).
    *   Includes dynamic links based on user authentication status.

*   **`Footer` Component** (`frontend/src/components/Footer.tsx`):
    *   A reusable footer component displayed at the bottom of most pages.
    *   Contains copyright information and general contact details for the application.

*   **`RootLayout` Component** (`frontend/src/app/layout.tsx`):
    *   Defines the overall structure and layout of the application.
    *   Includes shared UI elements like the `Navbar` and `Footer`, applies global styles (Tailwind CSS), and manages metadata for the application.

## Data Models (High-Level)

- User
- Jet
- Booking
- Membership
- OwnershipShare

## Key Features

- User Authentication (Register/Login)
- Jet Search and Details
- Booking Management
- Membership Enrollment
- Ownership Share Management
- Admin Dashboard (protected routes)