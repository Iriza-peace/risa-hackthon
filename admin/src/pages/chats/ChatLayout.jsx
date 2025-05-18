import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import { SendOutlined } from '@ant-design/icons';
import TicketModal from 'pages/tickets/TicketModal';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: '85vh',
  backgroundColor: '#fff',
}));

const MessagesList = styled(Box)(({ theme }) => ({
  width: '300px',
  borderRight: '1px solid #e0e0e0',
  backgroundColor: '#F6F8FB',
  overflowY: 'auto',
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

const MessageRow = styled(Box)(({ type }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '8px',
  flexDirection: type === 'sent' ? 'row-reverse' : 'row',
}));

const MessageBox = styled(Box)(({ theme, type }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: type === 'sent' ? theme.palette.primary.main : '#f5f5f5',
  color: type === 'sent' ? '#fff' : theme.palette.text.primary,
  margin: type === 'sent' ? '0 0 0 16px' : '0 16px 0 0',
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 'bold',
}));

export default function ChatLayout() {
  const { ticketId: routeTicketId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all tickets on component mount
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tickets/`);
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  // If we have a ticketId from the route, select that ticket
  useEffect(() => {
    if (routeTicketId) {
      // Find ticket in our list or fetch it
      const ticket = tickets.find(t => t.ticket_id.toString() === routeTicketId);
      if (ticket) {
        setSelectedTicket(ticket);
      } else {
        fetchTicketById(routeTicketId);
      }
    }
  }, [routeTicketId, tickets]);

  // When selected ticket changes, fetch messages for that ticket
  useEffect(() => {
    if (selectedTicket?.ticket_id) {
      fetchMessagesForTicket(selectedTicket.ticket_id);
    } else {
      setMessages([]);
    }
  }, [selectedTicket]);

  const fetchTicketById = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tickets/${id}`);
      const data = await response.json();
      setSelectedTicket(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      setLoading(false);
    }
  };

  const fetchMessagesForTicket = async (ticketId) => {
    try {
      setLoading(true);
      // Use comments endpoint if that's where chat messages are stored
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/comments?ticket_id=${ticketId}`);
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket?.ticket_id) return;

    const messageData = {
      ticket_id: parseInt(selectedTicket.ticket_id),
      author_name: 'Admin',
      author_avatar: 'admin_avatar_url',
      author_type: 'admin',
      content: newMessage,
      is_public: true,
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setNewMessage('');
        
        // Add the new message to our list
        setMessages((prevMessages) => [...prevMessages, {
          ...messageData,
          comment_id: savedMessage.comment_id || Date.now(),
          createdAt: savedMessage.createdAt || new Date().toISOString(),
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatContainer>
      <MessagesList>
        <SidebarTitle>Active Tickets</SidebarTitle>
        {loading && tickets.length === 0 ? (
          <Typography align="center" p={2}>Loading tickets...</Typography>
        ) : (
          <List>
            {tickets.map((ticket) => (
              <ListItem
                key={ticket.ticket_id}
                button
                onClick={() => handleTicketClick(ticket)}
                sx={{
                  border: selectedTicket?.ticket_id === ticket.ticket_id ? '2px solid orange' : 'none',
                  backgroundColor: selectedTicket?.ticket_id === ticket.ticket_id ? '#fff' : 'transparent',
                  margin: '4px',
                  borderRadius: '4px',
                }}
              >
                <ListItemAvatar>
                  <Avatar alt={ticket.issuer_full_name || 'User'} />
                </ListItemAvatar>
                <ListItemText
                  primary={ticket.issuer_phone_number || 'No Number'}
                  secondary={ticket.ticket_title || 'No Title'}
                />
                <Typography variant="caption" color="textSecondary">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </Typography>
              </ListItem>
            ))}
            {tickets.length === 0 && !loading && (
              <Typography align="center" p={2}>No tickets available</Typography>
            )}
          </List>
        )}
      </MessagesList>

      <ChatArea>
        {selectedTicket ? (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" pb={2}>
              <Avatar alt={selectedTicket.issuer_full_name || 'User'} />
              <Box ml={2} flexGrow={1}>
                <Typography variant="h6">{selectedTicket.issuer_full_name || 'Unknown User'}</Typography>
                <Typography variant="subtitle2" color="success.main">
                  {selectedTicket.status || 'Active Ticket'}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={() => setModalOpen(true)}>Preview Ticket</Button>
            </Box>

            <Box flexGrow={1} overflow="auto" mb={2} sx={{ display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <Typography align="center" p={2}>Loading messages...</Typography>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <MessageRow key={message.comment_id} type={message.author_type === 'admin' ? 'sent' : 'received'}>
                    <MessageBox type={message.author_type === 'admin' ? 'sent' : 'received'}>
                      <Typography variant="subtitle2" fontWeight="bold">{message.author_name}</Typography>
                      <Typography>{message.content}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </Typography>
                    </MessageBox>
                  </MessageRow>
                ))
              ) : (
                <Typography align="center" p={2}>No messages yet</Typography>
              )}
            </Box>

            <Box display="flex" alignItems="center">
              <TextField
                fullWidth
                placeholder="Type your response"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <IconButton color="primary" onClick={handleSendMessage}>
                <SendOutlined />
              </IconButton>
            </Box>
          </>
        ) : (
          <Box display="flex" flex={1} alignItems="center" justifyContent="center">
            <Typography variant="h4" color="textSecondary">No Ticket Selected</Typography>
          </Box>
        )}
      </ChatArea>

      <Dialog open={openPreview} onClose={() => setOpenPreview(false)}>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          {/* File preview content goes here */}
        </DialogContent>
      </Dialog>

      {modalOpen && (
        <TicketModal open={modalOpen} onClose={() => setModalOpen(false)} ticketDetails={selectedTicket} />
      )}
    </ChatContainer>
  );
}