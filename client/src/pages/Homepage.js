import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useTheme } from '../utils/ThemeContext';
import TicketList from '../components/TicketList';
import CreateTicket from '../components/CreateTicket';
import { GET_TICKETS_BY_USER_ID } from '../utils/queries';
import Auth from '../utils/auth';
import { Navigate } from 'react-router-dom';

function Home() {
    const [isCreateTicket, setIsCreateTicket] = useState(false);
    const { loading, error, data, refetch } = useQuery(GET_TICKETS_BY_USER_ID,
        {
            variables: { userId: Auth.getUser()?.data._id }
        });

    const { theme } = useTheme();
   
    if (!Auth.loggedIn()) {
        return (<Navigate to="/login" />)
    };
    
    // const navigate = useNavigate();

    const handleCreateTicketClick = () => {
        setIsCreateTicket(true);
    }

    const handleCloseCreateTicket = () => {
        setIsCreateTicket(false);
    }
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <main>
            <div>
                <h2 className={`${theme} title has-text-centered`}> My Tickets</h2><br></br>
                <div className="buttons is-centered">
                    {Auth.getUser().data.type === "Customer" 
                    ? <button className={`button ${theme}-tertiary`} onClick={handleCreateTicketClick} data-target="create-ticket-form">Create New ticket</button> 
                    : <label></label>
                    }
                </div>

            </div>
            <div className="alltickets">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <TicketList
                                tickets={data.getTicketsByUserId} refetchTicketData={refetch}
                            />
                        )}

            </div>
            {<CreateTicket isActive={isCreateTicket} handleCloseCreateTicket={handleCloseCreateTicket} refetchTicketData={refetch} />}
        </main>
    );
};

export default Home;
