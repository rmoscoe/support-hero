import React, { useState } from 'react';
import { useStoreContext } from "../utils/GlobalState";
import { useMutation } from '@apollo/client';

import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from "../utils/mutations";

function Comment(props) {
    const [state, dispatch] = useStoreContext();
    const [userType, setUserType] = useState(state.user.type);
    const [noteForm, setNoteForm] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [formState, setFormState] = useState({
        noteText: ""
    });

    const handleEditButton = (notes) => {
        setNoteForm(true);
        setEditNote(true);
        setFormState({noteText: notes});
    }

    const [deleteNote, { deleteError }] = useMutation(DELETE_NOTE);
    const [createNote, { createError }] = useMutation(CREATE_NOTE);
    const [updateNote, { updateError }] = useMutation(UPDATE_NOTE);

    const handleDeleteButton = async (event) => {
        try {
            const commentId = event.target.hasAttribute('data-commentId')? event.target.getAttribute('data-commentId') : event.target.parentNode.getAttribute('data-commentId');
            const data = await deleteNote({
                variables: {commentId, notes: props.note.notes }
            });

            // window.location.reload(); // not sure whether this is necessary

        } catch (err) {
            console.error(err);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({ [name]: value });
      };

    const addNote = () => {
        setNoteForm(true);
        setFormState({noteText: ""});
    }

    const handleEditNote = async (event) => {
        event.preventDefault();

        try {
            const notes = formState.noteText;
            const commentId = document.querySelector(".notes-input").getAttribute("data-commentId");
            document.querySelector(".notes-input").value = "";
            setEditNote(false);
            setNoteForm(false);

            const data = await updateNote({
                variables: { commentId, notes }
            });

            // window.location.reload(); // not sure whether this is necessary
        } catch (err) { 
            console.error(err);
        }
    }

    const handleCreateNote = async (event) => {
        event.preventDefault();

        try {
            const notes = formState.noteText;
            const commentId = document.querySelector(".notes-input").getAttribute("data-commentId");
            document.querySelector(".notes-input").value = "";
            setEditNote(false);
            setNoteForm(false);

            const { data } = await createNote({
                variables: { commentId, notes }
            });

            // window.location.reload(); // not sure whether this is necessary
        } catch (err) {
            console.error(err);
        }
    }

    return props.comments.map((comment, idx) => (
        <div className="card my-4" key={comment._id}>
            <header className="has-background-secondary columns px-3">
                <p className="card-header-title is-size-5 column">{comment.creator.firstName}</p>
                <p className="column has-text-right-tablet">{comment.createdAt}</p>
            </header>
            <div className="card-content">
                <div className="content px-3">
                    <p>{comment.message}</p>
                    {userType === "Agent" && comment.note && !noteForm &&
                        <div className="card-content">
                            <div className="content columns">
                                <p className="column is-four-fifths">{comment.note.notes}</p>
                                <button className="button column is-link is-small" data-commentid={comment._id} onClick={() => handleEditButton(comment.note.notes)}>
                                    <i className="fa-solid fa-pencil"></i>
                                </button>
                                <button className="button column is-link is-small" data-commentid={comment._id} onClick={handleDeleteButton}>
                                    <i className="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        </div>
                    }
                    {userType === "Agent" && comment.note && noteForm && editNote &&
                        <form onSubmit={handleEditNote}>
                            <textarea
                                name="noteText"
                                rows="2"
                                data-commentid={comment._id}
                                value={formState.noteText}
                                className="form-input w-100 notes-input"
                                placeholder="Add internal note..."
                                onChange={handleChange}
                            >
                            </textarea>
                            <input type="submit" className="button is-link is-small" value="Submit" />
                        </form>
                    }
                    {userType === "Agent" && !comment.note && !noteForm &&
                        <button className="button is-link my-3 is-align-self-flex-end is-small" data-commentid={comment._id} onClick={addNote}>Add Note</button>
                    }
                    {userType === "Agent" && !comment.note && noteForm && !editNote &&
                        <form onSubmit={handleCreateNote}>
                        <textarea
                            name="noteText"
                            rows="2"
                            data-commentid={comment._id}
                            value={formState.noteText}
                            className="form-input w-100 notes-input"
                            placeholder="Add internal note..."
                            onChange={handleChange}
                        >
                        </textarea>
                        <input type="submit" className="button is-link is-small" value="Submit" />
                    </form>
                    }
                </div>
            </div>
        </div>
    ));
}

export default Comment;