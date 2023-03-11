import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_TICKET } from '../utils/mutations';
import Auth from '../utils/auth';

const CreateTicket = () => {
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
                    userId: Auth.getProfile().data._id
                },
            });
            navigate(0);
        } catch (error) {
            console.error(error);
        }
    };

    const onClose = () => {
        const modal = document.querySelector('create-ticket-form');
        modal.classList.remove('is-active');
    };

    return (
        <>
            {/* Button to open modal: to be removed and integrated with host page */}
            <button>Open Create Ticket Modal</button>

            {/* Modal */}
            <div className="modal create-form create-ticket-form">
                <div className="modal-background">
                    <div className="modal-content">
                        <h2>Create Ticket</h2>
                        <button className="close-button" onClick={onClose}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.293 6.293a1 1 0 0 1 1.414 0L12 10.586l4.293-4.293a1 1 0 1 1 1.414 1.414L13.414 12l4.293 4.293a1 1 0 0 1-1.414 1.414L12 13.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L10.586 12 6.293 7.707a1 1 0 0 1 0-1.414z"/></svg>
                        </button>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label>
                                Title:
                                <input type="text" {...register('title', { required: true })} />
                                {errors.title && <span className="error">This field is required</span>}
                            </label>
                            <label>
                                Description:
                                <textarea {...register('description', { required: true })} />
                                {errors.description && <span className="error">This field is required</span>}
                            </label>
                            <label>
                                Priority:
                                <select {...register('priority', { required: true })}>
                                    <option value="">Select Priority</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                                {errors.priority && <span className="error">Please select a priority</span>}
                            </label>
                            <button type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create'}
                            </button>
                            <button type="button" onClick={onClose}>Close</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreateTicket;