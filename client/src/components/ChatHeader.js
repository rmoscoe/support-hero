import React from 'react';
import { useTheme } from '../utils/ThemeContext';

function ChatHeader(props) {
    const { theme } = useTheme();

    return (
        <div className={`${theme} title has-text-centered`}>
            <h2 className='header-bold'>{props.roomName}</h2>
        </div>
    );
};

export default ChatHeader;