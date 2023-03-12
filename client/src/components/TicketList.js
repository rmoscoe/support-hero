import React , { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable , useGlobalFilter } from 'react-table';
import { COLUMNS } from '../components/Columns'
import { GlobalFilter } from './GlobalFilter';

const TicketList = ({
  tickets,
}) => {
  // if (!tickets.length) {
  //   return <h3>No Tickets Yet</h3>;
  // }

  const columns = useMemo(() => COLUMNS , [])
  const data = useMemo(() => tickets , [])

  const {getTableProps, 
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({
    columns,
    data,
  },useGlobalFilter)

  const {globalFilter} = state
  return (
  <>
  <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
    <table {...getTableProps()} className="table is-bordered is-striped is-fullwidth is-responsive">
      <thead>
        {headerGroups.map((headerGroup) => (
            <tr className="is-selected has-text-black" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
        ))}
    
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row)=> {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell)=>{
                return  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
    </>
    // <div><br></br>
    //   <table className="table is-bordered is-striped is-fullwidth is-responsive">
    //     <thead>
    //     <tr className="th is-selected has-text-black">
    //         <th>Ticket ID</th>
    //         <th>Title</th>
    //         <th>Created On</th>
    //         <th>Status</th>
    //     </tr>
    //     </thead>
    //     <tfoot>
    //     <tr>
    //         <th>Ticket ID</th>
    //         <th>Title</th>
    //         <th>Created On</th>
    //         <th>Status</th>
    //     </tr>
    //     </tfoot>

    //     <tbody>
    //   {tickets &&
    //     tickets.map((ticket) => (
    //         <tr key={ticket._id}>
    //         <td>{ticket._id}</td>
    //         <th><Link to={`/tickets/${ticket._id}`}>{ticket.title}</Link> </th>
    //         <td>{ticket.createdAt} </td>
    //         <td>{ticket.status}</td>
    //         </tr>
    //     ))}

    //     </tbody>

    //   </table>
      
    // </div>

  );
};

export default TicketList;
