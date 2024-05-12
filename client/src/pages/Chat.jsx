import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Row, Stack, Button, Spinner } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AESEncrypt, AESDecrypt } from '../crypto';
import { API_SERVER } from '../config';
import { useAuth } from '../components/AuthContext';
import MessageRenderer from '../components/MessageRenderer';
import ChatHeader from '../components/ChatHeader';
import ChatMenu from '../components/ChatMenu';
import MessageNotification from '../components/MessageNotification';
import EmojiGifPicker from '../components/EmojiGifPicker';

import ChatBackground from '../assets/images/chat-background.jpg'
import { ReactComponent as Send } from '../assets/icons/send.svg';

function Chat() {
  const { authUser, stompClient, isStompClientInitialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [chats, setChats] = useState([]);
  const [chosenChat, setChosenChat] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageNotification, setMessageNotification] = useState({ visible: false, notification: {} });
  const [activeMenu, setActiveMenu] = useState('DEFAULT'); // 'CREATE_CHAT', 'GROUP_MENU', or 'DEFAULT'
  const currentSubscriptionRef = useRef(null);
  const activeChatsSubscription = useRef(null);
  const messagesListRef = useRef(null);
  const chatRef = useRef(null);
  const chatsRef = useRef(null);
  const offsetRef = useRef(0);
  const limit = 30;


  const updateChatLastMessage = useCallback((message) => {
    const updatedChats = chatsRef.current.map(chat => {
      // Decrypted chat ID
      const chatId = AESDecrypt(chat.id);

      // If the message is from this chat, update the last message
      if (chatId === String(message.chatId)) {
        chat.lastMessage = message;

        // If the chat is not the chosen chat, increment the unreadMessages
        if (chosenChat && chatId !== String(chosenChat.id)) {
          chat.unreadMessages += 1;
        }
      }
      return chat;
    });
    setChats(updatedChats);
  }, [chosenChat]);


  const getChatMessages = useCallback((chatId) => {
    axios.get(`${API_SERVER}/chats/${chatId}`, { withCredentials: true })
      .then(response => {
        setChosenChat(response.data);
        offsetRef.current = 0;

        // Set the chat unreadMessages to 0
        const updatedChats = chatsRef.current.map(chat => {
          if (AESDecrypt(chat.id) === String(chatId)) {
            chat.unreadMessages = 0;
          }
          return chat;
        });
        setChats(updatedChats);

        // Hide loading spinner
        setLoadingMessages(false);

        setTimeout(() => {
          scrollToPosition(messagesListRef.current.scrollHeight);
        }, 50);

      })
      .catch(error => {
        navigate('/messenger')
        console.error(error.response?.data.message || error.message);
      });
  }, [setLoadingMessages, messagesListRef, navigate]);


  const subscribeToChat = useCallback(() => {
    // Ensure stompClient is initialized before attempting to subscribe
    if (isStompClientInitialized && stompClient) {

      // Unsubscribe from the previous chat messages
      if (currentSubscriptionRef.current && chosenChat && currentSubscriptionRef.current.chatId !== chosenChat.id) {
        currentSubscriptionRef.current.unsubscribe();
        currentSubscriptionRef.current = null;
      }

      // If user is in chat, then subscribe to chat messages
      if (!currentSubscriptionRef.current) {
        const chatEndpoint = `/user/chat/${chosenChat.id}`;
        const newSubscription = stompClient.subscribe(chatEndpoint, receivedMessage => {
          const message = JSON.parse(receivedMessage.body);
          updateChatLastMessage(message);
          setChosenChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, message]
          }));
          setTimeout(() => {
            if (messagesListRef.current) {
              scrollToPosition(messagesListRef.current.scrollHeight);
            }
          }, 50);
        });
        newSubscription.chatId = chosenChat.id;

        // Update current subscription
        currentSubscriptionRef.current = newSubscription;

        // Remove horizontal scrolling in document
        document.body.style.overflowX = 'hidden';

        return () => {
          // Unsubscribe from chat messages when component unmounts
          newSubscription.unsubscribe();
        };
      }
    }
  }, [stompClient, updateChatLastMessage, isStompClientInitialized, chosenChat]);


  const subscribeToAllChats = useCallback(() => {
    // Ensure stompClient is initialized before attempting to subscribe
    if (isStompClientInitialized && stompClient) {
      const chatEndpoint = `/user/chat`;
      const newSubscription = stompClient.subscribe(chatEndpoint, receivedMessage => {
        // [0] is notification, [1] is message
        const parsedMessage = JSON.parse(receivedMessage.body);
        const notification = parsedMessage[0];
        const message = parsedMessage[1];

        // Update chat last message
        updateChatLastMessage(message);

        // Check if received message is not from muted chat (each chat has field isMuted)
        chatsRef.current.forEach(chat => {
          if (AESDecrypt(chat.id) === String(notification.chat.id)) {
            setMessageNotification({ visible: true, notification: notification });
          }
        });
      });
      activeChatsSubscription.current = newSubscription;

      return () => {
        newSubscription.unsubscribe();
      };
    }
  }, [stompClient, isStompClientInitialized, updateChatLastMessage]);


  useEffect(() => {
    if (chosenChat && chosenChat.id) {
      subscribeToChat();
    }
  }, [chosenChat, subscribeToChat]);


  useEffect(() => {
    if (!activeChatsSubscription.current) {
      subscribeToAllChats();
    }
  }, [subscribeToAllChats]);


  const overflowBody = useCallback(() => {
    if (window.innerWidth < 958) {
      document.body.style.overflow = 'hidden';
    }
  }, []);


  useEffect(() => {
    chatsRef.current = chats;
    overflowBody();
  }, [chats, overflowBody]);


  window.addEventListener('resize', overflowBody);

  const sendMessage = (gif) => {
    if (messageContent === '' && !gif) return;
    setMessageContent('');

    const destination = `/app/chat`;
    const message = {
      sender: authUser,
      chat: { id: chosenChat.id },
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


  const scrollToPrev = (prevScrollTop, prevScrollHeight) => {
    // Calculate the difference in scroll height
    const newScrollHeight = messagesListRef.current.scrollHeight;
    const scrollHeightDifference = newScrollHeight - prevScrollHeight;

    // Adjust scroll position to maintain the relative position of the first visible message
    chatRef.current.scrollTop = prevScrollTop + scrollHeightDifference;
  }


  const loadMoreMessages = async () => {
    const prevScrollHeight = messagesListRef.current.scrollHeight;
    const prevScrollTop = chatRef.current.scrollTop;
    offsetRef.current += limit;

    setLoadingMessages(true);

    try {
      const response = await axios.get(`${API_SERVER}/chats/${chosenChat.id}/messages?offset=${offsetRef.current}&limit=${limit}`, { withCredentials: true });
      const newMessages = response.data;
      setChosenChat(prevChat => ({
        ...prevChat,
        messages: [...newMessages, ...prevChat.messages],
      }));

      setLoadingMessages(false);

      setTimeout(() => {
        scrollToPrev(prevScrollTop, prevScrollHeight);
      }, 50);

    } catch (error) {
      console.error('Error loading more messages:', error);
    }
  };


  const getFormattedDate = (date, format = 'en-GB') => {
    const options = { day: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString(format, options);
  };


  // Group messages by day for better readability
  const messagesByDay = useMemo(() => {
    if (!chosenChat) {
      return;
    }

    if (chosenChat.messages === undefined) {
      return [];
    }

    const groupedMessages = [];
    let currentDay = null;

    chosenChat.messages.forEach((message) => {
      // Format date to display in the message list as 'Today', 'Yesterday', or the date itself
      const today = getFormattedDate(new Date());
      const messageDate = getFormattedDate(message.timestamp);
      let messageDay = messageDate === today ? 'Today' : messageDate;

      if (messageDay === getFormattedDate(new Date(new Date().setDate(new Date().getDate() - 1)))) {
        messageDay = 'Yesterday';
      }

      if (messageDay !== currentDay) {
        groupedMessages.push({ day: messageDay, messages: [] });
        currentDay = messageDay;
      }

      groupedMessages[groupedMessages.length - 1].messages.push(message);
    });

    return groupedMessages;
  }, [chosenChat]);


  const handleMenuChange = (menuName) => {
    setActiveMenu(menuName);
  }


  const handleScroll = () => {
    const { scrollTop } = chatRef.current;
    if (scrollTop === 0 && !loadingMessages) {
      loadMoreMessages();
    }
  };


  const scrollToPosition = (position) => {
    if (messagesListRef.current && chatRef.current) {
      chatRef.current.scrollTop = position;
    }
  };

  // ---------------------------- //

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
        // Encrypt the chat IDs before storing them
        response.data.forEach(chat => {
          chat.id = AESEncrypt(chat.id.toString());
        });

        // Set the chats and filtered chats
        setChats(response.data);
      })
      .catch(error => {
        console.error(error.response?.data.message || error.message);
      });
  }, []);


  return (
    <div className="chat-page w-100 h-100 d-flex">

      <MessageNotification
        setMessageNotification={setMessageNotification}
        messageNotification={messageNotification}
        chat={chosenChat}
      />

      <ChatMenu
        chats={chats}
        chat={chosenChat}
        setChat={setChosenChat}
        handleMenuChange={handleMenuChange}
        activeMenu={activeMenu}
      />

      {!chosenChat ? (
        // If no chat is selected, display:
        <div className='chat-box non-selected d-flex justify-content-center align-items-center' style={{ backgroundImage: `url(${ChatBackground})` }}>
          <p className='no-chat-selected'>Select chat</p>
        </div>
      ) :
        // If a chat is selected, display:
        <div className='chat-box d-flex flex-nowrap flex-column'>

          <ChatHeader
            chat={chosenChat}
            setChat={setChosenChat}
            setChats={setChats}
            handleMenuChange={handleMenuChange}
          />

          <Row className='messages-list p-0 py-3' ref={chatRef} onScroll={handleScroll}>
            {messagesByDay && messagesByDay.length === 0 && !loadingMessages && (
              <div className='no-messages d-flex justify-content-center align-items-center w-100 h-100'>
                Your message history will be displayed here.
              </div>
            )}
            {loadingMessages ? (
              <div className='d-flex justify-content-center align-items-center w-100'>
                <Spinner animation='border' variant='secondary' />
              </div>
            ) : (
              <Stack direction='vertical' gap={1} ref={messagesListRef}>
                {messagesByDay.map((dayMessages) => (
                  <React.Fragment key={dayMessages.day}>
                    <div className='date-separator my-2'>{dayMessages.day}</div>

                    {dayMessages.messages.map((message, index) => (
                      <React.Fragment key={message.id}>
                        {message.type === 'message' ? (
                          <div className={`message d-flex flex-wrap ${message.sender.nickname === authUser.nickname ? 'own-message' : 'other-message'}`}>
                            <MessageRenderer
                              message={message}
                              index={index}
                              authUser={authUser}
                              messageList={dayMessages}
                            />
                          </div>
                        ) : null}

                        {message.type === 'announcement' ? (
                          <div className='announcement w-100 d-flex justify-content-center my-2'>
                            <span dangerouslySetInnerHTML={{ __html: message.content }} />
                          </div>
                        ) : null}
                      </React.Fragment>
                    ))}

                  </React.Fragment>
                ))}
              </Stack>
            )}
          </Row>

          <Row className="message-input p-0 d-flex">
            <div className="input-container p-0">
              <input
                type='text'
                name='message'
                className='w-100 h-100'
                placeholder='Type a message...'
                autoComplete='off'
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

            <Button variant='primary-outline' className='btn-send' onClick={() => sendMessage(undefined)}>
              <Send />
            </Button>
          </Row>
        </div>
      }
    </div>
  );
}

export default Chat;