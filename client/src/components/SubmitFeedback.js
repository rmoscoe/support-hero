import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { CREATE_FEEDBACK } from '../utils/mutations';
import { useTheme } from "../utils/ThemeContext";
import { useParams } from "react-router-dom";


const SubmitFeedback = (props) => {
    const defaultValues = {
        rating: "",
        feedbackText: "",
    }
    const [SubmitFeedback, { loading }] = useMutation(CREATE_FEEDBACK);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ defaultValues });
    const { ticketId } = useParams();

    const onSubmit = async (formData) => {
        try {
            console.log(formData, ticketId);
            await SubmitFeedback({
                variables: {
                    ticketId,
                    rating: formData.rating,
                    feedbackText: formData.feedbackText,
                },
            });
            reset(defaultValues);
            props.handleSubmitFeedback();
            props.refetchTicketData()
        } catch (error) {
            console.error(error);
        }
    };

    const onClose = () => {
        reset(defaultValues);
        const modal = document.getElementById('submit-feedback-form');
        modal.classList.remove('is-active');
        props.handleSubmitFeedback();
    };
    const { theme } = useTheme();

    return (
        <div id="submit-feedback-form" className={`modal ${props.isActive ? "is-active" : ""}`}>
            <div className="modal-background">
                <div className={`modal-content ${theme}`}>
                    <header className={`${theme} modal-card-head title`}>
                        <p className={`${theme} modal-card-title`}>Customer Satisfaction Survey</p>
                        <button className="delete" aria-label="close" onClick={onClose}></button>
                    </header>
                    <section className={`${theme} modal-card-body`}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="field">
                                <label className={`${theme} label`}>Overall, how satisfied were you with Product/Service ?</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select {...register('rating', { required: true })}>
                                            <option value="">Select Rating</option>
                                            <option value="Very Satisfied">Very Satisfied</option>
                                            <option value="Satisfied">Satisfied</option>
                                            <option value="Neutral">Neutral</option>
                                            <option value="Dissatisfied">Dissatisfied</option>
                                            <option value="Very Dissatisfied">Very Dissatisfied</option>
                                        </select>
                                    </div>
                                    {errors.priority && <span className="error">Please select a rating</span>}
                                </div>
                            </div>
                            <div className="field">
                                <label className={`${theme} label`}>Do you have any suggestions to improve our product/service?</label>
                                <div className="control">
                                    <textarea className={`${theme} textarea`} rows="5" placeholder="" {...register('feedbackText', { required: true })} />
                                    {errors.description && <span className="error">This field is required</span>}
                                </div>
                            </div>
                            
                            <div className="buttons">
                                <button className={`button ${theme}-primary`} type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Submit'}
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

export default SubmitFeedback;