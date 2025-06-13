import React, { useState } from 'react';
import { Fab, Modal, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatPage from '../pages/ChatPage';

const style = {
  position: 'fixed' as const,
  bottom: 24,
  right: 24,
  zIndex: 1300,
};

const modalStyle = {
  position: 'fixed' as const,
  bottom: 80,
  right: 40,
  width: 400,
  height: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 2,
  outline: 'none',
  display: 'flex',
  flexDirection: 'column',
};

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Fab color="primary" aria-label="chat" sx={style} onClick={() => setOpen(true)}>
        <ChatIcon />
      </Fab>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <ChatPage />
        </Box>
      </Modal>
    </>
  );
};

export default ChatWidget; 