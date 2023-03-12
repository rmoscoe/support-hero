import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import { useForm } from 'react-hook-form';
import Auth from '../utils/auth';
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

export default function Signup() {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: "onBlur" });

    const [createUser] = useMutation(CREATE_USER);

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const userData = await createUser({
                variables: {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: data.password
                },
            });
            console.log(userData);
            const token = userData.data.createUser.token;
            Auth.login(token);
        } catch (err) {
            toast("This email address is already in use. Please try a different email address or proceed to login", {
                position: 'bottom-right'
            });
            console.error(err);
        }
    };
    return (
        <section className="hero is-light is-fullheight is-widescreen bgcolor">
            <div className="hero-body">
            <div className="container">
                <h1 className="title has-text-centered">Support Hero</h1>
                <div className="columns is-centered">
                    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                    <hr className="login-hr"></hr>
         
         <p className="subtitle has-text-centered">Sign Up</p>
                    <form onSubmit={handleSubmit(onSubmit)} className=" signin-form">
                        <div className="field">
                            <label className="label">First Name</label>
                            <div className="control has-icons-left">
                                <input
                                    type="firstName"
                                    name="firstName" {...register("firstName", {
                                        required: true
                                    })}

                                    className="input"
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                                {errors.firstName && errors.firstName.type === "required" && (
                                    <p className="has-text-danger">firstName is required.</p>
                                )}
                            </div>
                            <div className="field">
                                <label className="label">Last Name</label>
                                <div className="control has-icons-left">
                                    <input
                                        type="lastName"
                                        name="lastName" {...register("lastName", {
                                            required: true
                                        })}

                                        className="input"
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fa fa-lock"></i>
                                    </span>
                                    {errors.lastName && errors.lastName.type === "required" && (
                                        <p className="has-text-danger">Last Name is required.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control has-icons-left">
                                <input
                                    type="email"
                                    name="email" {...register("email", {
                                        required: true,
                                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                                    })}
                                    placeholder="e.g. bobsmith@gmail.com"
                                    className="input" />
                                {errors.email && errors.email.type === "required" && (
                                    <p className="has-text-danger ">Email is required.</p>
                                )}
                                {errors.email && errors.email.type === "pattern" && (
                                    <p className="has-text-danger  ">Email is not valid.</p>
                                )}
                                <span className="icon is-small is-left">
                                    <i className="fa fa-envelope"></i>
                                </span>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="control has-icons-left">
                                <input
                                    type="password"
                                    name="password" {...register("password", {
                                        required: true,
                                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,32})/,
                                    })}
                                    placeholder="*******"
                                    className="input"
                                />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                                {errors.password && errors.password.type === "required" && (
                                    <p className="has-text-danger">Password is required.</p>
                                )}
                                {errors.password && errors.password.type === "pattern" && (
                                    <p className="has-text-danger  ">Password must be a minimum of 8 characters and must contain at least 1 upper case, numeric, and special character.</p>
                                )}
                            </div>
                        </div>

                        <div className="buttons is-centered">
                            <button type="submit"
                                className="button is-success"
                                style={{ cursor: 'pointer' }}>
                                Signup
                            </button>
                        </div>
                    </form><br></br>
                    <label>Already have an account? Login <Link className="has-text-link" to="/">here</Link></label>
                </div>
                </div>
            <Toaster 
               /> 
            </div>
            </div>
        </section >
    );
};
