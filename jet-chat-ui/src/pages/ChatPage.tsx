import React, { useState } from 'react';
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
    // Here you can add logic to send the message to your backend or AI
  };

  return (
    <Box flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="100%" p={2}>
      <Paper elevation={0} sx={{ width: 400, maxHeight: 500, overflow: 'hidden', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Box p={2} bgcolor="primary.main" color="white">
          <Typography variant="subtitle1" fontWeight="bold">Chat</Typography>
        </Box>
        <List sx={{ width: '100%', maxHeight: 400, overflow: 'auto', p: 2 }}>
          {messages.map((msg, idx) => (
            <ListItem key={idx} sx={{ justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
              <Box
                sx={{
                  bgcolor: msg.from === 'user' ? 'primary.main' : 'grey.100',
                  color: msg.from === 'user' ? 'white' : 'text.primary',
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '80%',
                }}
              >
                <Typography variant="body1">{msg.text}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
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