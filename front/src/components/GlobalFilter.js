import React from "react";

export const GlobalFilter = ({ filter, setFilter }) => {
	return (
		<span>
			<h4>Search:</h4>
			<input value={filter || ""} onChange={(e) => setFilter(e.target.value)} />
		</span>
	);
};
