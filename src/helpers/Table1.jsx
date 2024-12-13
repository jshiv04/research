import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useGlobalFilter, useFilters,usePagination } from 'react-table';
import DATA from './Database_Literature_Scopus.json';
import './table1.css';

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

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <span>
      Global Search: {' '}
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder="Type to search..."
      />
    </span>
  );
};

const COLUMNS = [
  {
    Header: 'Title',
    accessor: 'Title',
    disableSortBy: false,
    Filter: ColumnFilter,
  },
  {
    Header: 'Year',
    accessor: 'Year',
    disableSortBy: false,
    Filter: ColumnFilter,
  },
  {
    Header: 'Source Title',  // Changed from 'Source title' to 'Source Title'
    accessor: 'Source title',
    disableSortBy: false,
    Filter: ColumnFilter,
  },
  {
    Header: 'DOI',
    accessor: 'DOI',
    disableSortBy: true,
    disableFilters: true,
    Cell: ({ cell: { value } }) => (
      value ? (
        <a href={`https://doi.org/${value}`} target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      ) : 'N/A'
    ),
  },
  {
    Header: 'Link',
    accessor: 'Link',
    disableSortBy: true,
    disableFilters: true,
    Cell: ({ cell: { value } }) => (
      value ? (
        <a href={value} target="_blank" rel="noopener noreferrer">
          Link
        </a>
      ) : 'N/A'
    ),
  },
];

const Table1 = () => {
  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => DATA.Database_Literature_Scopus, []);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
    state,
    setGlobalFilter,
    allColumns,
  } = tableInstance;

  const { globalFilter,pageIndex,pageSize } = state;

  return (
    <div className="table1">
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
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th key={column.id} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? '⬆'
                          : '⬇'
                        : ''}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td key={cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-controls">
      <div className="pagination-left">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
      </div>

      <div className="pagination-center">
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page: {' '}
          <input 
            type='number' 
            defaultValue={pageIndex + 1} 
            onChange={e => {
              const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(pageNumber);
            }}
            style={{ width: '50px' }}
          />
        </span>
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

      <div className="pagination-right">
        <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
      </div>
    </div>

    </div>
  );
};

export default Table1;