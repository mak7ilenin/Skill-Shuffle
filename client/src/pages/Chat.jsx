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

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

function Chat() {
  const { authUser, setAuthUser, stompClient, isStompClientInitialized } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
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
        if (!chosenChat || chatId !== String(chosenChat.id)) {
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

        // Reset chat unreadMessages and decrease authUser unreadMessages
        const updatedChats = chatsRef.current.map(chat => {
          if (AESDecrypt(chat.id) === String(chatId)) {
            setAuthUser(prevAuthUser => {
              return {
                ...prevAuthUser,
                unreadMessages: prevAuthUser.unreadMessages - chat.unreadMessages
              };
            });

            chat.unreadMessages = 0;
          }
          return chat;
        });
        setChats(updatedChats);

        // Hide loading spinner
        setLoadingMessages(false);

        const interval = setInterval(() => {
          if (messagesListRef.current) {
            scrollToPosition(messagesListRef.current.scrollHeight);
            clearInterval(interval);
          }
        }, 50);

      })
      .catch(error => {
        navigate('/messenger')
        console.error(error.response?.data.message || error.message);
      });
  }, [setLoadingMessages, messagesListRef, navigate, setAuthUser, chatsRef]);


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

          // Set chosen chat messages
          setChosenChat(prevChat => {
            return {
              ...prevChat,
              messages: [...prevChat.messages, message]
            };
          });

          const interval = setInterval(() => {
            if (messagesListRef.current) {
              scrollToPosition(messagesListRef.current.scrollHeight);
              clearInterval(interval);
            }
          }, 50);
        });

        // Update current subscription
        newSubscription.chatId = chosenChat.id;
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

        chatsRef.current.forEach(chat => {
          // Show notification and increment unreadMessages in chat where notification from
          if (AESDecrypt(chat.id) === String(notification.chat.id)) {

            // If notification type is message, increase unread messages number
            if (notification.type === 'CHAT_MESSAGE') {
              setAuthUser(prevAuthUser => {
                return {
                  ...prevAuthUser,
                  unreadMessages: prevAuthUser.unreadMessages + 1
                };
              });
            }

            // If chat is not muted - show the notification
            if (!chat.muted) {
              setMessageNotification({ visible: true, notification: notification });
            }
          }
        });
      });
      activeChatsSubscription.current = newSubscription;

      return () => {
        newSubscription.unsubscribe();
      };
    }
  }, [stompClient, isStompClientInitialized, updateChatLastMessage, setAuthUser]);


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


  useEffect(() => {
    chatsRef.current = chats;
    const header = document.querySelector('.header');

    handleResize();
    function handleResize() {
      setWindowDimensions(getWindowDimensions());

      header.classList.add('closed');

      if (windowDimensions.width < 958 && chosenChat) {
        document.body.style.overflow = 'hidden';
      }

      if (windowDimensions.width < 520 && chosenChat) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      header.classList.remove('hidden');
    }
  }, [windowDimensions.width, chosenChat, chats]);


  const sendMessage = (gif) => {
    if (messageContent === '' && !gif) return;
    setMessageContent('');

    // Assign sender and remove unnecessary property
    const sender = authUser;
    delete sender.unreadMessages;

    const destination = `/app/chat`;
    const message = {
      sender: sender,
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
    console.log(messagesListRef.current);
    if (messagesListRef.current) {

      // Calculate the difference in scroll height
      const newScrollHeight = messagesListRef.current.scrollHeight;
      const scrollHeightDifference = newScrollHeight - prevScrollHeight;

      // Adjust scroll position to maintain the relative position of the first visible message
      chatRef.current.scrollTop = prevScrollTop + scrollHeightDifference;

    }
  };


  const loadMoreMessages = () => {
    const prevScrollHeight = messagesListRef.current.scrollHeight;
    const prevScrollTop = chatRef.current.scrollTop;
    offsetRef.current += limit;

    setLoadingMessages(true);

    try {
      axios.get(`${API_SERVER}/chats/${chosenChat.id}/messages?offset=${offsetRef.current}&limit=${limit}`, { withCredentials: true })
        .then(response => {
          if (response.data.length > 0) {
            setChosenChat(prevChat => {
              return {
                ...prevChat,
                messages: response.data.concat(prevChat.messages)
              };
            });

            setLoadingMessages(false);

            const interval = setInterval(() => {
              if (chatRef.current.scrollTop === 0) {
                scrollToPrev(prevScrollTop, prevScrollHeight);
                clearInterval(interval);
              }
            }, 50);
          } else {
            setLoadingMessages(false);
          }
        });
    } catch (error) {
      console.error('Error loading more messages:', error);
      setLoadingMessages(false);
    }
  };


  const getFormattedDate = (date, format = 'en-GB') => {
    const options = { day: 'numeric', month: 'long' };
    return new Date(date).toLocaleDateString(format, options);
  };


  // Group messages by day for better readability
  const messagesByDay = useMemo(() => {
    if (!chosenChat || !chosenChat.messages) {
      return [];
    }

    const groupedMessages = [];
    let currentDay = null;

    chosenChat.messages.forEach((message) => {
      if (chosenChat.messages.length > 0 && message.type !== 'entry') {
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
      }
    });

    return groupedMessages;
  }, [chosenChat]);


  const handleMenuChange = (menuName) => {
    setActiveMenu(menuName);
    if (chosenChat && menuName === 'DEFAULT') {
      document.querySelector('.chat-box').classList.remove('non-selected');
      document.querySelector('.search-btn').classList.remove('invisible');
    } else {
      document.querySelector('.chat-box').classList.add('non-selected');
      document.querySelector('.search-btn').classList.add('invisible');
    }
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
        subscription={currentSubscriptionRef}
        handleMenuChange={handleMenuChange}
        activeMenu={activeMenu}
      />

      {!chosenChat ? (
        // If no chat is selected, display:
        <div className='chat-box non-selected d-flex justify-content-center align-items-center' style={{ backgroundImage: `url(${ChatBackground})` }}>
          <p>Select chat</p>
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
                        ) : message.type === 'announcement' ? (
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
                autoFocus
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

            <EmojiGifPicker
              setMessageContent={setMessageContent}
              sendMessage={sendMessage}
              emojisVisibility={true}
              gifsVisibility={true}
            />

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