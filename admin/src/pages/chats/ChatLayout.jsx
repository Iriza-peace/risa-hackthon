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

const TeamArea = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 120,
    borderLeft: '1px solid #e0e0e0',
    padding: theme.spacing(2),
    height: '90vh'
  }
}));

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

const socket = io(import.meta.env.VITE_APP_API_URL, {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling'],
  timeout: 10000,
  namespace: '/messages'
});

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

  // useEffect(() => {
  //   // Connect to socket
  //   socket.on('connect', () => {
  //     console.log('Connected to the server');
  //   });

  //   socket.on('connect_error', (error) => {
  //     console.error('Socket connection error:', error);
  //   });

  //   // Fetch tickets and messages
  //   fetchTickets();

  //   // Listen for incoming messages
  //   socket.on('received', (message) => {
  //     setMessages((prevMessages) => ({
  //       ...prevMessages,
  //       [message.ticket_id]: [
  //         ...(prevMessages[message.ticket_id] || []),
  //         {
  //           id: message.message_id,
  //           type: message.sender_type === 'Agent' ? 'sent' : 'received',
  //           sender: message.sender_type,
  //           text: message.message_content,
  //           timestamp: new Date(message.createdAt).toISOString()
  //         }
  //       ]
  //     }));
  //   });

  //   return () => {
  //     socket.off('connect');
  //     socket.off('connect_error');
  //     socket.off('received');
  //   };
  // }, []);

  // useEffect(() => {
  //   if (selectedTicket) {
  //     socket.emit('join_ticket', selectedTicket);
  //     fetchMessages(selectedTicket);
  //   }
  // }, [selectedTicket]);

  // const fetchTickets = async () => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tickets`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setTickets(data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching tickets:', error);
  //   }
  // };

  // const fetchMessages = async (ticketId) => {
  //   try {
  //     const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/chats/${ticketId}`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setMessages((prevMessages) => ({
  //         ...prevMessages,
  //         [ticketId]: data.map((msg) => ({
  //           id: msg.message_id,
  //           type: msg.sender_type === 'Agent' ? 'sent' : 'received',
  //           sender: msg.sender_type,
  //           text: msg.message_content,
  //           timestamp: new Date(msg.createdAt).toISOString()
  //         }))
  //       }));
  //     }
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // };

  // const handleSendMessage = () => {
  //   if (newMessage.trim() && selectedTicket) {
  //     const messageData = {
  //       ticket_id: selectedTicket,
  //       sender_id: 'agent_id', // Replace with actual agent ID
  //       sender_type: 'Agent',
  //       message_content: newMessage
  //     };

  //     socket.emit('send', messageData);

  //     setMessages((prevMessages) => ({
  //       ...prevMessages,
  //       [selectedTicket]: [
  //         ...(prevMessages[selectedTicket] || []),
  //         {
  //           id: Date.now(), // Temporary ID
  //           type: 'sent',
  //           sender: 'Agent',
  //           text: newMessage,
  //           timestamp: new Date().toISOString()
  //         }
  //       ]
  //     }));

  //     setNewMessage('');
  //   }
  // };

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

  // function handleViewClick(ticketDetails) {
  //   setSelectedTicket(ticketDetails);
  //   setModalOpen((prevState) => !prevState);
  //   console.log('Ticket Details:', ticketDetails);
  //   console.log('Modal Open:', modalOpen);
  // }

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
            {/* <Box sx={{ flexGrow: 1, marginBottom: 2, height: 'calc(100% - 120px)', position: 'relative', overflowY: 'auto' }}>
              {messages[selectedTicket]?.map((message) => (
                <MessageRow key={message.id} type={message.type}>
                  <Avatar alt={message.sender} sx={{ marginRight: 1 }}>
                    {message.sender[0]}
                  </Avatar>
                  <MessageBox type={message.type}>{message.text}</MessageBox>
                </MessageRow>
              ))}
            </Box> */}
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

      {/* Team Section */}
      <TeamArea>
        <SidebarTitle gutterBottom>Team</SidebarTitle>
        {[1, 2, 3, 4].map((id) => (
          <Box key={id} sx={{ position: 'relative', marginBottom: 2 }}>
            <Badge variant="dot" color="success" overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              <Avatar alt={`User ${id}`} src={`/avatar-${id}.png`} sx={{ width: 48, height: 48 }} />
            </Badge>
          </Box>
        ))}
      </TeamArea>

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
