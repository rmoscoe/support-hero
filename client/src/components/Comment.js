import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { useStoreContext } from "../utils/GlobalState";

function Comment(props) {
    const [state, dispatch] = useStoreContext();
    const [userType, setUserType] = useState(state.user.type);

    const handleEditButton = () => {

    }

    const handleDeleteButton = () => {

    }

    const addNote = () => {

    }

    return props.comment.map((comment, idx) => (
        <div className="card" key={props.comment._id}>
            <header className="card-header columns">
                <p className="card-header-title column">{props.comment.creator.firstName}</p>
                <p className="column">{props.comment.createdAt}</p>
            </header>
            <div className="card-content">
                <div className="content">
                    <p>{props.comment.message}</p>
                    {userType === "Agent" && props.comment.note &&
                        <div className="card-content">
                            <div className="content columns">
                                <p className="column is-four-fifths">{props.comment.note.notes}</p>
                                <button className="button column is-link is-small" onClick={handleEditButton}>
                                    <i className="fa-solid fa-pencil"></i>
                                </button>
                                <button className="button column is-link is-small" onClick={handleDeleteButton}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    }
                    {userType === "Agent" && !props.comment.note &&
                        <button className="button is-link my-3 is-align-self-flex-end is-small" onClick={addNote}>Add Note</button>
                    }
                </div>
            </div>
        </div>
    ));
}

export default Comment;