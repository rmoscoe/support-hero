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

import Login from './pages/Login';
import Homepage from './pages/Homepage';
import SingleTicket from './pages/SingleTicket';
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
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="d-flex flex-column justify-content-start min-100-vh">
          <Header />
          <div className="container">
            <Routes>
              <Route 
                path="/" 
                element={<Login />} 
              />
              <Route 
                path="/homepage" 
                element={<Homepage />} 
              />
              <Route 
                path="/signup" 
                element={<Signup />} 
              />
              <Route 
                path="/tickets/:ticketId" 
                element={<SingleTicket />}
              />
            </Routes> 
        </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  )
}

export default App;
