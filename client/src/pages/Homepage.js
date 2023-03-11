import React from 'react';
import { useQuery } from '@apollo/client';

import TicketList from '../components/TicketList';

import { GET_TICKETS_BY_USER_ID } from '../utils/queries';
import Auth from '../utils/auth';

const Home = () => {
    console.log("in")
    console.log(Auth.getUser().data._id)

    // const { loading, err, ticketdata  } = useQuery(GET_TICKETS_BY_USER_ID,
    //     {
    //         variables : {userId : "640a46c8f2281cd4b39a5f09"}
    //     });
    //     console.log(err)
    //     console.log(ticketdata)
    // const tickets = data?.ticket || [];
    // console.log("tickets",tickets)
    // console.log(Auth.getUser().data._id)

    // if(loading) return <p>Loading....</p>
    const ticketData = [
        {
            _id: "1",
            title : "Auth issue",
            createdon : "mar 2023",
            status : "Open"
        },
        {
            _id: "2",
            title : "Login issue",
            createdon : "mar 2023",
            status : "Closed"
        },
        {
            _id: "12",
            title : "PC issue",
            createdon : "mar 2023",
            status : "Pending Agent Response"
        },
        {
            _id: "15",
            title : "Software issue",
            createdon : "mar 2023",
            status : "Pending Customer Response"
        }

    ]

    const viewPCR = () => {
        alert("in")

    }
    const viewPAR = () => {
        alert("in agent")
        // document.getElementsByClassName("alltickets").style.display = "none";



    }
    return (
        <main>
            <div>
            <h2 className="title has-text-centered"> My Tickets</h2><br></br>
            <div className="buttons is-centered">
            <button className="button  is-link">All Tickets</button>
            <button className="button  is-link">View Open tickets</button>
            { Auth.getUser().data.type === "Customer" ? <button className="button  is-link" onClick={viewPCR}>Pending Customer Response</button>
                :  <button className="button  is-link" onClick={viewPAR}>Pending Agent Response</button> 

            }<br></br>
             { Auth.getUser().data.type === "Customer" ? <button className="button  is-link">Create New ticket</button> : <label></label>
            }
            </div>

        </div>
        <div className="alltickets">
           <div className="is-flex is-flex-direction-row is-justify-content-center	">
           <div className="is-6-tablet is-5-desktop is-4-widescreen is-3-fullh">
            {/* {loading ? (
            <div>Loading...</div>
             ) : ( */}
            <TicketList
              tickets={ticketData}
            />
          {/* )} */}
        </div>
            </div>
            </div>
        </main>


    );
};

export default Home;


