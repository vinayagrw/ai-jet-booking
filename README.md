# AI Jet Booking Platform

A modern web application for private jet booking and management, built with FastAPI and Next.js.

## Project Overview

This platform provides a comprehensive solution for private jet booking, including features for jet management, booking, membership programs, and ownership shares.

## Tech Stack

### Backend
- **Framework**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT-based authentication
- **API Documentation**: OpenAPI/Swagger
- **Database Migrations**: Alembic
- **Logging**: Custom logging implementation

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Animation**: Framer Motion
- **HTTP Client**: Axios

## Features

### Core Features
- User authentication and authorization
- Jet browsing and searching
- Booking management
- Membership program
- Ownership shares management
- Admin dashboard
- Contact system
- Category management
- Comprehensive logging system

### API Endpoints
- `/api/v1/auth` - Authentication endpoints
- `/api/v1/jets` - Jet management
- `/api/v1/bookings` - Booking operations
- `/api/v1/memberships` - Membership management
- `/api/v1/ownership-shares` - Ownership share operations
- `/api/v1/admin` - Admin operations
- `/api/v1/contact` - Contact management
- `/api/v1/categories` - Category management
- `/api/v1/logs` - System logs

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL 12+

### Backend Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   pip install uvicorn
   pip install "pydantic[email]"
   ```

3. Set up PostgreSQL:
   - Install PostgreSQL if not already installed
   - Create a new database named `ai_jet_booking`
   - Configure database connection in `backend/database.py`:
     ```python
     DATABASE_URL = "postgresql://postgres:admin@localhost:5432/ai_jet_booking"
     ```
   - Make sure PostgreSQL is running on port 5432
   - Run database migrations:
     ```bash
     cd backend
     alembic upgrade head
     ```

4. Generate a secret key:
   ```bash
   python generate_secret_key.py
   ```

5. Start the backend server:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Environment Variables
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://postgres:admin@localhost:5432/ai_jet_booking
SECRET_KEY=your_generated_secret_key
DEBUG=True
```

### Frontend Setup
1. Install dependencies:
   ```bash
   cd frontend
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

### Running Both Services
Use the provided scripts:
- Windows: `run_all.bat`
- Unix/Mac: `run_all.sh`

## Development

### Backend Development
- The backend uses FastAPI's automatic API documentation
- Access the API docs at `http://localhost:8000/docs`
- Database migrations are managed through Alembic
- Logs are stored in the `backend/logs` directory
- PostgreSQL connection settings can be configured in `backend/database.py`

### Frontend Development
- Built with Next.js for optimal performance
- Uses TypeScript for type safety
- Styled with Tailwind CSS for responsive design
- Implements modern UI components with Headless UI

## Project Structure

```
.
├── backend/
│   ├── routers/         # API route handlers
│   ├── models/          # Database models
│   ├── schemas/         # Pydantic schemas
│   ├── utils/           # Utility functions
│   ├── logs/            # Application logs
│   └── alembic/         # Database migrations
├── frontend/
│   ├── src/            # Source code
│   ├── public/         # Static assets
│   └── .next/          # Build output
└── scripts/            # Utility scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.