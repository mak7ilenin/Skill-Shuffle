import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import { Row, Col, Stack, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

import { AESEncrypt, AESDecrypt } from '../crypto';
import { API_SERVER, WEBSOCKET_URL, SERVER_URL } from '../config';
import { useAuth } from '../components/AuthContext';
import MessageNotification from '../components/MessageNotification';
import MessageRenderer from '../components/MessageRenderer';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';
import EmojiGifPicker from '../components/EmojiGifPicker';

function Chat() {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [choosenChat, setChoosenChat] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageNotification, setMessageNotification] = useState({ visible: false, heading: '', message: {}, to: '' });
  const [loading, setLoading] = useState(false);
  const messagesListRef = useRef(null);
  const subscriptionRef = useRef(null);
  const timeoutRef = useRef(null);
  const debounceTimeout = useRef(null);
  const firstMessageRef = useRef(null);
  const offsetRef = useRef(0);
  const limit = 30;

  // Scroll to the bottom of the current chat
  // useLayoutEffect(() => {
  //   scrollToBottom();
  // }, [choosenChat]);

  useEffect(() => {
    axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
      .then(response => {
        // Create a new WebSocket client
        const newClient = new Client();
        const websocketUrl = `ws://${WEBSOCKET_URL}`;

        // Connect to the WebSocket after receiving the JWT token
        newClient.configure({
          brokerURL: websocketUrl,
          connectHeaders: {
            Authorization: `Bearer ${response.data.access_token}`
          },
        });

        newClient.activate();
        setStompClient(newClient);

      })
      .catch(() => {
        setAuthUser(null);
        navigate('/sign-in');
      });
  }, [setStompClient, setAuthUser, navigate]);

  // Get the current chat via the encrypted chat ID in the URL
  useEffect(() => {
    const encryptedChatId = new URLSearchParams(location.search).get('c');
    if (encryptedChatId) {
      try {
        const decryptedChatId = AESDecrypt(encryptedChatId);
        if (decryptedChatId !== '' && !isNaN(decryptedChatId)) {
          getChatMessages(decryptedChatId);
        }
      } catch (error) {
        console.error("Error decrypting chat: ", error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Get the list of chats
  useEffect(() => {
    axios.get(`${API_SERVER}/chats`, { withCredentials: true })
      .then(response => {
        response.data.map(chat => { return chat.id = AESEncrypt(chat.id.toString()); });
        setChats(response.data);
      })
      .catch(error => {
        if (error.response) {
          console.error(error.response.data.message);
        }
      });
  }, []);

  const updateChatLastMessage = useCallback((message) => {
    message = message.content === undefined ? message[message.length - 1] : message;
    const chatIndex = chats.findIndex(chat => AESDecrypt(chat.id) === message.chat.id.toString());
    const chat = chats[chatIndex];

    chat.last_message.content = message.content;
    setChats((prevChats) => {
      const newChats = [...prevChats];
      newChats[chatIndex] = chat;
      return newChats;
    });
  }, [chats, setChats]);

  const subscribeToChatMessages = useCallback(() => {
    const destination = `/user/chat/${choosenChat.id}`;
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe(); // Unsubscribe from previous chat
    }

    const newSubscription = stompClient.subscribe(destination, (receivedMessage) => {
      // Process the received message
      const message = JSON.parse(receivedMessage.body);

      // Update the last message of the chat
      updateChatLastMessage(message);

      // Update the chat history with the new message
      setChoosenChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, ...message],
      }));
    });
    subscriptionRef.current = newSubscription; // Store the new subscription
  }, [choosenChat.id, stompClient, setChoosenChat, updateChatLastMessage]);

  const showNotification = useCallback((notification) => {
    setMessageNotification({ visible: true, notification: notification });

    // Clear the previous timeout (if any)
    clearTimeout(timeoutRef.current);

    // Set a new timeout to hide the notification after 5 seconds
    timeoutRef.current = setTimeout(() => {
      setMessageNotification(prevState => ({
        ...prevState,
        visible: false,
      }));
    }, 5000);
  }, []);

  const subscribeToNotifications = useCallback(() => {
    return stompClient.subscribe(`/user/notification`, (receivedNotification) => {
      // Process the received notification
      const notification = JSON.parse(receivedNotification.body);
      if (notification.type === 'CHAT_MESSAGE') {
        ;
        if (notification.chat.id !== choosenChat.id) {
          // Update the last message of the chat
          updateChatLastMessage(notification);

          // Clear previous debounce timeout if exists
          if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
          }

          // Set a new debounce timeout to trigger the notification
          debounceTimeout.current = setTimeout(() => {
            showNotification(notification);
            debounceTimeout.current = null; // Reset debounce timeout after notification is shown
          }, 1000);
        }
      }
    });
  }, [choosenChat.id, stompClient, updateChatLastMessage, showNotification]);

  // Handle the WebSocket connection
  useEffect(() => {
    let notificationSubscription = null;
    if (stompClient != null && choosenChat.id) {
      const onConnectCallback = () => {
        // Subscribe to the current chat messages
        subscribeToChatMessages();
        // Subscribe to notifications
        notificationSubscription = subscribeToNotifications();
      };
      stompClient.onConnect = onConnectCallback;
      if (stompClient.connected) {
        onConnectCallback();
      }
    }
    // Cleanup function to unsubscribe from notifications when the component unmounts
    return () => {
      if (notificationSubscription) {
        notificationSubscription.unsubscribe();
      }
    };
  }, [stompClient, choosenChat, subscribeToChatMessages, subscribeToNotifications]);

  const getChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`${API_SERVER}/chats/${chatId}`, { withCredentials: true });
      setChoosenChat(response.data);
      subscribeToChatMessages(response.data);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      }
    }
  };

  // Function to send message
  const sendMessage = () => {
    if (messageContent === '') return;
    setMessageContent('');

    const destination = `/app/chat/${choosenChat.id}`;
    const message = {
      sender: authUser,
      chat: { id: choosenChat.id },
      content: messageContent,
      timestamp: new Date().toISOString(),
    };
    if (stompClient != null) {
      // Send the message to the server to handle
      stompClient.publish({
        destination,
        body: JSON.stringify(message),
      });
    }
  };

  const formatTimestampForMessage = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
  }

  const formatTimestampForChatContainer = (timestamp) => {
    const date = new Date(timestamp);
    const currentDate = new Date();
    const difference = currentDate - date;

    if (difference > 31536000000) {
      // dd/mmm/yyyy if the message was sent more than a year ago
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } else if (difference > 86400000) {
      // dd/mmm if the message was sent less than a year ago but more than a day ago
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } else {
      // hh:mm if the message was sent less than a day ago
      return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
    }
  }

  const handleScroll = () => {
    if (messagesListRef.current.scrollTop === 0 && !loading) {
      loadMoreMessages();
    }
  };

  const loadMoreMessages = async () => {
    setLoading(true);
    const prevScrollHeight = messagesListRef.current.scrollHeight;
    const prevScrollTop = messagesListRef.current.scrollTop;
    offsetRef.current += limit;
    try {
      const response = await axios.get(`${API_SERVER}/chats/${choosenChat.id}/messages?offset=${offsetRef.current}&limit=${limit}`, { withCredentials: true });
      const newMessages = response.data;
      setChoosenChat(prevChat => ({
        ...prevChat,
        messages: [...newMessages, ...prevChat.messages],
      }));

      // Calculate the difference in scroll height
      const newScrollHeight = messagesListRef.current.scrollHeight;
      const scrollHeightDifference = newScrollHeight - prevScrollHeight;

      // Adjust scroll position to maintain the relative position of the first visible message
      messagesListRef.current.scrollTop = prevScrollTop + scrollHeightDifference;
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row className="chat-page flex-nowrap">
      {messageNotification.visible && (
        <MessageNotification {...messageNotification} />
      )}

      <Col className="chat-list">
        {chats.map(chat => (
          <Row className='chat-container d-flex align-items-center flex-nowrap' key={chat.id} onClick={() => { navigate(`/messenger?c=${chat.id}`); }}>
            <Col lg={2} className='chat-avatar d-flex justify-content-center'>
              <Image
                src={chat.avatar_url !== null ? `${SERVER_URL}/${chat.avatar_url}` : imagePlaceholder}
                alt={chat.name}
                width={50}
                height={50}
                style={{ objectFit: 'cover' }}
                roundedCircle
              />
            </Col>
            <Col className='chat-info p-0'>
              <p className='chat-name d-flex justify-content-between'>
                {chat.name}
                <span>{formatTimestampForChatContainer(chat.last_message.timestamp)}</span>
              </p>
              <p className='last-message'>{chat.last_message.content}</p>
            </Col>
          </Row>
        ))}
      </Col>
      {choosenChat.id === undefined ? (
        <Col className='chat-box non-selected' key={choosenChat.id}>
          <p className='no-chat-selected'>Select a chat to start messaging</p>
        </Col>
      ) :
        <Col className='chat-box d-flex flex-nowrap flex-column' key={choosenChat.id}>
          <Row className='chat-header'>
            <Col lg={1}>
              <Image
                src={choosenChat.avatar_url !== null ? `${SERVER_URL}/${choosenChat.avatar_url}` : imagePlaceholder}
                alt={choosenChat.name}
                width={50}
                height={50}
                style={{ objectFit: 'cover' }}
                roundedCircle
              />
            </Col>
            <Col>
              <p className='chat-name'>{choosenChat.name}</p>
            </Col>
          </Row>
          <Row className='messages-list p-0 py-3' ref={messagesListRef} onScroll={handleScroll}>
            <Stack direction='vertical' gap={3}>
              {choosenChat.messages && choosenChat.messages.map((message, index) => (
                <div
                  className={`message d-flex ${message.sender && message.sender.nickname === authUser.nickname ? 'own-message' : 'other-message'}`}
                  key={index}
                  ref={index === 0 ? firstMessageRef : null}
                >
                  <Image
                    src={message.sender && message.sender.avatar_url ? `${SERVER_URL}/${message.sender.avatar_url}` : imagePlaceholder}
                    alt={message.sender && message.sender.first_name}
                    width={30}
                    height={30}
                    style={{ objectFit: 'cover' }}
                    roundedCircle
                  />
                  <div className="message-content">
                    <p className='sender-name'><strong>{message.sender && message.sender.nickname === authUser.nickname ? 'You' : message.sender.nickname}</strong></p>
                    <MessageRenderer content={message.content} />
                  </div>
                  <div className="message-time-container">
                    <p className='message-time'>{formatTimestampForMessage(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </Stack>
          </Row>
          <Row className="message-input p-0">
            <div className="input-container">
              <input
                type='text'
                name='message'
                className='w-100 h-100'
                placeholder='Type a message...'
                value={messageContent}
                onChange={(event) => setMessageContent(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage();
                  }
                }}
                maxLength={1024}
              />
              <label
                htmlFor="message"
                className={`length-counter d-flex align-items-center ${messageContent.length === 1024 ? 'over-limit' : ''}`}
              >
                {messageContent.length}/1024
              </label>
            </div>

            <EmojiGifPicker setMessageContent={setMessageContent} sendMessage={sendMessage} />

            <button className='btn btn-outline-primary btn-send' onClick={sendMessage}>Send</button>
          </Row>
        </Col>
      }
    </Row>
  );
}

export default Chat;