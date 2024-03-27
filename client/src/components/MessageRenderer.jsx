import React from 'react';
import { Image, NavLink } from 'react-bootstrap';

const MessageRenderer = ({ content, messagesLength, ownMessage }) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const scrollToBottom = () => {
        let messagesListLength = messagesLength[0];
        let currentMessageIndex = messagesLength[1];
        if (currentMessageIndex !== messagesListLength) {
            return
        } else {
            if (ownMessage) {
                // Scroll to the bottom of the .messages-list
                const messagesList = document.querySelector('.messages-list');
                messagesList.scrollTop = messagesList.scrollHeight;
            }
        }
    }

    // Function to detect URLs in the message content
    const detectUrls = (content) => {
        return content.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                // Check if the URL points to an image or a GIF
                if (part.match(/\.(jpeg|jpg|gif|png)$/i)) {
                    // Render the URL as an image or GIF
                    return <Image key={index} src={part} alt="" onLoad={scrollToBottom} />;
                } else {
                    // Render the URL as a regular link
                    return <NavLink key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</NavLink>;
                }
            } else {
                // Render the regular text content
                return part;
            }
        });
    };

    return (
        <div className='message-text'>
            {detectUrls(content)}
        </div>
    );
};

export default MessageRenderer;