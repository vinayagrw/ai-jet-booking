import React from 'react';
import { Box, Typography } from '@mui/material';

const HomePage: React.FC = () => (
  <Box p={4} textAlign="center">
    <Typography variant="h3" gutterBottom>Welcome to Jet Booking!</Typography>
    <Typography variant="h6">Book private jets, manage your bookings, and chat with our concierge right from this app.</Typography>
  </Box>
);

export default HomePage; 