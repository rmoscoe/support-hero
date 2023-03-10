import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
// import { LOGIN_USER } from '../utils/mutations';
import { useForm } from "react-hook-form";

// import Auth from '../utils/auth';

const Login = (props) => {
  const [formValueState, setFormValueState] = useState({ email: '', password: '' });
  // const [login, { error, data }] = useMutation(LOGIN_USER);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // update state based on form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormValueState({
      ...formValueState,
      [name]: value,
    });
  };

  // submit form
  const onSubmit = async (event) => {
    event.preventDefault();
    // try {
    //   const { data } = await login({
    //     variables: { ...formValueState },
    //   });

    //   Auth.login(data.login.token);
    // } catch (e) {
    //   console.error(e);
    // }

    // clear form values
    setFormValueState({
      email: '',
      password: '',
    });
  };

  return (
    <section className="hero is-link is-fullheight">
    <div className="hero-body">
    <div className="container">
    {/* {data ? ( */}
              <p>
                Success! You may now head{' '}
                <Link to="/Homepage">back to the homepage.</Link>
              </p>
            {/* ) : ( */}
      <div className="columns is-centered">
        <div className="column is-5-tablet is-4-desktop is-3-widescreen">
          
          <h3 className="title has-text-white has-text-centered">Login</h3>
          <hr className="login-hr"></hr>
         
          <p className="subtitle has-text-white has-text-centered">Please login to access the portal</p>
          <form onSubmit={handleSubmit(onSubmit)} className="box login-form">
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input 
                type="email" 
                value={formValueState.email}
                onChange={handleChange}
                name="email" {...register("email", {
                  required: true ,
                  pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/
                })}
                placeholder="e.g. bobsmith@gmail.com" 
                className="input" />
                  {errors.email && errors.email.type === "required" && (
                   <p className="has-text-danger	">Email is required.</p>
                  )}
                 {errors.email && errors.email.type === "pattern" && (
                  <p className="has-text-danger	">Email is not valid.</p>
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
                value={formValueState.password}
                onChange={handleChange}
                name="password" {...register("password", {
                  required: true 
                })}
                placeholder="*******" 
                className="input" 
                />
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
                {errors.password && errors.password.type === "required" && (
                 <p className="has-text-danger">Password is required.</p>
                 )}
              </div>
            </div>
        
            <div className="field">
              <button type="submit"
              className="button is-success" 
              style={{ cursor: 'pointer' }}>
                Login
              </button>
            </div>
          </form>
          <p>
          Don't have an accout? Sign Up here
          <Link to="/signup">Sign Up</Link>
        </p>
            
        </div>
      </div>
       {/* )} */}
     </div>
    </div>
    </section>
  );
};

export default Login;
