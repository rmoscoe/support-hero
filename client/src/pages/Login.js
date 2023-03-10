import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utils/mutations';
import { useForm } from "react-hook-form";

import Auth from '../utils/auth';

const Login = (props) => {
  // const [formValueState, setFormValueState] = useState({ email: '', password: '' });
  

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // update state based on form input changes
  // const handleChange = (event) => {
  //   const { name, value } = event.target;

  //   setFormValueState({
  //     ...formValueState,
  //     [name]: value,
  //   });
  // };

  // submit form
  const onSubmit = async (formData) => {
    // event.preventDefault();
    try {
      const [login, { error, userData }] = useMutation(LOGIN);
      await login({
        variables: { email: formData.email, password: formData.password },
      });
      console.log(userData);
      Auth.login(userData.login.token);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    // setFormValueState({
    //   email: '',
    //   password: '',
    // });
  };

  return (
    <section className="hero is-light is-fullheight is-widescreen">
    <div className="hero-body">

    <div className="container">
    <h1 className="title has-text-centered">Support Hero</h1>

    {/* {data ? ( */}
              {/* <h1 className="columns is-centered has-text-link">
                Success! You may now head{' '}
                <Link to="/homepage">back to the HOMEPAGE.</Link>
              </h1> */}
            {/* ) : ( */}
      <div className="columns is-centered">
        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
          
          <hr className="login-hr"></hr>
         
          <p className="subtitle has-text-centered">Please login to access the portal</p>
          <form onSubmit={handleSubmit(onSubmit)} className=" login-form">
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input 
                type="email" 
                // value={formValueState.email}
                // onChange={handleChange}
                name="email" {...register("email", {
                  required: true ,
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
              <label  className="label">Password</label>
              <div className="control has-icons-left">
                <input 
                type="password" 
                // value={formValueState.password}
                // onChange={handleChange}
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
              </button>
            </div>
          </form><br></br>
          <label>Don't have an account? Sign Up <Link className="has-text-link" to="/signup">here</Link></label>
        </div>
      </div>
       {/* )} */}
     </div>
    </div>
    </section>
  );
};

export default Login;