import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters } from 'react-table';
import { COLUMNS } from '../components/Columns'
import { GlobalFilter } from './GlobalFilter';
import { useTheme } from '../utils/ThemeContext';
import { Link } from "react-router-dom";
import SubmitFeedback from '../components/SubmitFeedback';
import Auth from '../utils/auth';

const TicketList = ({ tickets,refetchTicketData } ) => {
    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => tickets, [tickets]);
    const { theme } = useTheme();
    const [isSubmitfeedback, setIsSubmitFeedback] = useState(false);
    const [dataTicketId, setDataTicketId] = useState(" ");
    const [userType, isUserType] = useState(Auth.getUser()?.data.type)


    const { getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setGlobalFilter,
    } = useTable({
        columns,
        data,
    }, useFilters, useGlobalFilter)

    const { globalFilter } = state

    const handleSubmitFeedback = (event) => {
        setDataTicketId(event.target.getAttribute("data-ticket-id"))
        setIsSubmitFeedback(true);
    }
    const handleCloseSubmitFeedback = () => {
        setIsSubmitFeedback(false);
    }

    if (!tickets.length) {
        return <h3 className={theme}>No Tickets Yet</h3>;
    }

    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <div className='table-container'>
                <table {...getTableProps()} className={` table is-narrow  is-fullwidth is-responsive hscroll`}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr className="is-selected " {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    console.log(column)
                                    // {userType === "Agent" && column.Header !== "Feedback" &&
                                    return (
                                    <th className={`${theme}-primary has-text-black is-size-4 has-text-centered`} {...column.getHeaderProps()}>{userType === "Agent" && column.Header === "Feedback" ? null : column.render('Header')}
                                        <div>{userType === "Agent" && column.Header === "Feedback" ? null : column.canFilter ? column.render('Filter') : null}</div>
                                    </th>
                                )
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody className={`${theme}-primary-bg`} {...getTableBodyProps()}>
                        {rows.map((row) => {
                            prepareRow(row)
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell) => {
                                        // console.log(cell)
                                        return <td className={`${theme}-text`} {...cell.getCellProps()}><Link to={`/tickets/${cell.row.original._id}`}>{cell.column.Header !== "Feedback" && cell.render('Cell')}</Link>
                                         { cell.column.Header === "Feedback" && cell.row.values.status === "Closed" && !cell.value && Auth.getUser()?.data.type === "Customer" ? <button className={`${theme}-tertiary button`} onClick={handleSubmitFeedback} data-ticket-id={cell.row.values._id} data-target="submit-feedback-form">Submit Feedback</button> : Auth.getUser()?.data.type === "Customer" &&cell.column.Header === "Feedback" && cell.row.values.status === "Closed" && <label style={{color:'Red'}}>Feedback Submitted</label> }
                                         </td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {<SubmitFeedback isActive={isSubmitfeedback} handleSubmitFeedback={handleCloseSubmitFeedback} ticketId={dataTicketId} refetchTicketData={refetchTicketData}/>}

            </div>
        </>
    );
};

export default TicketList;
