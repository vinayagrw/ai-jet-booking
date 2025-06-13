import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { mcpService } from '../services/mcp';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await mcpService.getBookings();
        setBookings(data.bookings || data);
      } catch (err) {
        setError('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={2}>My Bookings</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Paper sx={{ p: 2 }}>
          <List>
            {bookings.length === 0 ? (
              <ListItem><ListItemText primary="No bookings found." /></ListItem>
            ) : (
              bookings.map((booking, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={`Jet: ${booking.jetId || booking.jet_id || 'N/A'}`}
                    secondary={`From: ${booking.departure || booking.departure_city || 'N/A'} | To: ${booking.arrival || booking.arrival_city || 'N/A'} | Date: ${booking.date || booking.departure_date || 'N/A'}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default BookingsPage; 