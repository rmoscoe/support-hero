import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useTheme } from '../utils/ThemeContext';

import { CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE } from "../utils/mutations";

function Comment(props) {
    const { theme } = useTheme();
    const user = props.user;
    const userType = user.type;
    const [noteForm, setNoteForm] = useState(false);
    const [editNote, setEditNote] = useState(false);
    const [formState, setFormState] = useState({
        noteText: ""
    });
    const [commentToEdit, setCommentToEdit] = useState("");

    const handleEditButton = (event, notes) => {
        const dataId = event.currentTarget.getAttribute("data-commentid");
        setCommentToEdit(dataId);
        setNoteForm(true);
        setEditNote(true);
        setFormState({ noteText: notes });
    }

    const [deleteNote, { deleteError }] = useMutation(DELETE_NOTE);
    const [createNote, { createError }] = useMutation(CREATE_NOTE);
    const [updateNote, { updateError }] = useMutation(UPDATE_NOTE);

    const handleDeleteButton = async (event) => {
        try {
            const commentId = event.target.hasAttribute('data-commentid') ? event.target.getAttribute('data-commentid') : event.target.parentNode.getAttribute('data-commentid');
            const comment = props.comments.find((comment) => comment._id === commentId);

            await deleteNote({
                variables: { commentId, notes: comment.note.notes }
            });

            props.refetchTicket();

        } catch (err) {
            console.error(err);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({ [name]: value });
    };

    const addNote = (event) => {
        const dataId = event.currentTarget.getAttribute("data-commentid");
        setCommentToEdit(dataId);
        setNoteForm(true);
        setFormState({ noteText: "" });
    }

    const handleEditNote = async (event) => {
        event.preventDefault();

        try {
            const notes = formState.noteText;
            const commentId = event.currentTarget.dataset.commentid;
            document.querySelector(".notes-input").value = "";
            setEditNote(false);
            setNoteForm(false);

            await updateNote({
                variables: { commentId, notes }
            });

        } catch (err) {
            console.error(err);
        }
    }

    const handleCreateNote = async (event) => {
        event.preventDefault();

        try {
            const notes = formState.noteText;
            const commentId = document.querySelector(".notes-input").dataset.commentid;
            document.querySelector(".notes-input").value = "";
            setEditNote(false);
            setNoteForm(false);

            await createNote({
                variables: { commentId, notes }
            });

        } catch (err) {
            console.error(err);
        }
    }

    if (deleteError) {<p>Error please refresh page...</p>}
    if (updateError) {<p>Error please refresh page...</p>}
    if (createError) {<p>Error please refresh page...</p>}
    if (createError) {<p>Error please refresh page...</p>}


    return props.comments.map((comment, idx) => (
        <div style={{border: '1px solid black'}} className={`${theme}-secondary-bg card my-5`} key={comment._id}>
            <header className={`comment-header ${theme}-primary columns px-3`}>
                <p className={`has-text-white card-header-title is-size-5 column`}>{comment.creator.firstName}</p>
                <p className="column has-text-right">{comment.createdAt}</p>
            </header>
            <div className='body card-content'>
                <div className="content px-3">
                    <p>{comment.message}</p>
                    {userType === "Agent" && comment.note && !noteForm &&
                        <div style={{border: 'solid black 1px'}} className={`${theme}-secondary-bg card-content`}>
                            <div className={`content columns is-align-items-baseline`}>
                                <p className="column is-four-fifths">{comment.note.notes}</p>
                                {props.status !== "Closed" &&
                                    <div className="column columns is-mobile">
                                        <button className={`${theme}-secondary button column is-small mr-1`} data-commentid={comment._id} onClick={(event) => handleEditButton(event, comment.note.notes)}>
                                            <i className="fa-solid fa-pencil"></i>
                                        </button>
                                        <button className={`${theme}-secondary button column is-small mr-1`} data-commentid={comment._id} onClick={handleDeleteButton}>
                                            <i className="fa-solid fa-trash-can"></i>
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {userType === "Agent" && comment.note && noteForm && editNote && commentToEdit === comment._id &&
                        <form className="columns is-align-items-flex-end" data-commentid={comment._id} onSubmit={handleEditNote}>
                            <textarea
                                name="noteText"
                                rows="2"
                                data-commentid={comment._id}
                                value={formState.noteText}
                                className="body form-input w-100 notes-input column is-four-fifths my-1"
                                placeholder="Add internal note..."
                                onChange={handleChange}
                            >
                            </textarea>
                            <input type="submit" className={`header-bold ${theme}-secondary button is-small column w-100 my-1 ml-2 is-align-self-flex-end`} value="Submit" />
                        </form>
                    }
                    {userType === "Agent" && !comment.note && (!noteForm || commentToEdit !== comment._id) &&
                        <button className={`header-bold ${theme}-secondary button  my-3 is-align-self-flex-end is-small`} data-commentid={comment._id} onClick={addNote}>Add Note</button>
                    }
                    {userType === "Agent" && !comment.note && noteForm && !editNote && commentToEdit === comment._id &&
                        <form className="columns is-flex is-align-items-flex-end" data-commentid={comment._id} onSubmit={handleCreateNote}>
                            <textarea
                                name="noteText"
                                rows="2"
                                data-commentid={comment._id}
                                value={formState.noteText}
                                className="body form-input w-100 notes-input column is-four-fifths my-1"
                                placeholder="Add internal note..."
                                onChange={handleChange}
                            >
                            </textarea>
                            <input type="submit" className={`header-bold ${theme}-secondary button is-small column w-100 my-1 ml-2 is-align-self-flex-end`} value="Submit" />
                        </form>
                    }
                </div>
            </div>
        </div>
    ));
}

export default Comment;