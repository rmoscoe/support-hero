import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_TICKET } from '../utils/mutations';
import { useTheme } from "../utils/ThemeContext";

const CreateTicket = (props) => {
    const [createTicket, { loading }] = useMutation(CREATE_TICKET);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    
    const onSubmit = async (formData) => {
        try {
            await createTicket({
                variables: {
                    title: formData.title,
                    description: formData.description,
                    priority: formData.priority,
                    userId: props.userId
                },
            });
            props.handleCloseCreateTicket();
            props.refetchTicketData()
        } catch (error) {
            console.error(error);
        }
    };

    const onClose = () => {
        const modal = document.getElementById('create-ticket-form');
        modal.classList.remove('is-active');
        props.handleCloseCreateTicket();
    };
    const { theme } = useTheme();

    return (
        <div id="create-ticket-form" className={`modal ${props.isActive ? "is-active" : ""}`}>
            <div className="modal-background">
                <div className={`modal-content ${theme}`}>
                    <header className={`${theme} modal-card-head title`}>
                        <p className={`${theme} modal-card-title`}>Create Ticket</p>
                        <button className="delete" aria-label="close" onClick={onClose}></button>
                    </header>
                    <section className={`${theme} modal-card-body`}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <label className={`${theme} label`}>Title:</label>
                                <div className="control">
                                    <input className={`${theme} input`} placeholder="Summary of the issue" type="text" {...register('title', { required: true })} />
                                    {errors.title && <span className="error">This field is required</span>}
                                </div>
                            </div>
                            <div className="field">
                                <label className={`${theme} label`}>Description:</label>
                                <div className="control">
                                    <textarea className={`${theme} textarea`} rows="10" placeholder="Detailed description of the issue" {...register('description', { required: true })} />
                                    {errors.description && <span className="error">This field is required</span>}
                                </div>
                            </div>
                            <div className="field">
                                <label className={`${theme} label`}>Priority:</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select {...register('priority', { required: true })}>
                                            <option value="">Select Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                        {errors.priority && <span className="error">Please select a priority</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="buttons">
                                <button className={`button ${theme}-primary`} type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                                <button className={`button ${theme}-secondary`} type="button" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CreateTicket;