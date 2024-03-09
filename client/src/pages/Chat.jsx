import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

import imagePlaceholder from '../assets/image-placeholder.svg';

function Chat() {
  const [chats, setChats] = useState([]);
  const [client, setClient] = useState(null);
  const [chatId, setChatId] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const getChats = async (authToken) => {
    try {
      const response = await axios.get('http://localhost:8080/im', { 
        headers: {
          "Authorization": `Bearer ${authToken}` }
      });
      setChats(response.data);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {

    const newClient = new Client();
    const authUser = JSON.parse(sessionStorage.getItem('authUser'));

    const verifySSL = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    const websocketUrl = `${verifySSL}localhost:8080/ws`;

    // Connect to the WebSocket
    newClient.configure({
      brokerURL: websocketUrl,
      connectHeaders: {
        username: authUser.username,
        password: authUser.password
      },
      onConnect: () => {
        getChats(authUser.jwtToken);

        // Subscribe to a specific chat and receive all messages sent there
        const destination = `/user/chat/${chatId}`;
        newClient.subscribe(destination, (receivedMessage) => {
          console.log('Received message:', JSON.parse(receivedMessage.body));

          // Process the received message as needed
        });
      },
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      newClient.deactivate();
    };

  }, [chatId]);

  const sendMessage = () => {
    const destination = `/app/chat/${chatId}`;
    const message = {
      sender: { id: 6 }, // Replace with the sender's ID
      chat: { id: chatId },
      content: messageContent,
      timestamp: new Date().toISOString()
    };
    if (client != null) {
      client.publish({
        destination,
        body: JSON.stringify(message),
      });
    }
  };

  return (
    <div className="chat-page">
      <Container className="users-list">
        {chats.map(chat => (
          <Row className='user-container' key={chat.id}>
            <Col>
              <img
                src={chat.avatar_url !== null ? `http://localhost:8080/${chat.avatar_url}` : imagePlaceholder}
                alt={chat.name}
                width={50}
                height={50}
                style={{ borderRadius: 50, objectFit: 'cover' }}
              />
            </Col>
            <Col>
              <p>{chat.name}</p>
            </Col>
          </Row>
        ))}
      </Container>
      <div className="chat-box">
        <div className="chat-messages">
          <div className="message">
            <img src={imagePlaceholder} alt="User" />
            <div className="message-content">
              <p>Message content</p>
              <span>Timestamp</span>
            </div>
          </div>
        </div>
        <div className="chat-input">
          <input type='text' aria-label='Message' placeholder="Message" />
          <button>Send</button>
        </div>
      </div>
      <p>
        <input type='number' aria-label='ChatId' placeholder="Chat ID" onChange={(event) => {
          setChatId(event.target.value);
        }} />
        <input type='text' aria-label='Message' placeholder="Message" onChange={(event) => {
          setMessageContent(event.target.value);
        }} />
        <button onClick={sendMessage}>Send</button>
      </p>
    </div>
  );
}

export default Chat;