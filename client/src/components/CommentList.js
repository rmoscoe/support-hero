import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { useStoreContext } from "../utils/GlobalState";
import { CREATE_COMMENT } from "../utils/mutations";
import { useParams } from "react-router-dom";
import Comment from "./Comment";

function CommentList(props) {
    const [state, setState] = useStoreContext();
    const [userId, setUserId] = useState(state.user._id);
    const { ticketId } = useParams();
    const [commentFormState, setCommentFormState] = useState({
        messageText: ""
    });

    const [createComment, { error }] = useMutation(CREATE_COMMENT);

    const handleCommentInput = (event) => {
        const { name, value } = event.target;

        setCommentFormState({ [name]: value });
    };

    const handleCreateComment = async (event) => {
        event.preventDefault();

        try {
            const message = commentFormState.messageText;
            console.log(message);
            document.getElementById("comment-message-textarea").value = "";

            const { commentData } = await createComment({
                variables: { ticketId, message, userId }
            });

            // window.location.reload(); // not sure whether this is necessary
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section>
            <h3 className="title is-4 has-background-info-light mt-3 mb-1 p-2 has-text-info">Comment History</h3>
            < section className="section">
                <Comment comments={props.comments} />
                <form className="columns box is-align-items-flex-end mt-3" onSubmit={handleCreateComment}>
                    <textarea
                        name="messageText"
                        rows="3"
                        value={commentFormState.messageText}
                        className="form-input w-100 column is-four-fifths mx-3"
                        id="comment-message-textarea"
                        placeholder="Add a comment..."
                        onChange={handleCommentInput}
                    >
                    </textarea>
                    <input type="submit" className="button is-info column mx-3" value="Submit" />
                </form>
            </section>
        </section>
    );
}

export default CommentList;