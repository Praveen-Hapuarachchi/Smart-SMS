import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage, getAllUsers, getMessagesBetweenUsers } from '../../api-helpers/api-helpers';
import {
  Box,
  List,
  ListItem,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import HeaderForUser from './HeaderForUser';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import backgroundImage from '../../assets/Message_BG.png';
import Footer from '../Footer';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: '8px',
  marginBottom: '16px',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[6],
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: '12px 16px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
    transition: 'background-color 0.3s ease',
  },
}));

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const fetchMessagesAndUsers = async () => {
        setIsLoading(true);
        try {
          const [messagesData, usersData] = await Promise.all([getMessages(userId), getAllUsers()]);
          setMessages(messagesData);
          setUsers(usersData);

          const contacts = Array.from(
            [...messagesData].reduce((map, item) => {
              const contact = item.sender?.id === userId ? item.receiver : item.sender;
              if (!contact) return map;
              map.set(contact.id, contact);
              return map;
            }, new Map()).values()
          );

          const lastMessages = await Promise.all(
            contacts.map(async (contact) => {
              const conversation = await getMessagesBetweenUsers(userId, contact.id);
              return {
                ...contact,
                lastMessage: conversation.length > 0 ? conversation[conversation.length - 1].content : 'No messages yet',
                timestamp: conversation.length > 0 ? conversation[conversation.length - 1].timestamp : null,
              };
            })
          );

          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              const contact = lastMessages.find((lm) => lm.id === (msg.sender?.id === userId ? msg.receiver.id : msg.sender.id));
              return contact ? { ...msg, lastMessage: contact.lastMessage, timestamp: contact.timestamp } : msg;
            })
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessagesAndUsers();
    }
  }, [userId]);

  const handleSendMessage = async () => {
    if (!newMessage || !receiverId) return;

    setIsLoading(true);
    try {
      await sendMessage({
        senderId: userId,
        receiverId,
        content: newMessage,
      });

      setNewMessage('');
      const receiver = users.find((user) => user.id.toString() === receiverId.toString()) || {
        id: receiverId,
        fullName: 'Unknown User',
        role: 'Unknown',
      };

      const newMessageObject = {
        sender: { id: userId, fullName: 'You', role: 'ROLE_USER' },
        receiver,
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      navigate(`/chat/${receiverId}`, { state: { senderId: receiver.id, senderName: receiver.fullName } });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueContacts = Array.from(
    [...messages].reduce((map, item) => {
      const contact = item.sender?.id === userId ? item.receiver : item.sender;
      if (!contact) return map;

      const existingContact = map.get(contact.id);
      if (!existingContact || new Date(item.timestamp) > new Date(existingContact.timestamp)) {
        map.set(contact.id, {
          id: contact.id,
          fullName: contact.fullName || 'Unknown User',
          role: contact.role || 'Unknown',
          lastMessage: item.lastMessage || 'No messages yet',
          timestamp: item.timestamp,
        });
      }
      return map;
    }, new Map()).values()
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const getRoleColor = (role) => {
    switch (role) {
      case 'ROLE_STUDENT':
        return '#e8f5e9'; // Light green
      case 'ROLE_TEACHER':
        return '#e3f2fd'; // Light blue
      case 'ROLE_PRINCIPAL':
        return '#ffebee'; // Light coral
      default:
        return '#f5f5f5'; // Light gray
    }
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case 'ROLE_STUDENT':
        return '#4caf50'; // Green
      case 'ROLE_TEACHER':
        return '#1976d2'; // Blue
      case 'ROLE_PRINCIPAL':
        return '#d32f2f'; // Red
      default:
        return '#757575'; // Gray
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <HeaderForUser sx={{ width: '100%', mb: 2 }} />
      <Box sx={{ flexGrow: 1, padding: 3, maxWidth: 600, margin: '0 auto' }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', mb: 4 }}
        >
          Messages
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledCard>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2 }}>
                Recent Conversations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {uniqueContacts.length > 0 ? (
                  uniqueContacts.map((contact) => (
                    <StyledListItem
                      key={contact.id}
                      onClick={() =>
                        navigate(`/chat/${contact.id}`, {
                          state: { senderId: contact.id, senderName: contact.fullName },
                        })
                      }
                      sx={{ cursor: 'pointer', backgroundColor: getRoleColor(contact.role) }}
                    >
                      <Avatar sx={{ bgcolor: getAvatarColor(contact.role), mr: 2 }}>
                        {contact.fullName[0]}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {contact.fullName} (ID: {contact.id})
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'grey.600' }}>
                            {new Date(contact.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'grey.700', mt: 0.5 }}>
                          {contact.lastMessage}
                        </Typography>
                      </Box>
                    </StyledListItem>
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center', color: 'grey.500' }}>
                    No conversations yet.
                  </Typography>
                )}
              </List>
            </CardContent>
          </StyledCard>
        )}

        {/* Message Input Section */}
        <StyledCard>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#424242', mb: 2 }}>
              Send a Message
            </Typography>
            <TextField
              label="Receiver ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'grey.500' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ChatIcon sx={{ color: 'grey.500' }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              fullWidth
              disabled={!newMessage || !receiverId || isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </CardContent>
        </StyledCard>
      </Box>
      <Footer />
    </Box>
  );
};

export default MessagesPage;