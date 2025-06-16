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
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          throw new Error('No auth token found');
        }
        
        // Fetch fresh user data
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsLoading(false);
      } catch (error) {
        console.error('Authentication error:', error);
        // Clear any invalid auth data
        authService.logout();
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: '/chat' } });
      }
    };

    checkAuth();
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
      
      try {
        const response = await chatService.sendMessage(message);
        
        // Create a simple message with the response data
        const botMessage: ChatMessage = {
          from: 'bot',
          text: response.data?.message || response.text || 'Here is the response:',
          data: response.data?.data || response.data,
          timestamp: new Date().toISOString(),
          metadata: response.metadata || {}
        };
        
        setMessages(prev => [...prev, botMessage]);
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
      
    } catch (error) {
      console.error('Error in handleSend:', error);
      setIsSending(false);
    }
  };

  // Format data as a list for display
  const renderDataAsTable = (data: any, level = 0) => {
    if (!data) return null;

    // Handle array data
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <Typography variant="body2" color="text.secondary">No data available</Typography>;
      }
      return (
        <Box component="ul" sx={{ 
          pl: level > 0 ? 3 : 0, 
          mt: level > 0 ? 1 : 0,
          mb: 0,
          listStyle: 'none'
        }}>
          {data.map((item, index) => (
            <Box 
              key={index} 
              component="li" 
              sx={{ 
                mb: 1.5,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              {item && typeof item === 'object' ? (
                renderDataAsTable(item, level + 1)
              ) : (
                <Typography variant="body2">{String(item || '')}</Typography>
              )}
            </Box>
          ))}
        </Box>
      );
    }

    // Handle object data
    return (
      <Box component="ul" sx={{ 
        pl: level > 0 ? 3 : 0, 
        mt: level > 0 ? 1 : 0,
        mb: 0,
        listStyle: 'none'
      }}>
        {Object.entries(data).map(([key, value]) => (
          <Box component="li" key={key} sx={{ mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              mb: 0.5
            }}>
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Typography>
            {value && typeof value === 'object' ? (
              <Box sx={{ 
                pl: 2, 
                borderLeft: '2px solid',
                borderColor: 'divider',
                mt: 1
              }}>
                {renderDataAsTable(value, level + 1)}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ 
                color: 'text.secondary',
                wordBreak: 'break-word'
              }}>
                {String(value || '-')}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    );
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Enter key to send message, Shift+Enter for new line
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)',
      '& .chat-container': {
        flex: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #f8faff 0%, #f0f7ff 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(58, 123, 213, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
          pointerEvents: 'none'
        }
      },
      '& .message-list': {
        flex: 1,
        overflowY: 'auto',
        p: 2,
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.02)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(58, 123, 213, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(58, 123, 213, 0.4)',
          }
        }
      }
    }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <FlightTakeoff sx={{ 
              mr: 1.5,
              color: 'white',
              transform: 'rotate(45deg)',
              fontSize: '1.6rem'
            }} />
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.5,
                letterSpacing: '0.5px',
                background: 'linear-gradient(to right, #fff, #e3f2fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              AI Jet Booking Assistant
            </Typography>
          </Box>
          {user && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              '&:hover': {
                '& .user-avatar': {
                  transform: 'rotate(8deg) scale(1.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                },
                '& .user-chip': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateX(-2px)'
                }
              },
              transition: 'all 0.3s ease'
            }}>
              <Chip
                className="user-chip"
                avatar={
                  <Avatar 
                    className="user-avatar"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 700,
                      border: '2px solid rgba(255,255,255,0.3)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                }
                label={
                  <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                    {user.name || user.email}
                  </Typography>
                }
                variant="outlined"
                sx={{ 
                  mr: 2,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease',
                  '& .MuiChip-label': {
                    px: 1.5,
                    py: 0.5
                  }
                }}
              />
              <Tooltip title="Logout">
                <IconButton color="inherit" onClick={handleLogout}>
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        p: 2, 
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%)',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'rgba(0,0,0,0.02)',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(58, 123, 213, 0.2)',
          borderRadius: '4px',
          '&:hover': {
            background: 'rgba(58, 123, 213, 0.4)',
          }
        }
      }}>
        <List sx={{ 
          maxWidth: 800, 
          margin: '0 auto',
          '& .message-enter': {
            animation: 'fadeIn 0.3s ease-out forwards',
          }
        }}>
          {messages.map((msg, index) => (
            <ListItem 
              key={index} 
              className="message-enter"
              sx={{ 
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                py: 1.5,
                px: 1,
                animation: 'fadeIn 0.3s ease-out forwards'
              }}
            >
              <Box 
                sx={{
                  maxWidth: '85%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    ...(msg.from === 'user' ? {
                      background: 'linear-gradient(135deg, #3a7bd5 0%, #00d1b2 100%)',
                      color: 'white',
                      borderTopRightRadius: '4px',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(58, 123, 213, 0.3)'
                      }
                    } : {
                      background: 'white',
                      color: 'text.primary',
                      border: '1px solid #e0e7ff',
                      borderTopLeftRadius: '4px',
                      '&:hover': {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                      }
                    }),
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                      pointerEvents: 'none',
                      zIndex: 0
                    },
                    '& > *': {
                      position: 'relative',
                      zIndex: 1
                    },
                    minWidth: '200px',
                    maxWidth: '100%',
                    wordBreak: 'break-word',
                    '& p': {
                      margin: 0,
                      lineHeight: 1.5
                    }
                  }}
                >
                  {(() => {
                    // Handle error messages
                    if (msg.error) {
                      return (
                        <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                          <Cancel color="error" sx={{ mr: 1 }} />
                          <span>{msg.text}</span>
                        </Box>
                      );
                    }

                    // Handle flight data
                    if (msg.data?.flights && Array.isArray(msg.data.flights)) {
                      return (
                        <Box>
                          {msg.text && msg.text !== 'Here are your flights:' && (
                            <Typography variant="body1" gutterBottom>{msg.text}</Typography>
                          )}
                          <Box sx={{ mt: 2 }}>
                            {msg.data.flights.map((flight, idx) => (
                              <Box 
                                key={idx} 
                                sx={{ 
                                  mb: 3, 
                                  p: 2, 
                                  border: '1px solid #e0e0e0', 
                                  borderRadius: 1,
                                  '&:hover': {
                                    boxShadow: 1,
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.2s ease-in-out'
                                  }
                                }}
                              >
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <FlightTakeoff color="action" sx={{ mr: 1, fontSize: 16 }} />
                                      <Typography variant="body2"><strong>From:</strong> {flight.origin || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <FlightLand color="action" sx={{ mr: 1, fontSize: 16 }} />
                                      <Typography variant="body2"><strong>To:</strong> {flight.destination || 'N/A'}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Event color="action" sx={{ mr: 1, fontSize: 16 }} />
                                      <Typography variant="body2"><strong>Date:</strong> {flight.date || 'N/A'}</Typography>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body2"><strong>Flight:</strong> {flight.flightNumber || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Aircraft:</strong> {flight.aircraft || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Seats:</strong> {flight.availableSeats || 'N/A'}</Typography>
                                    <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                                      ${flight.price?.toLocaleString() || 'N/A'}
                                    </Typography>
                                  </Grid>
                                </Grid>
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                  <Button size="small" variant="contained" color="primary">Book Now</Button>
                                </Box>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      );
                    }

                    // Handle booking data
                    if (msg.data?.bookings && Array.isArray(msg.data.bookings)) {
                      return (
                        <Box>
                          {msg.text && msg.text !== 'Here are your bookings:' && (
                            <Typography variant="body1" gutterBottom>{msg.text}</Typography>
                          )}
                          <Box sx={{ 
                            mt: 1, 
                            p: 2, 
                            bgcolor: 'background.paper', 
                            borderRadius: 1, 
                            border: '1px solid #eee',
                            overflow: 'hidden'
                          }}>
                            {renderDataAsTable(msg.data)}
                          </Box>
                        </Box>
                      );
                    }
                    
                    // Default message rendering
                    return (
                      <Box>
                        {msg.text && <Typography variant="body1">{msg.text}</Typography>}
                        {msg.data && (
                          <Box sx={{ 
                            mt: 1, 
                            p: 2, 
                            bgcolor: 'background.paper', 
                            borderRadius: 1, 
                            border: '1px solid #eee',
                            overflow: 'hidden'
                          }}>
                            {renderDataAsTable(msg.data)}
                          </Box>
                        )}
                      </Box>
                    );
                  })()}
                </Box>
                <Typography variant="caption" sx={{ 
                  mt: 0.5, 
                  color: msg.from === 'user' ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
                <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Paper
          component="form"
          onSubmit={handleSend}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            p: 1,
            borderRadius: 2,
            maxWidth: 800,
            margin: '0 auto',
            width: '100%',
            bgcolor: 'background.paper'
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!input.trim() || isSending}
            sx={{
              ml: 1,
              minWidth: '80px',
              height: '56px',
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                boxShadow: 2,
              },
            }}
          >
            {isSending ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Paper>
        <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1, color: 'text.secondary' }}>
          Press Enter to send, Shift+Enter for a new line
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatPage;