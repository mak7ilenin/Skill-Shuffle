import React, { useState, useEffect } from 'react';
import GifPicker from 'gif-picker-react';
import EmojiPicker from 'emoji-picker-react';

import { TENOR_API_KEY } from '../config';
import { ReactComponent as GifIcon } from '../assets/icons/gif.svg';
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg';

const EmojiGifPicker = ({ setMessageContent, sendMessage }) => {
    const [showEmojis, setShowEmojis] = useState(false);
    const [showGifs, setShowGifs] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                (showEmojis || showGifs) &&
                !event.target.closest('.icons-container')
            ) {
                setShowEmojis(false);
                setShowGifs(false);
            }
        };

        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [showEmojis, showGifs]);

    return (
        <div className="icons-container">
            <div className="emoji-icon message-icon">
                <EmojiIcon
                    width={25}
                    height={25}
                    onClick={() => {
                        setShowEmojis(!showEmojis);
                        setShowGifs(false);
                    }}
                />
            </div>

            <div className="gif-icon message-icon">
                <GifIcon
                    width={30}
                    height={30}
                    onClick={() => {
                        setShowGifs(!showGifs);
                        setShowEmojis(false);
                    }}
                />
            </div>

            {showEmojis && (
                <div className="emoji-picker" onClick={(e) => e.stopPropagation()}>
                    <EmojiPicker
                        theme='light'
                        emojiStyle='apple'
                        suggestedEmojisMode='frequent'
                        emojiVersion='4.0'
                        autoFocusSearch={true}
                        onEmojiClick={(emoji) => {
                            setMessageContent((prevContent) => prevContent + emoji.emoji);
                        }}
                    />
                </div>
            )}

            {showGifs && (
                <div className="gif-picker" onClick={(e) => e.stopPropagation()}>
                    <GifPicker
                        tenorApiKey={TENOR_API_KEY}
                        autoFocusSearch={true}
                        theme='light'
                        contentFilter='off'
                        categoryHeight={115}
                        width={500}
                        height={520}
                        onGifClick={(gif) => {
                            sendMessage(gif);
                            setShowGifs(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default EmojiGifPicker;