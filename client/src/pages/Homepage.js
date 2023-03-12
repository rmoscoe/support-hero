import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Navigate } from 'react-router-dom';
import { useTheme } from '../utils/ThemeContext';

import TicketList from '../components/TicketList';
import CreateTicket from '../components/CreateTicket';

import { GET_TICKETS_BY_USER_ID } from '../utils/queries';
import Auth from '../utils/auth';

const Home = () => {
    const { theme} = useTheme();

    if(!Auth.loggedIn()){ window.location.replace("/login")}

    const [isCreateTicket, setIsCreateTicket] = useState(false);
    const { loading,  data  } = useQuery(GET_TICKETS_BY_USER_ID,
        {
            variables : {userId : Auth.getUser().data._id}
    });

    const handleCreateTicketClick = () => {
        setIsCreateTicket(true);
    }

    const handleCloseCreateTicket = () => {
        setIsCreateTicket(false);
    }
        
    return (
        <main>
            <div>
            <h2 className={`${theme} title has-text-centered m-5`}> My Tickets</h2><br></br>
            <div className="buttons is-centered m-5">
             { Auth.getUser().data.type === "Customer" ? <button className={`button button-${theme}`} onClick={handleCreateTicketClick} data-target="create-ticket-form">Create New ticket</button> : <label></label>
            }
            </div>

        </div>
        <div className="alltickets">
           <div className="is-flex is-flex-direction-row is-justify-content-center	">
           <div className="is-6-tablet is-5-desktop is-4-widescreen is-3-fullh">
            {loading ? (
            <div>Loading...</div>
             ) : (
            <TicketList 
              tickets={data.getTicketsByUserId} 
            />
           )}
        </div>
            </div>
            </div>
            {<CreateTicket isActive={isCreateTicket} handleCloseCreateTicket={handleCloseCreateTicket}/>}
        </main>
    );
};

export default Home;
