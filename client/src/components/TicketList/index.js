import React from 'react';
import { Link } from 'react-router-dom';

const TicketList = ({
  tickets,
}) => {
  if (!tickets.length) {
    return <h3>No Tickets Yet</h3>;
  }

  return (
    <div>
      <table className="table">
        <thead>
        <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Created On</th>
            <th>Status</th>
        </tr>
        </thead>
        <tfoot>
        <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Created On</th>
            <th>Status</th>
        </tr>
        </tfoot>

        <tbody>
      {tickets &&
        tickets.map((ticket) => (
            <>
            <tr>
            <th>{ticket._id}</th>
            <td><Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link> </td>
            <td>{ticket.createdon} </td>
            <td>{ticket.status}</td>
            </tr>
            
            </>
        ))}

        </tbody>

      </table>
      
    </div>
  );
};

export default TicketList;
