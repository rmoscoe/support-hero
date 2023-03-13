import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useStoreContext } from "../utils/GlobalState";
import { CREATE_COMMENT } from "../utils/mutations";
import { UPDATE_TICKET_STATUS } from "../utils/mutations";
import { useParams } from "react-router-dom";
import Comment from "./Comment";
import Auth from "../utils/auth";
import { useTheme } from "../utils/ThemeContext";

function CommentList(props) {
    const { theme } = useTheme();
    const userData = Auth.getUser();
    const user = userData.data;
    const [userId, setUserId] = useState(user._id);
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
            console.log(ticketId, message, userId);
            const { commentData } = await createComment({
                variables: { ticketId, message, userId }
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

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section>
            <h3 className={`${theme}-primary title is-4  mt-3 mb-1 p-2 `}>Comment History</h3>
            < section className="section">
                <Comment comments={props.comments} user={user} status={props.status} />
                {props.status !== "Closed" &&
                    <form className={`${theme} columns box is-align-items-flex-end mt-3`} onSubmit={handleCreateComment}>
                        <textarea
                            name="messageText"
                            rows="3"
                            value={commentFormState.messageText}
                            className={`${theme} form-input w-100 column is-four-fifths mx-3`}
                            id="comment-message-textarea"
                            placeholder="Add a comment..."
                            onChange={handleCommentInput}
                        >
                        </textarea>
                        <input type="submit" className={`${theme} button is-info column mx-3`} value="Submit" />
                    </form>
                }
            </section>
        </section>
    );
}

export default CommentList;