import React from 'react';
import { useQuery } from '@apollo/client';
import { Navigate } from 'react-router-dom';

import TicketList from '../components/TicketList';

import { GET_TICKETS_BY_USER_ID } from '../utils/queries';
import Auth from '../utils/auth';

const Home = () => {
    console.log("in")
    console.log(Auth.getUser().data._id)

        const { loading,  data  } = useQuery(GET_TICKETS_BY_USER_ID,
            {
                variables : {userId : Auth.getUser().data._id}
            });
        
    return (
        <main>
            <div>
            <h2 className="title has-text-centered m-5"> My Tickets</h2><br></br>
            <div className="buttons is-centered m-5">
            {/* <button className="button  is-link">All Tickets</button>
            <button className="button  is-link">View Open tickets</button>
            { Auth.getUser().data.type === "Customer" ? <button className="button  is-link" onClick={viewPCR}>Pending Customer Response</button>
                :  <button className="button  is-link" onClick={viewPAR}>Pending Agent Response</button> 

            }<br></br> */}
             { Auth.getUser().data.type === "Customer" ? <button className="button  is-link">Create New ticket</button> : <label></label>
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
        </main>


    );
};

export default Home;


