import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { authService } from '../services/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/chat';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.login({ email, password });
      if (response.access_token) {
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <Box maxWidth={400} mx="auto">
      <Typography variant="h4" mb={2}>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </form>
      <Typography mt={2}>
        Don't have an account? <Link to="/register">Register</Link>
      </Typography>
    </Box>
  );
};

export default LoginPage; 