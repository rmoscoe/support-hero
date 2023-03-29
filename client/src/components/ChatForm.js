import React from 'react';
import { useForm } from 'react-hook-form';
import { useTheme } from "../utils/ThemeContext";

const ChatForm = React.forwardRef((props, ref) => {
    const defaultValues = {
        roomId: props.roomId,
        message: "",
        userId: props.userId
    };

    const { theme } = useTheme();

    // const [ createChatMessage, { loading }] = useMutation(CREATE_CHAT_MESSAGE);
    const { register } = useForm({ defaultValues });

    // const onSubmit = async (formData) => {
    //     try {
    //         console.log(formData);
    //         props.handleSubmit(formData);
    //         reset();
    //         const newMessage = await createChatMessage({
    //             variables: { 
    //                 message: formData.message,
    //                 roomId: defaultValues.roomId,
    //                 userId: defaultValues.userId
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     };
    // };

    return (
        <div className="body create-chat-message-form" style={{marginBottom: '35px'}} ref={ref}>
            <form onSubmit={props.handleSubmit} >
                <div className="field">
                    <label className={`header mt-5 ${theme} label`}>New message:</label>
                    <div className="control">
                        <input className={`body ${theme} input`} placeholder="Message..." type="text" {...register('message', { required: false })} value={props.message} onChange={(e) => props.setMessage(e.target.value)} />
                    </div>
                </div>
                <div className="buttons">
                    <button className={`header-bold button ${theme}-primary`} type="submit" >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
});

export default ChatForm;