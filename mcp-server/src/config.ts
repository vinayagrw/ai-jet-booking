export const config = {
  backend: {
    baseUrl: process.env.BACKEND_URL || 'http://localhost:8000/api/v1',
    auth: {
      token: process.env.BACKEND_AUTH_TOKEN || 'your-auth-token-here',
      headerName: 'Authorization',
      headerPrefix: 'Bearer',
      endpoints: {
        register: '/auth/register',
        login: '/auth/login'
      }
    },
    endpoints: {
      jets: '/jets',
      bookings: '/bookings',
      memberships: '/memberships'
    }
  },
  frontend: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:3000'
  }
}; 