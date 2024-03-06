import React, { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';
import imagePlaceholder from '../assets/image-placeholder.svg';

function Chat() {
  const [chats, setChats] = useState([]);
  const [client, setClient] = useState(null);
  const [chatId, setChatId] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const getChats = async () => {
    try {
      const response = await axios.get('http://localhost:8080/me');
      setChats(response.data);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {

    // Data fetching
    getChats();

    const newClient = new Client();
    const websocketUrl = 'ws://localhost:8080/ws';

    // Connect to the WebSocket server
    newClient.configure({
      brokerURL: websocketUrl,
      onConnect: () => {
        // Perform actions after successful connection
        const destination = `/topic/chat/${chatId}`; // Specify the destination for the server-side message handler
        newClient.subscribe(destination, (message) => {
          console.log('Received message:', JSON.parse(message.body));
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
      <div className="users-list">
        <Container>
          <Row>
            {chats.map(chat => (
              <Col>
                <div className="user" key={chat.id}>
                  <img 
                    src={chat.avatar_url !== null ? `http://localhost:8080${chat.avatar_url}` : imagePlaceholder}
                    alt={chat.name}
                  />
                  <p>{chat.name}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
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
        <input type='text' aria-label='ChatId' placeholder="Chat ID" onChange={(event) => {
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