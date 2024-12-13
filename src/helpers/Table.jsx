import React, { useMemo, useState, useEffect } from 'react';
import { useTable, useFilters, useGlobalFilter, useSortBy, usePagination } from 'react-table';
import * as XLSX from 'xlsx';
import ReactPaginate from 'react-paginate';
import './table.css';

const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column;
  return (
    <input
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder={`Search by ${column.Header}...`}
    />
  );
};

// Global Filter Component
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <span>
      Search: {' '}
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder="Type to search..."
      />
    </span>
  );
};

const Table = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/Database_Literature_Scopus.xlsx');
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching or parsing the Excel file:', error);
      }
    };

    fetchData();
  }, []);

  const columns = useMemo(
    () => [
      { Header: 'Title', accessor: 'Title',disableSortBy: false,Filter: ColumnFilter },
      { Header: 'Year', accessor: 'Year',disableSortBy: false,Filter: ColumnFilter },
      { Header: 'Source Title', accessor: 'Source title',disableSortBy: false,Filter: ColumnFilter },
      {
        Header: 'DOI',
        accessor: 'DOI',
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ cell: { value } }) => (
          <a href={`https://doi.org/${value}`} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        ),
      },
      {
        Header: 'Link',
        accessor: 'Link',
        disableSortBy: true,
        disableFilters: true,
        Cell: ({ cell: { value } }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            Link
          </a>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setPageSize,
    gotoPage,
    state: { pageIndex, pageSize, globalFilter },
    setGlobalFilter,
    allColumns,
    pageOptions,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className='tablesort'>
      <div className="filters">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        {allColumns
          .filter(column => ['Title', 'Year', 'Source Title'].includes(column.Header))
          .map(column => (
            <div key={column.id}>
              <label htmlFor={column.id}>{column.Header}: </label>
              {column.canFilter ? column.render('Filter') : null}
            </div>
          ))}
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={pageOptions.length}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={({ selected }) => gotoPage(selected)}
          containerClassName={'pagination'}
          activeClassName={'active'}
        />
        <select
          value={pageSize}
          onChange={e => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Table;
