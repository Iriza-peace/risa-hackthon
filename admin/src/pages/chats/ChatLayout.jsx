import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
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
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import { UploadOutlined, SendOutlined } from '@ant-design/icons';
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
  const { ticketId } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [openPreview, setOpenPreview] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/chats`);
        const data = await response.json();
        setChats(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/tickets/${ticketId}`);
        const data = await response.json();
        setSelectedTicket(data);
      } catch (error) {
        console.error('Failed to fetch ticket:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/comments?ticket_id=${ticketId}`);
        const data = await response.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    };

    if (ticketId) {
      fetchTicket();
      fetchComments();
    } else {
      setComments([]);
    }
  }, [ticketId]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
    setSelectedTicket(chat?.Ticket || null);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !ticketId) return;

    const commentData = {
      ticket_id: parseInt(ticketId),
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
        body: JSON.stringify(commentData),
      });
      if (response.ok) {
        setNewMessage('');
        const updatedComments = await (await fetch(`${import.meta.env.VITE_APP_API_URL}/comments?ticket_id=${ticketId}`)).json();
        setComments(updatedComments);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatContainer>
      <MessagesList>
        <SidebarTitle>Active Tickets</SidebarTitle>
        <List>
          {chats.map((chat) => (
            <ListItem
              key={chat.chat_id}
              button
              onClick={() => handleChatClick(chat)}
              sx={{
                border: selectedChat?.chat_id === chat.chat_id ? '3px solid orange' : 'none',
                backgroundColor: selectedChat?.chat_id === chat.chat_id ? '#fff' : 'transparent',
              }}
            >
              <ListItemAvatar>
                <Avatar alt="User Avatar" />
              </ListItemAvatar>
              <ListItemText
                primary={chat?.Ticket?.issuer_phone_number || 'No Number'}
                secondary={chat?.Ticket?.ticket_title || 'No Title'}
              />
              <Typography variant="caption" color="textSecondary">
                {new Date(chat.createdAt).toLocaleDateString()}
              </Typography>
            </ListItem>
          ))}
        </List>
      </MessagesList>

      <ChatArea>
        {selectedTicket ? (
          <>
            <Box display="flex" alignItems="center" justifyContent="space-between" pb={2}>
              <Avatar />
              <Box ml={2} flexGrow={1}>
                <Typography variant="h6">{selectedTicket.issuer_full_name}</Typography>
                <Typography variant="subtitle2" color="success.main">Active Ticket</Typography>
              </Box>
              <Button variant="outlined" onClick={() => setModalOpen(true)}>Preview Ticket</Button>
            </Box>

            <Box flexGrow={1} overflow="auto" mb={2}>
              {comments.map((comment) => (
                <MessageRow key={comment.comment_id} type={comment.author_type === 'admin' ? 'sent' : 'received'}>
                  {/* <Avatar src={comment.author_avatar} alt={comment.author_name} /> */}
                  <MessageBox type={comment.author_type === 'admin' ? 'sent' : 'received'}>
                    <Typography variant="subtitle2" fontWeight="bold">{comment.author_name}</Typography>
                    <Typography>{comment.content}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(comment.createdAt).toLocaleTimeString()}
                    </Typography>
                  </MessageBox>
                </MessageRow>
              ))}
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
          {uploadedFile && <img src={URL.createObjectURL(uploadedFile)} alt="Preview" style={{ maxWidth: '100%' }} />}
        </DialogContent>
      </Dialog>

      {modalOpen && (
        <TicketModal open={modalOpen} onClose={() => setModalOpen(false)} ticketDetails={selectedTicket} />
      )}
    </ChatContainer>
  );
}
