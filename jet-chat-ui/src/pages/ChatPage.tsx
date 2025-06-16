import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, List, ListItem, Paper, CircularProgress, Avatar, AppBar, Toolbar, IconButton, Tooltip, Chip, Grid, Divider } from '@mui/material';
import { Logout as LogoutIcon, FlightTakeoff, FlightLand, Event, CheckCircle, Pending, Cancel } from '@mui/icons-material';
import { authService, type UserInfo } from '../services/auth';
import { chatService } from '../services/chatService';
import type { ChatMessage } from '../services/chatService';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      from: 'bot', 
      text: '👋 Hi! I\'m your jet booking assistant. How can I help you today?',
      metadata: { intent: 'greeting' }
    }
  ]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState<UserInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user info on component mount
  useEffect(() => {
    const userInfo = authService.getUserInfo();
    const token = authService.getToken();
    
    if (!token || !userInfo) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: '/chat' } });
    } else {
      setUser(userInfo);
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const message = input.trim();
    if (!message || isSending) return;

    try {
      setIsSending(true);
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        from: 'user',
        text: message,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      
      // Simulate bot response (replace with actual API call)
      setTimeout(async () => {
        try {
          // Here you would typically call your chat service
          // const response = await chatService.sendMessage(message);
          
          // For now, simulate a response
          const botResponse: ChatMessage = {
            from: 'bot',
            text: `I received: "${message}"`,
            timestamp: new Date().toISOString(),
            metadata: {
              intent: 'general_response'
            }
          };
          
          setMessages(prev => [...prev, botResponse]);
        } catch (error) {
          console.error('Error sending message:', error);
          setMessages(prev => [...prev, {
            from: 'bot',
            text: 'Sorry, I encountered an error processing your message. Please try again.',
            error: true,
            timestamp: new Date().toISOString()
          }]);
        } finally {
          setIsSending(false);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  // Component to render different message types
  const renderMessageContent = (msg: any) => {
    if (!msg) return null;

    // Handle error messages
    if (msg.error) {
      return (
        <Box sx={{ color: 'error.main', bgcolor: 'error.light', p: 1, borderRadius: 1, mt: 0.5 }}>
          <Typography variant="body2">{msg.error}</Typography>
        </Box>
      );
    }

    // Handle booking list
    if ((msg.metadata?.intent === 'list_bookings' || msg.data?.intent === 'list_bookings') && 
        (msg.data?.data || msg.data)) {
      const bookings = Array.isArray(msg.data) ? msg.data : 
                     (msg.data?.data ? msg.data.data : []);
      
      if (!bookings.length) {
        return <Typography variant="body2">You don't have any bookings yet.</Typography>;
      }

      return (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Your Bookings:</Typography>
          {bookings.map((booking: any, idx: number) => (
            <Box 
              key={idx} 
              sx={{ 
                p: 2, 
                mb: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlightTakeoff color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2"><strong>From:</strong> {booking.origin || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlightLand color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2"><strong>To:</strong> {booking.destination || 'N/A'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {booking.start_time ? new Date(booking.start_time).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}><strong>Status:</strong></Typography>
                    <Chip 
                      label={booking.status || 'Pending'} 
                      size="small"
                      color={
                        booking.status === 'confirmed' ? 'success' : 
                        booking.status === 'cancelled' ? 'error' : 'default'
                      }
                      icon={
                        booking.status === 'confirmed' ? <CheckCircle fontSize="small" /> :
                        booking.status === 'cancelled' ? <Cancel fontSize="small" /> :
                        <Pending fontSize="small" />
                      }
                    />
                  </Box>
                </Grid>
              </Grid>
              {booking.id && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth 
                  sx={{ mt: 1 }}
                  onClick={() => {
                    // Handle view booking details
                    console.log('View booking:', booking.id);
                  }}
                >
                  View Details
                </Button>
              )}
            </Box>
          ))}
        </Box>
      );
    }

    // Handle flight search results
    if ((msg.metadata?.intent === 'search_results' || msg.data?.intent === 'search_results') && 
        (msg.data?.data || msg.data)) {
      const flights = Array.isArray(msg.data) ? msg.data : 
                     (msg.data?.data ? msg.data.data : []);

      if (!flights.length) {
        return <Typography variant="body2">No flights found matching your criteria.</Typography>;
      }

      return (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Available Flights:</Typography>
          {flights.map((flight: any, idx: number) => (
            <Box 
              key={idx} 
              sx={{ 
                p: 2, 
                mb: 2, 
                border: '1px solid', 
                borderColor: 'divider',
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">
                      {flight.airline || 'Private Jet'}
                    </Typography>
                    <Chip 
                      label={`$${flight.price || '0'}`} 
                      color="primary" 
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlightTakeoff color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2"><strong>From:</strong> {flight.origin || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Event color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {flight.departure ? new Date(flight.departure).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <FlightLand color="action" sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2"><strong>To:</strong> {flight.destination || 'N/A'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Event color="action" sx={{ mr: 1, fontSize: 16, opacity: 0 }} />
                    <Typography variant="body2">
                      {flight.arrival ? new Date(flight.arrival).toLocaleString() : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                size="small" 
                fullWidth 
                sx={{ mt: 1 }}
                onClick={() => {
                  // Handle book flight
                  console.log('Book flight:', flight.id);
                }}
              >
                Book Now
              </Button>
            </Box>
          ))}
        </Box>
      );
    }

    // Default text message
    return (
      <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
        {msg.text}
      </Typography>
    );
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const message = input.trim();
    if (message === '' || isSending) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { from: 'user', text: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      // Send message to backend and get response
      const response = await chatService.sendMessage(message);
      
      // Add bot response to chat
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev, 
        { 
          from: 'bot', 
          text: 'Sorry, I encountered an error. Please try again later.' 
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/chat' } });
      } else {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Make sure body has no extra margin/padding
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.height = '100vh';
    document.documentElement.style.height = '100vh';
    return () => {
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ 
            flexGrow: 1, 
            fontWeight: 'bold',
            background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            ✈️ Jet Booking Assistant
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={user.email || user.name}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main',
                  width: 36,
                  height: 36,
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
            </Tooltip>
            <Tooltip title="Logout">
              <IconButton 
                onClick={handleLogout} 
                color="inherit"
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ width: '100%', height: '100%', p: 2, boxSizing: 'border-box' }}>
        <Paper
          elevation={3}
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box p={2} bgcolor="primary.main" color="white">
            <Typography variant="subtitle1" fontWeight="bold">Chat</Typography>
          </Box>

          {/* Message List */}
          <Box sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            p: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
            },
          }}>
            <List sx={{ p: 0 }}>
              {messages.map((msg, idx) => (
                <React.Fragment key={idx}>
                  <ListItem 
                    sx={{ 
                      justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', 
                      p: 0, 
                      mb: 2,
                      animation: 'fadeIn 0.3s ease-in-out',
                      '@keyframes fadeIn': {
                        '0%': { opacity: 0, transform: 'translateY(10px)' },
                        '100%': { opacity: 1, transform: 'translateY(0)' },
                      }
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: msg.from === 'user' ? 'primary.main' : 'background.paper',
                        color: msg.from === 'user' ? 'primary.contrastText' : 'text.primary',
                        p: 2,
                        borderRadius: 2,
                        maxWidth: { xs: '90%', sm: '80%', md: '70%' },
                        boxShadow: 1,
                        position: 'relative',
                        '&:after': {
                          content: '""',
                          position: 'absolute',
                          width: 0,
                          height: 0,
                          borderStyle: 'solid',
                          [msg.from === 'user' ? 'right' : 'left']: -10,
                          top: 15,
                          borderWidth: '10px 10px 10px 0',
                          borderColor: `transparent ${msg.from === 'user' ? 'primary.main' : 'background.paper'} transparent transparent`,
                          transform: msg.from === 'user' ? 'none' : 'scaleX(-1)',
                        }
                      }}
                    >
                      {renderMessageContent(msg)}
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
              <div ref={messagesEndRef} />
            </List>
          </Box>
          
          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid', 
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
          }}>
            <form 
              onSubmit={handleSend} 
              style={{ 
                display: 'flex', 
                gap: '12px',
                position: 'relative',
                alignItems: 'center'
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me anything about flights, bookings, or travel..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                size="medium"
                disabled={isSending}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '28px',
                    backgroundColor: 'background.paper',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: '1px',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '12px 20px',
                  },
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) {
                      handleSend();
                    }
                  }
                }}
                multiline
                maxRows={4}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!input.trim() || isSending}
                sx={{
                  minWidth: '100px',
                  height: '48px',
                  borderRadius: '24px',
                  textTransform: 'none',
                  fontWeight: '600',
                  boxShadow: '0 2px 10px rgba(25, 118, 210, 0.3)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                    transform: 'translateY(-1px)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.3)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'text.disabled',
                    boxShadow: 'none',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                {isSending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send'
                )}
              </Button>
            </form>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                textAlign: 'center', 
                mt: 1,
                fontSize: '0.7rem',
                opacity: 0.7
              }}
            >
              Press Enter to send, Shift+Enter for a new line
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatPage;
                      {/* Display booking data if available */}
                      {((msg.data && Array.isArray(msg.data)) || 
                        (msg.data && msg.data.data && Array.isArray(msg.data.data))) && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1, maxHeight: '200px', overflowY: 'auto' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Booking Details:</Typography>
                          {(Array.isArray(msg.data) ? msg.data : msg.data.data).map((booking: any, idx: number) => (
                            <Box key={idx} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                              <Typography variant="body2">
                                <strong>From:</strong> {booking.origin || 'N/A'}