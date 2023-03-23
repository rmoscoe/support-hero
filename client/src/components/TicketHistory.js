import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TICKETS_BY_USER_ID } from '../utils/queries';
import TicketList from './TicketList';
import { useTheme } from '../utils/ThemeContext';

function TicketHistory({ historyView, setHistoryView, id }) {
    const { theme } = useTheme();
    const { loading, data } = useQuery(GET_TICKETS_BY_USER_ID,
        {
            variables: { userId: id }
        });

    return (
        <div  className={historyView ? 'modal is-active ' : 'modal'}>
            <div className="modal-background"></div>
            <div style={{width: '1000px'}} className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Cutomer History</p>
                    <button onClick={() => setHistoryView(false)} className="delete" aria-label="close"></button>
                </header>
                <section className="modal-card-body">
                {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <TicketList
                                tickets={data.getTicketsByUserId}
                            />
                        )}
                </section>
                {/* <footer className="modal-card-foot">
                    <button className={`button ${theme}-tertiary`} >Save changes</button>
                    <button className={`button ${theme}-tertiary`}>Cancel</button>
                </footer> */}
            </div>
        </div>
    )
};

export default TicketHistory;