import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

import Auth from '../utils/auth';


const Login = (props) => {
    const [login] = useMutation(LOGIN);

    const {
        register,
        resetField,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // submit form
    const onSubmit = async (formData, event) => {
        event.preventDefault();
        try {
            const { data } = await login({
                variables: { email: formData.email, password: formData.password },
            });

            if (data.login.token !== "0") {
                Auth.login(data.login.token);
            }
            else {
                toast.error("Please enter valid credentials");
                resetField('email');
                resetField('password');
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <section className="hero is-light is-fullheight is-widescreen bgcolor">
            <div className="hero-body">

                <div className="container">
                    <h1 className="title has-text-centered has-text-white">Support Hero</h1>
                    <div className="columns is-centered">
                        <div className="column is-5-tablet is-4-desktop is-3-widescreen">

                            <hr className="login-hr"></hr>

                            <p className="subtitle has-text-centered has-text-white">Please login to access the portal</p>
                            <form onSubmit={handleSubmit(onSubmit)} className=" login-form">
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control has-icons-left">
                                        <input
                                            type="email"
                                            name="email" {...register("email", {
                                                required: true,
                                                pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
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
                                                required: true
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
                                    </div>
                                </div>

                                <div className="buttons is-centered">
                                    <button type="submit"
                                        className="button is-success"
                                        style={{ cursor: 'pointer' }}>
                                        Login
                                    </button><Toaster />
                                </div>
                            </form><br></br>
                            <label>Don't have an account? Sign Up <Link className="has-text-link" to="/signup">here</Link></label>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;