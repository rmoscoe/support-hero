import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTable, useGlobalFilter, useFilters } from 'react-table';
import { COLUMNS } from '../components/Columns'
import { GlobalFilter } from './GlobalFilter';
import { ColumnFilter } from './ColumnFilter';
import { useTheme } from '../utils/ThemeContext';


const TicketList = ({ tickets }) => {
    const columns = useMemo(() => COLUMNS, [])
    const data = useMemo(() => tickets, [])
    const { theme } = useTheme();

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
                                    return <td {...cell.getCellProps()}><a style={{ color: 'black' }} href={`/tickets/${cell.row.original._id}`}>{cell.render('Cell')}</a></td>
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
