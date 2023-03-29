import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters, useSortBy } from 'react-table';
import { COLUMNS } from '../components/Columns'
import { GlobalFilter } from './GlobalFilter';
import { useTheme } from '../utils/ThemeContext';
import { Link } from "react-router-dom";
import SubmitFeedback from '../components/SubmitFeedback';
import Auth from '../utils/auth';

const TicketList = ({ tickets, refetchTicketData, setHistoryView }) => {
    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => tickets, [tickets]);
    const { theme } = useTheme();
    const [isSubmitfeedback, setIsSubmitFeedback] = useState(false);
    const [dataTicketId, setDataTicketId] = useState(" ");
    const [userType, isUserType] = useState(Auth.getUser()?.data.type)

    const initialState = { hiddenColumns: ["priority"] };
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
        // defaultSortBy: [{ id: "_id", desc: false }],
        initialState
    }, useFilters, useGlobalFilter, useSortBy)

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
    const customSortTypes = {
        sortByPriority: (rowA, rowB, id, descr) => {
            console.log("Sorting...", rowA, rowB);
            let a = rowA.values.priority;
            let b = rowB.values.priority;
            switch (a) {
                case "Low":
                    a = 1;
                    break;
                case "Medium":
                    a = 2;
                    break;
                case "High":
                    a = 3;
                    break;
                default:
                    console.log("Could not find priority: ", rowA);
            }
            switch (b) {
                case "Low":
                    b = 1;
                    break;
                case "Medium":
                    b = 2;
                    break;
                case "High":
                    b = 3;
                    break;
                default:
                    console.log("Could not find priority: ", rowB);
            }
            if (a > b) {
                return 1;
            }
            if (a < b) {
                return -1;
            }
            return 0;
        }
    }

    columns.forEach((column) => {
        if (column.id === "priority") {
            console.log("Adding sort");
            column.sortType = customSortTypes.sortByPriority;
        }
    })

    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <div className={`${theme}-border-table table-container`}>
                <table {...getTableProps()} className={`table is-narrow  is-fullwidth is-responsive hscroll`}>
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => {
                                    return (
                                        <th
                                            className={theme === 'light' ? `table-head header-bold ${theme}-primary has-text-black is-size-4 has-text-centered` : `table-head header-bold ${theme}-primary is-size-4 has-text-centered has-text-white`}

                                            {...column.getHeaderProps()}
                                        >
                                            {userType === "Agent" && column.Header === "Feedback" ? null : column.render('Header')}

                                            <div >
                                                {userType === "Agent" && column.Header === "Feedback" ? null : column.canFilter ? column.render('Filter') : null}
                                            </div>
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
                                        return <td className={window.location.href.split('/').pop() === cell.row.original._id ? `current-ticket ${theme}-text` : `${theme}-text `} {...cell.getCellProps()} data-label={Auth.getUser()?.data.type === "Agent" && cell.column.Header === 'Feedback' ? '' : cell.column.Header}>
                                            <Link className={window.location.href.split('/') === cell.row.original._id ? 'is-selected' : ''} onClick={() => setHistoryView(false)} to={`/tickets/${cell.row.original._id}`}>
                                                {cell.column.Header !== "Feedback" && cell.render('Cell')}
                                            </Link>
                                            {Auth.getUser()?.data.type === "Customer" &&
                                                cell.column.Header === "Feedback" &&
                                                cell.row.values.status === "Closed" &&
                                                !cell.value &&
                                                <button className={`${theme}-tertiary button`} onClick={handleSubmitFeedback} data-ticket-id={cell.row.values._id} data-target="submit-feedback-form">Submit Feedback</button>
                                            }
                                            {Auth.getUser()?.data.type === "Customer" &&
                                                cell.column.Header === "Feedback" &&
                                                cell.row.values.status === "Closed" &&
                                                cell.value &&
                                                <label style={{ color: 'Red' }}>Feedback Submitted</label>
                                            }
                                        </td>
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                {<SubmitFeedback isActive={isSubmitfeedback} handleSubmitFeedback={handleCloseSubmitFeedback} ticketId={dataTicketId} refetchTicketData={refetchTicketData} />}

            </div>
        </>
    );
};

export default TicketList;
