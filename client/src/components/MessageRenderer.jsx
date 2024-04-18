import React from 'react';
import { Image, NavLink } from 'react-bootstrap';

import imagePlaceholder from '../assets/icons/image-placeholder.svg';

function MessageRenderer({ message, index, authUser, messageList }) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const scrollToBottom = () => {
        if (index !== messageList.messages.length - 1) {
            return
        } else {
            // Check if the message was sent by the current user
            if (message.sender.nickname === authUser.nickname) {
                // Scroll to the bottom of the .messages-list
                const messagesList = document.querySelector('.messages-list');
                messagesList.scrollTop = messagesList.scrollHeight;
            }
        }
    };

    const formatTimestampForMessage = (timestamp) => {
        const date = new Date(timestamp);
        // hh:mm for the time of the message
        return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
    }

    // Function to detect URLs in the message content
    const detectUrls = (content) => {
        return content.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                // Check if the URL points to an image or a GIF
                if (part.match(/\.(jpeg|jpg|gif|png)$/i)) {
                    // Render the URL as an image or GIF
                    return (
                        <Image
                            key={index}
                            src={part}
                            alt={part.match(/\.gif$/i) ? 'gif' : 'image'}
                            onLoad={scrollToBottom}
                        />
                    );
                } else {
                    // Render the URL as a regular link
                    return <NavLink key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</NavLink>;
                }
            } else {
                // Render the regular text content
                if (part !== '') {
                    return <span key={index}>{part}</span>;
                }
                return part;
            }
        });
    };

    return (
        <>
            {index > 0 && message.sender.nickname === messageList.messages[index - 1].sender.nickname && messageList.messages[index - 1].type !== 'announcement' ? (
                <div className='message-content-container d-flex'>
                    <div className='message-content message-series flex-column'>{detectUrls(message.content)}</div>
                    <div className="message-time-container invisible">
                        <p className='message-time'>{formatTimestampForMessage(message.timestamp)}</p>
                    </div>
                </div>
            ) : (
                <>
                    {message.sender.nickname !== authUser.nickname ? (
                        <div className='message-content-container d-flex flex-wrap'>
                            <div className='sender-avatar d-flex mb-2'>
                                <Image
                                    src={message.sender.avatarUrl !== null ? message.sender.avatarUrl : imagePlaceholder}
                                    alt={message.sender.nickname}
                                    width='35'
                                    height='35'
                                    style={{ objectFit: 'cover' }}
                                    roundedCircle
                                />
                            </div>
                            <div className="d-flex flex-column">
                                <span className='sender-name'>
                                    <NavLink href={`/users?${message.sender.nickname}`}>{message.sender.firstName}</NavLink>
                                </span>
                                <div className="d-flex mt-1">
                                    <div className='message-content flex-column'>{detectUrls(message.content)}</div>
                                    <div className="message-time-container visible">
                                        <p className='message-time'>{formatTimestampForMessage(message.timestamp)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='message-content-container d-flex'>
                            <div className='message-content message-series flex-column'>{detectUrls(message.content)}</div>
                            <div className="message-time-container visible">
                                <p className='message-time'>{formatTimestampForMessage(message.timestamp)}</p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default MessageRenderer;