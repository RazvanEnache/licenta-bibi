import React, { useMemo, useEffect, useState } from "react";
import { useTable, useGlobalFilter, usePagination, useSortBy } from "react-table";
import { GlobalFilter } from "./GlobalFilter";
import BTable from "react-bootstrap/Table";

const FilteringTable = ({ columnsData, tableData, onRowDblClick }) => {
	const columns = useMemo(() => columnsData, []);
	const data = useMemo(() => [...tableData], [tableData]);

	const tableInstance = useTable(
		{
			columns,
			data,
		},
		useGlobalFilter,
		useSortBy,
		usePagination
	);

	const {
		getTableBodyProps,
		getTableProps,
		setGlobalFilter,
		headerGroups,
		page,
		nextPage,
		previousPage,
		prepareRow,
		canNextPage,
		canPreviousPage,
		pageOptions,
		state,
		gotoPage,
		pageCount,
	} = tableInstance;

	const { globalFilter, pageIndex } = state;

	return (
		<>
			<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
			<BTable striped bordered hover variant="dark" className="filtering-table mt-5" id="table" {...getTableProps()}>
				<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps(column.getSortByToggleProps())}>
									{column.render("Header")}
									<span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{page.map((row) => {
						prepareRow(row);
						return (
							<tr
								{...row.getRowProps()}
								onDoubleClick={() => {
									if (onRowDblClick) onRowDblClick(row);
								}}
							>
								{row.cells.map((cell) => {
									return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</BTable>
			<div className="mt-3 ">
				<span>
					Page{" "}
					<strong>
						{pageIndex + 1} of {pageOptions.length}
					</strong>
				</span>
				<div className="d-inline mx-5">
					{" "}
					<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
						{"<<"}
					</button>
					<button onClick={() => previousPage()} disabled={!canPreviousPage}>
						Previous
					</button>
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						Next
					</button>
					<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
						{">>"}
					</button>
				</div>
			</div>
		</>
	);
};

export default FilteringTable;
