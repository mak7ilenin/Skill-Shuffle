import React, { useEffect, useState, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { Row, Stack, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { AESEncrypt, AESDecrypt } from '../crypto';
import { API_SERVER } from '../config';
import { useAuth } from '../components/AuthContext';
import MessageRenderer from '../components/MessageRenderer';
import ChatHeader from '../components/ChatHeader';
import ChatMenu from '../components/ChatMenu';

import EmojiGifPicker from '../components/EmojiGifPicker';
import ChatBackground from '../assets/images/chat-background.jpg'

function Chat() {
  const { authUser, stompClient, isStompClientInitialized } = useAuth();
  const location = useLocation();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [choosenChat, setChoosenChat] = useState({});
  const [messageContent, setMessageContent] = useState('');
  const currentSubscriptionRef = useRef(null);
  const messagesListRef = useRef(null);
  const firstMessageRef = useRef(null);
  const offsetRef = useRef(0);
  const limit = 30;


  const updateChatLastMessage = useCallback((message) => {
    message = message.content === undefined ? message[message.length - 1] : message;
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (AESDecrypt(chat.id) === message.chat.id.toString()) {
          return {
            ...chat,
            lastMessage: { ...chat.lastMessage, content: message.content }
          };
        }
        return chat;
      });
    });
  }, []);


  const getChatMessages = useCallback((chatId) => {
    axios.get(`${API_SERVER}/chats/${chatId}`, { withCredentials: true })
      .then(response => {
        setChoosenChat(response.data);
        offsetRef.current = 0;
      })
      .catch(error => {
        console.error(error.response?.data.message || error.message);
      });
  }, [setChoosenChat]);


  const subscribeToChat = useCallback((chatId) => {
    // Ensure stompClient is initialized before attempting to subscribe
    if (isStompClientInitialized && stompClient) {

      // Unsubscribe from the previous chat messages
      if (currentSubscriptionRef.current) {
        currentSubscriptionRef.current.unsubscribe();
      }

      // Subscribe to chat messages
      const chatEndpoint = `/user/chat/${chatId}`;
      const newSubscription = stompClient.subscribe(chatEndpoint, receivedMessage => {
        const message = JSON.parse(receivedMessage.body);
        updateChatLastMessage(message);
        setChoosenChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, message]
        }));
      });

      // Update current subscription
      currentSubscriptionRef.current = newSubscription;

      return () => {
        // Unsubscribe from chat messages when component unmounts
        newSubscription.unsubscribe();
      };
    } else {
      console.error('STOMP client is not initialized.');
    }
  }, [stompClient, updateChatLastMessage, isStompClientInitialized]);


  useEffect(() => {
    if (choosenChat.id !== undefined) {
      subscribeToChat(choosenChat.id);
    }
  }, [choosenChat.id, subscribeToChat]);


  const sendMessage = (gif) => {
    if (messageContent === '' && !gif) return;
    setMessageContent('');

    const destination = `/app/chat`;
    const message = {
      sender: authUser,
      chat: { id: choosenChat.id },
      content: gif ? gif.url : messageContent,
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
      setLoading(false);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setLoading(false);
    }
  };


  const messagesByDay = useMemo(() => {
    const groupedMessages = [];
    let currentDay = null;

    choosenChat.messages.forEach((message, index) => {
      const messageDay = new Date(message.timestamp).toLocaleDateString();

      if (messageDay !== currentDay) {
        groupedMessages.push({ day: messageDay, messages: [] });
        currentDay = messageDay;
      }

      groupedMessages[groupedMessages.length - 1].messages.push(message);
    });

    return groupedMessages;
  }, [choosenChat.messages]);


  const handleScroll = () => {
    const { scrollTop } = messagesListRef.current;
    if (scrollTop === 0 && !loading) {
      loadMoreMessages();
    }
    setScrollPosition(scrollTop);
  };

  const scrollToPosition = (position) => {
    if (messagesListRef.current) {
      messagesListRef.current.scrollTop = position;
    }
  };

  const openChatMenu = () => {
    // 
  };

  // ---------------------------- //

  useEffect(() => {
    if (messagesListRef.current) {
      setScrollPosition(messagesListRef.current.scrollHeight);
    }
  }, [choosenChat]);


  useLayoutEffect(() => {
    scrollToPosition(scrollPosition);
  }, [choosenChat, scrollPosition]);


  // Get the current chat via the encrypted chat ID in the URL
  useEffect(() => {
    const encryptedChatId = new URLSearchParams(location.search).get('c');
    if (encryptedChatId) {
      try {
        // Decrypt the chat ID
        const decryptedChatId = AESDecrypt(encryptedChatId);
        if (decryptedChatId !== '' && !isNaN(decryptedChatId)) {
          // Get the current chat messages
          getChatMessages(decryptedChatId);
        }
      } catch (error) {
        console.error("Error decrypting chat: ", error);
      }
    }
  }, [location.search, getChatMessages]);


  useEffect(() => {
    axios.get(`${API_SERVER}/chats`, { withCredentials: true })
      .then(response => {
        // If last message is null, then not include it in the chats
        response.data = response.data.filter(chat => chat.lastMessage !== null);

        // Encrypt the chat IDs before storing them
        response.data.forEach(chat => {
          chat.id = AESEncrypt(chat.id.toString());
        });

        // Set the chats and filtered chats
        setChats(response.data);
        setFilteredChats(response.data);
      })
      .catch(error => {
        console.error(error.response?.data.message || error.message);
      });
  }, []);


  return (
    <div className="chat-page w-100 d-flex">

      <ChatMenu
        chats={chats}
        setFilteredChats={setFilteredChats}
        filteredChats={filteredChats}
      />

      {choosenChat.id === undefined ? (
        // If no chat is selected, display:
        <div className='chat-box non-selected' key={choosenChat.id} style={{ backgroundImage: `url(${ChatBackground})` }}>
          <p className='no-chat-selected'>Select chat</p>
        </div>
      ) :
        // If a chat is selected, display:
        <div className='chat-box d-flex flex-nowrap flex-column' key={choosenChat.id}>

          <ChatHeader chat={choosenChat} openChatMenu={openChatMenu} />

          <Row className='messages-list p-0 py-3' ref={messagesListRef} onScroll={handleScroll}>
            <Stack direction='vertical' gap={1}>
              {messagesByDay.map((dayMessages, index) => (
                <>
                  <div className='date-separator mt-3'>{dayMessages.day}</div>
                  {dayMessages.messages.map((message, index) => (
                    <>
                      {message.type !== 'entry' && message.type !== 'announcement' ? (
                        <div
                          className={`message d-flex flex-wrap ${message.sender.nickname === authUser.nickname ? 'own-message' : 'other-message'} ${index > 0 && message.sender.nickname === choosenChat.messages[index - 1].sender.nickname ? '' : 'mt-2'}`}
                          key={index}
                          ref={index === 0 ? firstMessageRef : null}
                        >
                          <MessageRenderer
                            message={message}
                            index={index}
                            authUser={authUser}
                            chat={choosenChat}
                          />
                        </div>
                      ) : null}
                      {message.type === 'announcement' ? (
                        <div className='announcement w-100 d-flex justify-content-center mt-3' key={index}>
                          {message.content}
                        </div>
                      ) : null}
                    </>
                  ))}
                </>
              ))}
              {/* {choosenChat.messages && choosenChat.messages.map((message, index) => (
                <>
                  {message.type !== 'entry' && message.type !== 'announcement' ? (
                    <div
                      className={`message d-flex flex-wrap ${message.sender.nickname === authUser.nickname ? 'own-message' : 'other-message'} ${index > 0 && message.sender.nickname === choosenChat.messages[index - 1].sender.nickname ? '' : 'mt-2'}`}
                      key={index}
                      ref={index === 0 ? firstMessageRef : null}
                    >
                      <MessageRenderer
                        message={message}
                        index={index}
                        authUser={authUser}
                        chat={choosenChat}
                      />
                    </div>
                  ) : null}
                  {message.type === 'announcement' ? (
                    <div className='announcement w-100 d-flex justify-content-center mt-3' key={index}>
                      {message.content}
                    </div>
                  ) : null}
                </>
              )
              )} */}
            </Stack>
          </Row>

          <Row className="message-input p-0 d-flex">
            <div className="input-container p-0">
              <input
                type='text'
                name='message'
                className='w-100 h-100'
                placeholder='Type a message...'
                value={messageContent}
                onChange={(event) => setMessageContent(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage(undefined);
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

            <Button variant='outline-primary' className='btn-send' onClick={() => sendMessage(undefined)}>
              Send
            </Button>
          </Row>
        </div>
      }
    </div>
  );
}

export default Chat;