import React, { useEffect, useState, useLayoutEffect, useRef, useCallback } from 'react';
import { Row, Col, Stack } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { AESEncrypt, AESDecrypt } from '../crypto';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

import { API_SERVER, WEBSOCKET_URL, SERVER_URL } from '../config';
import { useAuth } from '../components/AuthContext';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function Chat() {
  const { authUser, setAuthUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [chats, setChats] = useState([]);
  const [choosenChat, setChoosenChat] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const messagesListRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Scroll to the bottom of the current chat
  useLayoutEffect(() => {
    scrollToBottom();
  }, [choosenChat]);

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

  const subscribeToChatMessages = useCallback((chat) => {
    const destination = `/user/chat/${chat.id}`;
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe(); // Unsubscribe from previous chat
    }
    const newSubscription = stompClient.subscribe(destination, (receivedMessage) => {
      // Process the received message
      const message = JSON.parse(receivedMessage.body);

      // Update the chat history with the new message
      setChoosenChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, ...message],
      }));
    });
    subscriptionRef.current = newSubscription; // Store the new subscription
  }, [stompClient]);

  useEffect(() => {
    if (stompClient != null && choosenChat.id) {
      const onConnectCallback = () => {
        subscribeToChatMessages(choosenChat);
      };

      stompClient.onConnect = onConnectCallback; // Set the onConnect callback

      // If the client is already connected, invoke the callback immediately
      if (stompClient.connected) {
        onConnectCallback();
      }
    }
  }, [stompClient, choosenChat, subscribeToChatMessages]);

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

  const sendMessage = () => {
    setMessageContent('');
    const destination = `/app/chat/${choosenChat.id}`;
    const message = {
      sender: {
        nickname: authUser.nickname,
        first_name: authUser.first_name,
        last_name: authUser.last_name,
        avatar_url: authUser.avatar_url
      },
      chat: { id: choosenChat.id },
      content: messageContent,
      timestamp: new Date().toISOString()
    };
    if (stompClient != null) {
      // Send the message to the server to handle
      stompClient.publish({
        destination,
        body: JSON.stringify(message),
      });
    }
  };

  // Send message by pressing Enter
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTimestampForMessage = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes}`;
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

  const scrollToBottom = () => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
    }
  };

  return (
    <Row className="chat-page">
      <Col className="chat-list" lg={3}>
        {chats.map(chat => (
          <Row className='chat-container' key={chat.id} onClick={() => { navigate(`/messenger?c=${chat.id}`); }}>
            <Col lg={2} className='chat-avatar d-flex justify-content-center'>
              <img
                src={chat.avatar_url !== null ? `${SERVER_URL}/${chat.avatar_url}` : imagePlaceholder}
                alt={chat.name}
                width={50}
                height={50}
                style={{ borderRadius: 50, objectFit: 'cover' }}
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
              <img
                src={choosenChat.avatar_url !== null ? `${SERVER_URL}/${choosenChat.avatar_url}` : imagePlaceholder}
                alt={choosenChat.name}
                width={50}
                height={50}
                style={{ borderRadius: 50, objectFit: 'cover' }}
              />
            </Col>
            <Col>
              <p className='chat-name'>{choosenChat.name}</p>
            </Col>
          </Row>
          <Row className='messages-list p-0' ref={messagesListRef}>
            <Stack direction='vertical' gap={2}>
              {choosenChat.messages && choosenChat.messages.map((message, index) => (
                <div
                  className={`message d-flex ${message.sender && message.sender.nickname === authUser.nickname ? 'own-message' : 'other-message'}`}
                  key={index}
                >
                  <img
                    src={message.sender && message.sender.avatar_url ? `${SERVER_URL}/${message.sender.avatar_url}` : imagePlaceholder}
                    alt={message.sender && message.sender.first_name}
                    width={30}
                    height={30}
                    style={{ borderRadius: 50, objectFit: 'cover' }}
                  />
                  <div className="message-content">
                    <p><strong>{message.sender && message.sender.first_name}</strong></p>
                    <p>{message.content}</p>
                  </div>
                  <div className="message-time-container">
                    <p className='message-time'>{formatTimestampForMessage(message.timestamp)}</p>
                  </div>
                </div>
              ))}
            </Stack>
          </Row>
          <Row className="message-input p-0">
            <input
              type='text'
              aria-label='Message'
              placeholder="Message"
              value={messageContent}
              onChange={(event) => { setMessageContent(event.target.value); }}
              onKeyDown={handleKeyPress}
            />
            <button className='btn btn-outline-primary' onClick={sendMessage}>Send</button>
          </Row>
        </Col>
      }
    </Row>
  );
}

export default Chat;