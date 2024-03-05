import { Client } from '@stomp/stompjs';
import React, { useEffect, useState } from 'react';

function Chat() {
  const [client, setClient] = useState(null);
  const [chatId, setChatId] = useState("");
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    const newClient = new Client();
    const websocketUrl = 'ws://localhost:8080/websocket';

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