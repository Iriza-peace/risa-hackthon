import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

import {
  Grid,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  TextField,
  IconButton,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogTitle
} from '@mui/material';
import { styled } from '@mui/system';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
import TicketModal from 'pages/tickets/TicketModal';

// Custom styles (unchanged)
const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '85vh',
  backgroundColor: '#fff',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row'
  }
}));

const MessagesList = styled(Box)(({ theme }) => ({
  width: '300px',
  borderRight: '1px solid #e0e0e0',
  height: '90vh',
  backgroundColor: '#F6F8FB',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderRight: 'none'
  }
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  height: '85vh',
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1)
  }
}));

// 

const MessageRow = styled(Box)(({ type }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  flexDirection: type === 'sent' ? 'row-reverse' : 'row'
}));

const MessageBox = styled(Box)(({ theme, type }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  marginLeft: type === 'sent' ? '0' : theme.spacing(2),
  marginRight: type === 'sent' ? theme.spacing(2) : '0',
  backgroundColor: type === 'sent' ? theme.palette.primary.main : '#f5f5f5',
  color: type === 'sent' ? '#fff' : theme.palette.text.primary
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 'bold'
}));


export default function ChatLayout() {
  const location = useLocation();

  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(location.state?.id ?? {});
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/chats`);

      if (!response.ok) {
        throw new Error('Failed to fetch chats');
      }

      const responseData = await response.json();

      setChats(responseData);

      console.log(responseData);
    };
    fetchChats();
  }, []);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setSelectedTicket(chat.Ticket);
    console.log(selectedTicket);
  };

  useEffect(() => {
    console.log(selectedChat);
    console.log(selectedTicket);
  }, [selectedChat, selectedTicket]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      // Implement file upload logic here
    }
  };

  

  return (
    <ChatContainer>
      {/* Sidebar Messages */}
      <MessagesList>
        <SidebarTitle>Messages</SidebarTitle>
        <List sx={{ height: '83vh', overflowY: 'auto' }}>
          {chats.map((chat, index) => (
            <ListItem
              key={chat.chat_id}
              button
              onClick={() => handleChatClick(chat)}
              sx={{
                border: selectedChat.chat_id === chat.chat_id ? '3px solid orange' : 'none',
                backgroundColor: selectedChat.chat_id === chat.chat_id ? 'white' : 'none'
              }}
            >
              <ListItemAvatar>
                <Avatar alt="User Avatar"></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={chat.Ticket.issuer_phone_number}
                secondary={chat.Ticket.ticket_title}
                sx={{ flex: 1, marginLeft: 1 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                {/* <Typography variant="caption" color="textSecondary">
                  hello
                </Typography> */}
                <Typography variant="caption" color="textSecondary">
                  {new Date(chat.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </MessagesList>

      {/* Chat Area */}
      <ChatArea>
        {selectedTicket ? (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ paddingBottom: 2 }}>
              <Avatar />
              <ListItemText sx={{ marginLeft: '25px' }}>
                <Typography variant="h6">{selectedTicket.issuer_full_name}</Typography>
                <Typography variant="subtitle2" color="success">
                  Online
                </Typography>
              </ListItemText>
              <Button variant="outlined" onClick={() => setModalOpen(true)}>
                Preview Ticket
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', paddingTop: 1 }}>
              <input accept="*" type="file" id="file-upload" style={{ display: 'none' }} onChange={handleFileUpload} />
              <label htmlFor="file-upload">
                <IconButton color="primary" component="span">
                  <UploadOutlined />
                </IconButton>
              </label>
              <TextField
                fullWidth
                placeholder="Type a message"
                variant="outlined"
                size="large"
                sx={{ flex: 1, marginRight: 1 }}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    // handleSendMessage();
                  }
                }}
              />
              <IconButton color="primary" onClick={null}>
                <SendOutlined />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box display="flex" sx={{ alignItems: 'center', justifyContent: 'center', paddingTop: '20rem' }}>
            <Typography variant="h3" color="primary">
              No Ticket Selected
            </Typography>
          </Box>
        )}
      </ChatArea>


      {/* File Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)}>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          {uploadedFile && <img src={URL.createObjectURL(uploadedFile)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '80vh' }} />}
        </DialogContent>
      </Dialog>

      {modalOpen && (
        <TicketModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          // ticketDetails={tickets.find((t) => t.ticket_id === selectedTicket)}
          ticketDetails={selectedTicket}
        />
      )}
    </ChatContainer>
  );
}
