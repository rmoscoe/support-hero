import React from 'react';
import { useTheme } from '../utils/ThemeContext';
import ChatMessage from '../components/ChatMessage';

function ChatMessageList({ messages, id }) {
    const { theme } = useTheme();

    return (
        <section className={`section ${theme}-secondary-bg ${theme}-shadow`}>
            {messages.map((message, index) => (
                <div key={index}>
                    <ChatMessage message={message} id={id} />
                </div>
            ))}
        </section>
    );
};

export default ChatMessageList;