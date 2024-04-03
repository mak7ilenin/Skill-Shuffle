import React from 'react';
import { Image, NavLink } from 'react-bootstrap';

import CreateImage from './CreateImage';

function MessageRenderer({ message, index, authUser, chat, formatTimestamp }) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const scrollToBottom = () => {
        if (index !== chat.messages.length - 1) {
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
            {index > 0 && message.sender.nickname === chat.messages[index - 1].sender.nickname ? (
                <div className='message-content-container d-flex'>
                    <div className='message-content message-series flex-column'>{detectUrls(message.content)}</div>
                    <div className="message-time-container">
                        <p className='message-time'>{formatTimestamp(message.timestamp)}</p>
                    </div>
                </div>
            ) : (
                <>
                    <div className='sender-info w-100 d-flex align-items-center mb-2'>
                        <CreateImage
                            url={message.sender.avatar_url}
                            alt={message.sender.nickname}
                            width={30}
                            height={30}
                            rounded={true}
                        />
                        <span className={`sender-name ${message.sender.nickname === authUser.nickname ? 'me-3' : 'ms-3'}`}>
                            <NavLink href={`/users?${message.sender.nickname}`}>{message.sender.first_name}</NavLink>
                        </span>
                    </div>
                    <div className='message-content-container d-flex'>
                        <div className='message-content flex-column'>{detectUrls(message.content)}</div>
                        <div className="message-time-container">
                            <p className='message-time'>{formatTimestamp(message.timestamp)}</p>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default MessageRenderer;