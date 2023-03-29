import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import ChatMessage from '../components/ChatMessage';

function ChatMessageList({ messages }) {
    const { theme } = useTheme();

    return (
        <section className={`section ${theme}-primary-bg ${theme}-shadow`}>
            {messages.map((message, index) => (
                <div style={{border: '1px solid black'}} className={`${theme}-secondary-bg card my-5`} key={index}>
                    <ChatMessage message={message} />
                </div>
            ))}
        </section>
    );
};

export default ChatMessageList;