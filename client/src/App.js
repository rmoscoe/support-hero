import 'bulma/css/bulma.css'
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './utils/auth';


import { useTheme } from './utils/ThemeContext';
import { StoreProvider } from './utils/GlobalState';

import Login from './pages/Login';
import Homepage from './pages/Homepage';
import TicketDetails from './pages/TicketDetails';
import Header from './components/Header';
import Footer from './components/Footer';
import Signup from './pages/Signup';

// Construct main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


function App() {
  const { theme, toggleTheme } = useTheme();
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="d-flex flex-column justify-content-start min-100-vh">
          <StoreProvider>
            {Auth.loggedIn() &&
              <Header />}
            {Auth.loggedIn() &&
              <label className="switch">
                <input type="checkbox" checked={theme === 'dark'}/>
                <span onClick={toggleTheme} className="toggle"></span>
              </label>}
            <div className="container">
              <Routes>
                <Route
                  path="/"
                  element={<Homepage />}
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="/signup"
                  element={<Signup />}
                />
                <Route
                  path="/tickets/:ticketId"
                  element={<TicketDetails />}
                />
              </Routes>
            </div>
          </StoreProvider>
          <Footer />
        </div>
      </Router>
    </ApolloProvider >
  )
}

export default App;
