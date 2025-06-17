# 🚀 Jet Booking Backend

FastAPI-powered backend service for the AI Jet Booking platform, handling user authentication, jet inventory, bookings, and integration with the MCP server.

## 🌟 Features

- **RESTful API** with OpenAPI documentation
- **JWT Authentication** for secure access
- **PostgreSQL** database with SQLAlchemy ORM
- **Alembic** for database migrations
- **Pydantic** for data validation
- **Async** support for high performance
- **WebSocket** for real-time updates
- **CORS** enabled for frontend access

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL 13+
- Redis (for rate limiting and caching)

### Installation

1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables in `.env`:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/jet_booking
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   MCP_SERVER_URL=http://localhost:3010
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

API docs will be available at `http://localhost:8000/docs`

## 📚 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in and get access token
- `GET /auth/me` - Get current user info

### Jets
- `GET /jets` - List all available jets
- `GET /jets/{jet_id}` - Get jet details
- `POST /jets` - Add new jet (admin only)
- `PUT /jets/{jet_id}` - Update jet (admin only)

### Bookings
- `GET /bookings` - List user's bookings
- `POST /bookings` - Create new booking
- `GET /bookings/{booking_id}` - Get booking details
- `PUT /bookings/{booking_id}` - Update booking

## 🧪 Testing

Run tests with pytest:
```bash
pytest
```

## 🛠 Development

### Database Migrations
Create a new migration:
```bash
alembic revision --autogenerate -m "description of changes"
```

Apply migrations:
```bash
alembic upgrade head
```

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Document public functions with docstrings
- Keep functions small and focused

## 📦 Deployment

### Production
1. Set up a production database
2. Configure environment variables
3. Use a production ASGI server like Uvicorn with Gunicorn:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

### Docker
Build and run with Docker:
```bash
docker build -t jet-booking-backend .
docker run -p 8000:8000 jet-booking-backend
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
