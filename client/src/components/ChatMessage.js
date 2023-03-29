import React from 'react';
import { useTheme } from '../utils/ThemeContext';

function ChatMessage({ message, id }) {
    console.log('ID', id)
    console.log(message.userId._id)
    const { theme } = useTheme();

    return (
        <>
            <div className={ id === message.userId._id ? 'self header-bold' : 'header-bold other'}
            >{message.userId.firstName}</div>

            <div className={id === message.userId._id ? `${theme}-chat-message-self self` : `${theme}-chat-message-other other`}
            >

                <div>{message.message}</div>
            </div>
            <div className={ id === message.userId._id ? 'self' : 'other'} style={
                id === message.userId._id
                    ? {  marginTop: '10px' }
                    : {marginTop: '10px' }
            }>{message.createdAt}</div>
        </>
    );
};

export default ChatMessage;