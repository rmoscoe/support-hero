import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_CHAT_MESSAGE } from '../utils/mutations';
import { useTheme } from "../utils/ThemeContext";

const ChatForm = (props) => {
    const defaultValues = {
        roomId: props.roomId,
        message: "",
        userId: props.userId
    };

    const { theme } = useTheme();
    const [ createChatMessage, { loading }] = useMutation(CREATE_CHAT_MESSAGE);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });

    const onSubmit = async (formData) => {
        try {
            console.log(formData);
            const newMessage = await createChatMessage({
                variables: { 
                    message: formData.message,
                    roomId: defaultValues.roomId,
                    userId: defaultValues.userId
                }
            });
            console.log(newMessage);
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <div className="body create-chat-message-form" style={{marginBottom: '35px'}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <label className={`header mt-5 ${theme} label`}>Message:</label>
                    <div className="control">
                        <input className={`body ${theme} input`} placeholder="Message..." type="text" {...register('message', { required: false })} />
                    </div>
                </div>
                <div className="buttons">
                    <button className={`header-bold button ${theme}-primary`} type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatForm;