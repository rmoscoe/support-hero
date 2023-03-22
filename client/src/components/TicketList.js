import React, { useMemo, useState } from 'react';
import { useTable, useGlobalFilter, useFilters } from 'react-table';
import { COLUMNS } from '../components/Columns'
import { GlobalFilter } from './GlobalFilter';
import { useTheme } from '../utils/ThemeContext';
import { Link } from "react-router-dom";


const TicketList = ({ tickets }) => {
    const columns = useMemo(() => COLUMNS, []);
    const data = useMemo(() => tickets, [tickets]);
    const { theme } = useTheme();
    const [isSubmitfeedback, setIsSubmitFeedback] = useState(false);


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

    const handleSubmitFeedback = () => {
        setIsSubmitFeedback(true);
    }

    if (!tickets.length) {
        return <h3 className={theme}>No Tickets Yet</h3>;
    }

    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table {...getTableProps()} className={` table ${theme === 'dark' && 'dark-bg'} is-fullwidth is-responsive hscroll`}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr className="is-selected" {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th className={`${theme}-primary has-text-black is-size-4 has-text-centered`} {...column.getHeaderProps()}>{column.render('Header')}
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    // console.log(cell)
                                    return <td style={{color:'black'}} {...cell.getCellProps()}><Link to={`/tickets/${cell.row.original._id}`}>{cell.render('Cell')}</Link>
                                    {/* { cell.column.Header === "Feedback" && !cell.value  && <button className={`${theme}-tertiary button`} onClick={handleSubmitFeedback} data-target="submit-feedback-form">Submit Feedback</button> } */}
                                    </td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    );
};

export default TicketList;
