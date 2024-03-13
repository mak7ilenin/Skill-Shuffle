import React, { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

import { API_SERVER, WEBSOCKET_URL, SERVER_URL } from '../config';

import imagePlaceholder from '../assets/image-placeholder.svg';

function Chat() {
  const [chats, setChats] = useState([]);
  const [client, setClient] = useState(null);
  const [chatId, setChatId] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [jwtResponse, setJwtResponse] = useState(null);

  useEffect(() => {

    // Confirm the user's authentication and get the JWT token
    axios.get(`${API_SERVER}/auth/confirm`, { withCredentials: true })
      .then(response => {
        const jwtResponse = response.data;
        setJwtResponse(jwtResponse);

        // Create a new WebSocket client
        const newClient = new Client();
        const websocketUrl = `ws://${WEBSOCKET_URL}`;
    
        // Connect to the WebSocket after receiving the JWT token
        newClient.configure({
          brokerURL: websocketUrl,
          connectHeaders: {
            Authorization: `Bearer ${jwtResponse.jwtToken}`
          },
          onConnect: () => {
            getChats(jwtResponse.jwtToken);
            
            // Subscribe to a specific chat and receive all messages sent there
            const destination = `/user/chat/${chatId}`;
            newClient.subscribe(destination, (receivedMessage) => {
              console.log('Received message:', JSON.parse(receivedMessage.body));

              // Process the received message as needed
            });
          }
        });
    
        newClient.activate();
        setClient(newClient);
      });


  }, [chatId]);

  const getChats = async (authToken) => {
    try {
      const response = await axios.get(`${API_SERVER}/im`, {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      setChats(response.data);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      }
    }
  };

  const sendMessage = () => {
    const destination = `/app/chat/${chatId}`;
    const message = {
      sender: { username: jwtResponse.username },
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
                src={chat.avatar_url !== null ? `${SERVER_URL}/${chat.avatar_url}` : imagePlaceholder}
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