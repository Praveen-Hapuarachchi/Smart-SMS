import React, { useEffect, useState } from 'react';
import { getMessagesBetweenUsers, sendMessage } from '../../api-helpers/api-helpers';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  InputAdornment,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams, useLocation } from 'react-router-dom';
import HeaderForUser from './HeaderForUser';
import backgroundImage from '../../assets/Message.png';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import Footer from '../Footer';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  borderRadius: '16px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
}));

const StyledMessageBubble = styled(Box)(({ theme, isSender }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 12px',
  borderRadius: '16px',
  maxWidth: '80%', // Increased maxWidth for wider messages
  wordWrap: 'break-word',
  backgroundColor: isSender ? '#1976d2' : '#f1f1f1',
  color: isSender ? '#fff' : '#000',
  marginBottom: '10px',
  boxShadow: theme.shadows[1],
}));

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { senderId } = useParams();
  const { state } = useLocation();
  const senderName = state?.senderName || 'Unknown';
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    console.log('userId:', userId);
    console.log('senderId:', senderId);

    if (userId && senderId) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const senderMessages = await getMessagesBetweenUsers(senderId, userId);
          console.log('Sender to Receiver Messages:', senderMessages);

          const receiverMessages = await getMessagesBetweenUsers(userId, senderId);
          console.log('Receiver to Sender Messages:', receiverMessages);

          const allMessages = [...senderMessages, ...receiverMessages].sort(
            (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
          );

          const uniqueMessages = allMessages.filter(
            (message, index, self) => index === self.findIndex((m) => m.id === message.id)
          );

          setMessages(uniqueMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessages();
    }
  }, [userId, senderId]);

  const handleSendMessage = async () => {
    if (!newMessage) return;

    setIsLoading(true);
    try {
      const response = await sendMessage({
        senderId: userId,
        receiverId: senderId,
        content: newMessage,
      });

      const newMessageObject = {
        id: response.id,
        sender: { id: userId, fullName: userName },
        receiver: { id: senderId, fullName: senderName },
        content: newMessage,
        timestamp: response.timestamp,
      };

      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
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
      <Box sx={{ flexGrow: 1, padding: 3, maxWidth: 800, margin: '0 auto' }}> {/* Increased maxWidth to 800 */}
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'center', mb: 4 }}
        >
          Chat with {senderName}
        </Typography>

        <StyledCard>
          <CardContent>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {/* Chat Messages */}
                <Box sx={{ maxHeight: '400px', overflowY: 'auto', mb: 3 }}>
                  {messages.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', color: 'grey.500' }}>
                      No messages found
                    </Typography>
                  ) : (
                    messages.map((message) => {
                      const isSender = message.sender.fullName === userName;
                      return (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: isSender ? 'flex-end' : 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {!isSender && (
                              <Avatar sx={{ bgcolor: '#757575' }}>{senderName[0]}</Avatar>
                            )}
                            <StyledMessageBubble isSender={isSender}>
                              {/* Message content above */}
                              <Typography variant="body1">{message.content}</Typography>
                              {/* Sender details below in one row */}
                              <Box sx={{ display: 'flex', justifyContent: isSender ? 'flex-end' : 'flex-start', mt: 0.5 }}>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.8 }}
                                >
                                  {isSender ? 'You' : message.sender.fullName} at{' '}
                                  {new Date(message.timestamp).toLocaleString()}
                                </Typography>
                              </Box>
                            </StyledMessageBubble>
                            {isSender && (
                              <Avatar sx={{ bgcolor: '#1976d2' }}>{userName[0]}</Avatar>
                            )}
                          </Box>
                        </Box>
                      );
                    })
                  )}
                </Box>

                {/* Message Input */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    rows={1}
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
                    disabled={isLoading || !newMessage}
                    sx={{
                      mt: 1,
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      padding: '10px 20px',
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </StyledCard>
      </Box>
      <Footer />
    </Box>
  );
};

export default ChatPage;