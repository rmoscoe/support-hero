import { ColumnFilter } from "./ColumnFilter"
export const COLUMNS = [
    {
        Header : 'Ticket ID',
        accessor : "_id",
        Filter : ColumnFilter
    },
    {
        Header : 'Title',
        accessor : "title",
        Filter : ColumnFilter
    },
    {
        Header : 'Created On',
        accessor : "createdAt",
        Filter : ColumnFilter
    },
    {
        Header : 'Status',
        accessor : "status",
        Filter : ColumnFilter
    },
    // {
    //     Header : 'Feedback',
    //     accessor : "feedback._id",
    //     Filter : ColumnFilter

    // }


]