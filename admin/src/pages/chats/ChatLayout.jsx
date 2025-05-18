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
  Paper
} from '@mui/material';
import { styled } from '@mui/system';
import { SendOutlined, CloseOutlined } from '@ant-design/icons';
import { CornerDownRight } from 'lucide-react';
import TicketModal from 'pages/tickets/TicketModal';

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  height: '85vh',
  backgroundColor: '#fff'
}));

const MessagesList = styled(Box)(({ theme }) => ({
  width: '300px',
  borderRight: '1px solid #e0e0e0',
  backgroundColor: '#F6F8FB',
  overflowY: 'auto'
}));

const ChatArea = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2)
}));

const MessageRow = styled(Box)(({ type }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  marginBottom: '8px',
  flexDirection: type === 'sent' ? 'row-reverse' : 'row'
}));

const MessageBox = styled(Box)(({ theme, type }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  backgroundColor: type === 'sent' ? theme.palette.primary.main : '#f5f5f5',
  color: type === 'sent' ? '#fff' : theme.palette.text.primary,
  margin: type === 'sent' ? '0 0 0 16px' : '0 16px 0 0',
  position: 'relative'
}));

const ReplyIndicator = styled(Box)(({ theme, type }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(0.5),
  backgroundColor: type === 'sent' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(0.5),
  fontSize: '0.8rem'
}));

const SidebarTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid #e0e0e0',
  fontWeight: 'bold'
}));

export default function ChatLayout() {
  const { ticketId: routeTicketId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
 
  // Get module name from the ticket or default to "Admin"
  const getModuleName = () => {
  return selectedTicket?.module_name || 'Unassigned';
};


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

  useEffect(() => {
    if (routeTicketId) {
      const ticket = tickets.find((t) => t.ticket_id.toString() === routeTicketId);
      if (ticket) {
        setSelectedTicket(ticket);
      } else {
        fetchTicketById(routeTicketId);
      }
    }
  }, [routeTicketId, tickets]);

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
      author_name: getModuleName(),
      author_avatar: 'admin_avatar_url',
      author_type: 'admin',
      content: newMessage,
      is_public: true,
      parent_id: replyTo?.comment_id || null
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });

      if (response.ok) {
        const savedMessage = await response.json();
        setNewMessage('');
        setReplyTo(null);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...messageData,
            comment_id: savedMessage.comment_id || Date.now(),
            createdAt: savedMessage.createdAt || new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleReplyClick = (message) => {
    setReplyTo(message);
  };

  const cancelReply = () => {
    setReplyTo(null);
  };

  // Organize comments into threads for display
  const organizeMessages = () => {
    const topLevelComments = messages.filter(m => !m.parent_id);
    const repliesMap = {};
    
    messages.forEach(message => {
      if (message.parent_id) {
        if (!repliesMap[message.parent_id]) {
          repliesMap[message.parent_id] = [];
        }
        repliesMap[message.parent_id].push(message);
      }
    });
    
    return { topLevelComments, repliesMap };
  };

  const { topLevelComments, repliesMap } = organizeMessages();

  // Render a message with its replies
  const renderMessage = (message, isReply = false) => {
    const replies = repliesMap[message.comment_id] || [];
    const parentMessage = isReply ? messages.find(m => m.comment_id === message.parent_id) : null;
    const messageType = message.author_type === 'admin' ? 'sent' : 'received';
    
    return (
      <Box key={message.comment_id} ml={isReply ? 4 : 0}>
        <MessageRow type={messageType}>
          <MessageBox type={messageType}>
            {isReply && parentMessage && (
              <ReplyIndicator type={messageType}>
                <CornerDownRight size={14} style={{ marginRight: 4 }} />
                <Typography variant="caption">
                  Replying to {parentMessage.author_name}
                </Typography>
              </ReplyIndicator>
            )}
            
            <Typography variant="subtitle2" fontWeight="bold">
              {message.author_name}
            </Typography>
            <Typography variant="body2">{message.content}</Typography>
            <Typography variant="caption" color={messageType === 'sent' ? 'rgba(255,255,255,0.7)' : 'textSecondary'}>
              {/* {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
            </Typography>
            
            <Box mt={0.5} display="flex" gap={1}>
              <Button 
                size="small" 
                sx={{ 
                  minWidth: 'auto', 
                  px: 1, 
                  fontSize: '0.7rem',
                  color: messageType === 'sent' ? 'white' : 'primary.main'
                }}
                onClick={() => handleReplyClick(message)}
              >
                Reply
              </Button>
            </Box>
          </MessageBox>
        </MessageRow>
        
        {/* Render replies */}
        {replies.map(reply => renderMessage(reply, true))}
      </Box>
    );
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
                  borderRadius: '4px'
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
                <Typography variant="subtitle2" color="success.light">
                  {/* {selectedTicket.ticket_status || 'Active Ticket'} */}
                   AGENT FROM {getModuleName()}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={() => setModalOpen(true)}>Preview Ticket</Button>
            </Box>

            <Box flexGrow={1} overflow="auto" mb={2} sx={{ display: 'flex', flexDirection: 'column' }}>
              {loading ? (
                <Typography align="center" p={2}>Loading messages...</Typography>
              ) : topLevelComments.length > 0 ? (
                topLevelComments.map(message => renderMessage(message))
              ) : (
                <Typography align="center" p={2}>No messages yet</Typography>
              )}
            </Box>

            <Box>
              {replyTo && (
                <Paper 
                  variant="outlined" 
                  sx={{ p: 1, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Box display="flex" alignItems="center">
                    <CornerDownRight size={16} style={{ marginRight: 8 }} />
                    <Typography variant="body2">
                      Replying to <strong>{replyTo.author_name}</strong>
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={cancelReply}>
                    <CloseOutlined />
                  </IconButton>
                </Paper>
              )}
              
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  placeholder={replyTo ? "Write your reply..." : "Type your response"}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <IconButton color="primary" onClick={handleSendMessage}>
                  <SendOutlined />
                </IconButton>
              </Box>
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
        <DialogContent>{/* File preview content goes here */}</DialogContent>
      </Dialog>

      {modalOpen && <TicketModal open={modalOpen} onClose={() => setModalOpen(false)} ticketDetails={selectedTicket} />}
    </ChatContainer>
  );
}