import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_TICKET } from '../utils/mutations';
import Auth from '../utils/auth';

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
                    userId: Auth.getUser().data._id
                },
            });
            navigate(0);
        } catch (error) {
            console.error(error);
        }
    };

    const onClose = () => {
        const modal = document.getElementById('create-ticket-form');
        modal.classList.remove('is-active');
        props.handleCloseCreateTicket();
    };

    return (
        <div id="create-ticket-form" className={`modal ${props.isActive ? "is-active" : ""}`}>
            <div className="modal-background">
                <div className="modal-content has-background-white">
                    <header className="modal-card-head title">
                        <p className="modal-card-title">Create Ticket</p>
                        <button className="delete" aria-label="close" onClick={onClose}></button>
                    </header>
                    <section className="modal-card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <label className="label">Title:</label>
                                <div className="control">
                                    <input className="input" placeholder="Summary of the issue" type="text" {...register('title', { required: true })} />
                                    {errors.title && <span className="error">This field is required</span>}
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Description:</label>
                                <div className="control">
                                    <textarea className="textarea" rows="10" placeholder="Detailed description of the issue" {...register('description', { required: true })} />
                                    {errors.description && <span className="error">This field is required</span>}
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Priority:</label>
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
                                <button className="button is-primary" type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create'}
                                </button>
                                <button className="button is-info" type="button" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CreateTicket;