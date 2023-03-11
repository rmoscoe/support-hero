import React from 'react';
import { Link } from "react-router-dom";

function Comment(props) {

    return props.comment.map((comment, idx) => (
        <div className="card" key={props.comment._id}>
            <header className="card-header columns">
                <p className="card-header-title column">{props.comment.creator.firstName}</p>
                <p className="column">{props.comment.createdAt}</p>
            </header>
            <div className="card-content">
                <div className="content">
                    <p>{props.comment.message}</p>
                    {props.comment.creator.type === "Agent" && props.comment.note &&
                        <div className="card-content">
                            <div className="content columns">
                                <p className="column is-four-fifths">{props.comment.note.notes}</p>
                                <button className="button column is-link">
                                    <i className="fa-solid fa-pencil"></i>
                                </button>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    ));
}

export default Comment;