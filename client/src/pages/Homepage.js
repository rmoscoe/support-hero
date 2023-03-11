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
            title : "ticket1",
            createdon : "mar 2023",
            status : "Open"
        },
        {
            _id: "2",
            title : "ticket12",
            createdon : "mar 2023",
            status : "Closed"
        },
        {
            _id: "12",
            title : "ticket13",
            createdon : "mar 2023",
            status : "Pending Agent Response"
        },
        {
            _id: "15",
            title : "ticket14",
            createdon : "mar 2023",
            status : "Pending Customer Response"
        }




    ]
    return (

       
       
        <main>
             <div>
            <h2> My Tickets</h2>
            <button type="button">All Tickets</button>
            <button type="button">View Open tickets</button>
            { Auth.getUser().data.type === "Customer" ? <button type="button">Pending Customer Response</button>
                :  <button type="button">Pending Agent Response</button> 

            }<br></br>
             { Auth.getUser().data.type === "Customer" ? <button type="button">Create New ticket</button> : <label></label>
            }

        </div>
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
        </main>


    );
};

export default Home;


