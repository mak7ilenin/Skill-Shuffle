import React from 'react';
import { Image } from 'react-bootstrap';

const MessageRenderer = ({ content }) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Function to detect URLs in the message content
    const detectUrls = (content) => {
        return content.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                // Check if the URL points to an image or a GIF
                if (part.match(/\.(jpeg|jpg|gif|png)$/i)) {
                    // Render the URL as an image or GIF
                    return <Image key={index} src={part} alt="Image" />;
                } else if (part.match(/\.(gif)$/i)) {
                    // Render the URL as a GIF
                    return <Image key={index} src={part} alt="GIF" />;
                } else {
                    // Render the URL as a regular link
                    return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
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