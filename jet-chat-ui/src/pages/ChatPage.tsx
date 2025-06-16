import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, Paper } from '@mui/material';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { from: 'bot', text: '👋 Hi! Do you want to book a jet?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { from: 'user', text: input }]);
    setInput('');
  };

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

  return (
    <Box sx={{ width: '100%', height: '100vh', p: 2, boxSizing: 'border-box' }}>
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
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
          <List sx={{ p: 0 }}>
            {messages.map((msg, idx) => (
              <ListItem key={idx} sx={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', p: 0, mb: 1 }}>
                <Box
                  sx={{
                    bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.200',
                    color: msg.from === 'user' ? 'white' : 'black',
                    p: 1.5,
                    borderRadius: 2,
                    maxWidth: '75%',
                  }}
                >
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Input Area */}
        <Box display="flex" p={2} borderTop={1} borderColor="divider">
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type your message..."
            sx={{ mr: 1 }}
          />
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatPage;
