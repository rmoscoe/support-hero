import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_COMMENT } from "../utils/mutations";
import { UPDATE_TICKET_STATUS } from "../utils/mutations";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Auth from "../utils/auth";
import { useTheme } from "../utils/ThemeContext";
// import { useNavigate } from 'react-router-dom';

function CommentList(props) {
    const { theme } = useTheme();
    const userData = Auth.getUser();
    // const navigate = useNavigate();
    const user = userData.data;
    const { ticketId } = useParams();
    const [commentFormState, setCommentFormState] = useState({
        messageText: ""
    });

    const [createComment, { error }] = useMutation(CREATE_COMMENT);
    const [updateTicketStatus, { statusError }] = useMutation(UPDATE_TICKET_STATUS);

    const handleCommentInput = (event) => {
        const { name, value } = event.target;

        setCommentFormState({ [name]: value });
    };

    const handleCreateComment = async (event) => {
        event.preventDefault();

        try {
            const message = commentFormState.messageText;

            document.getElementById("comment-message-textarea").value = "";
            await createComment({
                variables: { ticketId, message, userId: user._id }
            });

            // Update ticket if customer is adding comment
            if(Auth.getUser().data.type === "Customer") {
                await updateTicketStatus({
                    variables: { ticketId, status: "Pending Agent Response" }
                });
            }
            
            // Update ticket if agent is adding comment
            if(Auth.getUser().data.type === "Agent") {
                await updateTicketStatus({
                    variables: { ticketId, status: "Pending Customer Response" }
                });
            }
            setCommentFormState({messageText: ""});

            // navigate(0);
        } catch (error) {
            console.error(error);
        }
    }

    if (error) {<p>Error creating comment. Please reload...</p>}
    if (statusError) {<p>Error. Please reload...</p>}
    if (error) {<p>Error creating comment. Please reload...</p>}
    return (
        <section>
            <h3 className={`${theme}-primary title is-4  mt-3 mb-1 p-2 `}>Comment History</h3>
            < section className="section">
                <Comment comments={props.comments} user={user} status={props.status} refetchTicket={props.refetchTicket} />
                {props.status !== "Closed" &&
                    <form className={`${theme}-primary-bg columns box is-align-items-flex-end mt-3`} onSubmit={handleCreateComment}>
                        <textarea
                            name="messageText"
                            rows="3"
                            value={commentFormState.messageText}
                            className={`${theme}-primary-bg form-input w-100 column is-four-fifths mx-3`}
                            id="comment-message-textarea"
                            placeholder="Add a comment..."
                            onChange={handleCommentInput}
                            required
                        >
                        </textarea>
                        <input type="submit" className={`${theme}-secondary button column mx-3`} value="Submit" />
                    </form>
                }
            </section>
        </section>
    );
}

export default CommentList;