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
        < section className="section">
            <h3 className="title is-3">Comment History</h3>
            <Comment comments={props.comments} />
            <form className="columns" onSubmit={handleCreateComment}>
                <textarea
                    name="messageText"
                    rows="3"
                    value={commentFormState.messageText}
                    className="form-input w-100 column is-four-fifths"
                    id="comment-message-textarea"
                    placeholder="Add a comment..."
                    onChange={handleCommentInput}
                >
                </textarea>
                <input type="submit" className="button is-link column" value="Submit" />
            </form>
        </section>
    );
}

export default CommentList;