# ✈️ Jet Booking Platform - Frontend

A modern, responsive web application for booking private jets, built with Next.js, TypeScript, and Tailwind CSS. This frontend application provides an intuitive user interface for searching, booking, and managing private jet flights.

## 🌟 Features

- **User Authentication**
  - Secure JWT-based authentication
  - User registration and login
  - Protected routes

- **Flight Search & Booking**
  - Advanced search with filters
  - Real-time availability
  - Interactive booking form
  - Booking management

- **Admin Dashboard**
  - Fleet management
  - User management
  - Booking analytics

- **Responsive Design**
  - Mobile-first approach
  - Cross-browser compatibility
  - Optimized for all screen sizes

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0.0 or later
- npm, yarn, or pnpm
- Backend API server (see backend README)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-jet-booking.git
   cd ai-jet-booking/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
   NEXTAUTH_SECRET=your-secret-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Project Structure

```
frontend/
├── app/                    # App router
│   ├── (auth)/             # Authentication pages
│   ├── admin/              # Admin dashboard
│   ├── api/                # API routes
│   ├── bookings/           # Booking management
│   ├── jets/               # Jet listings
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
│   ├── ui/                 # UI components
│   ├── forms/              # Form components
│   └── layout/             # Layout components
├── lib/                    # Utility functions
├── public/                 # Static assets
├── styles/                 # Global styles
└── types/                  # TypeScript types
```

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
# or
pnpm test
```

## 🚀 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fai-jet-booking)

### Docker

Build the Docker image:
```bash
docker build -t jet-booking-frontend .
```

Run the container:
```bash
docker run -p 3000:3000 jet-booking-frontend
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
