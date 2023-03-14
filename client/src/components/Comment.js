import React, { useState } from 'react';
import { useStoreContext } from "../utils/GlobalState";
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

    const handleEditButton = (event, notes, id) => {
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

            const data = await deleteNote({
                variables: { commentId, notes: comment.note.notes }
            });

            window.location.reload();

        } catch (err) {
            console.error(err);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({ [name]: value });
    };

    const addNote = (commentId) => {
        setCommentToEdit(""); // reset the commentToEdit state
        setCommentToEdit(commentId);
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
            
            const data = await updateNote({
                variables: { commentId, notes }
            });

            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    const handleCreateNote = async (event) => {
        event.preventDefault();

        try {
            const notes = formState.noteText;
            const commentId = document.querySelector(".notes-input").dataset.commentid;
            console.log(commentId);
            document.querySelector(".notes-input").value = "";
            setEditNote(false);
            setNoteForm(false);

            const { data } = await createNote({
                variables: { commentId, notes }
            });
            console.log(data);
            

            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    }

    return props.comments.map((comment, idx) => (
        <div className={`${theme}-primary-bg card my-5`} key={comment._id}>
            <header className={`${theme}-primary columns px-3`}>
                <p className={`${theme}-text card-header-title is-size-5 column`}>{comment.creator.firstName}</p>
                <p className="column has-text-right-tablet">{comment.createdAt}</p>
            </header>
            <div className='card-content'>
                <div className="content px-3">
                    <p>{comment.message}</p>
                    {userType === "Agent" && comment.note && !noteForm &&
                        <div className={`${theme}-tertiary-bg card-content `}>
                            <div className={`content columns ${theme}-secondary-bg is-align-items-baseline`}>
                                <p className="column is-four-fifths">{comment.note.notes}</p>
                                {props.status !== "Closed" &&
                                    <div className="column columns is-mobile">
                                        <button className={`${theme}-secondary button column is-small mr-1`} data-commentid={comment._id} onClick={(event) => handleEditButton(event, comment.note.notes, comment._id)}>
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
                                className="form-input w-100 notes-input column is-four-fifths my-1"
                                placeholder="Add internal note..."
                                onChange={handleChange}
                            >
                            </textarea>
                            <input type="submit" className={`${theme}-secondary button is-small column w-100 my-1 ml-2 is-align-self-flex-end`} value="Submit" />
                        </form>
                    }
                    {userType === "Agent" && !comment.note && !noteForm &&
                        <button className={`${theme}-secondary button  my-3 is-align-self-flex-end is-small`} data-commentid={comment._id} onClick={addNote}>Add Note</button>
                    }
                    {userType === "Agent" && !comment.note && noteForm && !editNote && commentToEdit &&
                        <form className="columns is-flex is-align-items-flex-end" data-commentid={comment._id} onSubmit={handleCreateNote}>
                            <textarea
                                name="noteText"
                                rows="2"
                                data-commentid={comment._id}
                                value={formState.noteText}
                                className="form-input w-100 notes-input column is-four-fifths my-1"
                                placeholder="Add internal note..."
                                onChange={handleChange}
                            >
                            </textarea>
                            <input type="submit" className={`${theme}-secondary button is-small column w-100 my-1 ml-2 is-align-self-flex-end`} value="Submit" />
                        </form>
                    }
                </div>
            </div>
        </div>
    ));
}

export default Comment;