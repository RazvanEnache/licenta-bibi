import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import FilteringTable from "../../components/FilteringTable";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";

const AdminTransports = () => {
	const [transports, setTransports] = useState();

	const navigate = useNavigate();
	const location = useLocation();

	const ADMIN_USER_TRANSPORTS_COLUMNS = [
		{
			Header: "Sofer",
			accessor: "driver",
		},
		{
			Header: "Prioritate",
			accessor: "priority",
		},
		{
			Header: "Data ceruta de livrare",
			accessor: "desirableDeliveringDate",
			Cell: ({ cell }) => {
				return (
					new Date(cell.row.values.desirableDeliveringDate).toLocaleDateString() +
					" " +
					new Date(cell.row.values.desirableDeliveringDate).toLocaleTimeString()
				);
			},
		},
		{
			Header: "Data efectiva a livrarii",
			accessor: "dateDelivered",
			Cell: ({ cell }) => {
				let date = cell.row.values.dateDelivered
					? new Date(cell.row.values.dateDelivered).toLocaleDateString() +
					  " " +
					  new Date(cell.row.values.dateDelivered).toLocaleTimeString()
					: "";
				return <div>{date}</div>;
			},
		},
		{
			Header: "Latitudine destinatie",
			accessor: "latitude",
		},
		{
			Header: "Longitudine destinatie",
			accessor: "longitude",
		},
		{
			Header: "Volum (M Cub)",
			accessor: "volume",
		},
		{
			Header: "Greutate (KG)",
			accessor: "weight",
		},
		{
			Header: "Status",
			accessor: "status",
			Cell: ({ cell }) => {
				return (
					<div
						className={
							cell.row.values.status === "Draft"
								? "text-secondary"
								: cell.row.values.status === "Efectuat"
								? "text-success"
								: cell.row.values.status === "In progres livrare"
								? "text-warning"
								: "text-danger"
						}
					>
						{cell.row.values.status}
					</div>
				);
			},
		},
	];

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		let transportsArray = [];

		const getUser = async () => {
			try {
				const response = await axiosPrivate.get("/users", {
					signal: controller.signal,
				});

				const { data: transportsData } = await axiosPrivate.get(`/transport`, {
					signal: controller.signal,
				});
				if (Array.isArray(transportsData) && transportsData.length > 0) {
					for (let i = 0; i < transportsData.length; i++) {
						let transport = transportsData[i];
						let driver = response.data.find((transporter) => transporter.id === transport.userId);
						let transportObj = {};
						const { data: merchandise } = await axiosPrivate.get(`/merchandise/${transport.merchandiseId}`, {
							signal: controller.signal,
						});
						if (merchandise) {
							transportObj.id = transport.id;
							transportObj.merchandiseId = transport.merchandiseId;
							transportObj.userId = transport.userId;
							transportObj.driver = driver?.firstName + " " + driver?.lastName;
							transportObj.priority = merchandise.priority;
							transportObj.desirableDeliveringDate = merchandise.desirableDeliveringDate;
							transportObj.dateDelivered = transport.dateDelivered;
							transportObj.latitude = merchandise.latitude;
							transportObj.longitude = merchandise.longitude;
							transportObj.volume = merchandise.volume;
							transportObj.weight = merchandise.weight;
							transportObj.status = transport.status;

							transportsArray.push(transportObj);
						}
					}
				}

				console.log(transportsArray);

				isMounted && setTransports(transportsArray.length > 0 ? transportsArray : []);
			} catch (err) {
				console.log(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getUser();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	return (
		<section className="nonAuth">
			<h1>Lista transporturi: </h1>
			{transports?.length > 0 ? (
				<FilteringTable
					columnsData={ADMIN_USER_TRANSPORTS_COLUMNS}
					tableData={transports}
					onRowDblClick={(row) => navigate(`/admin/transports/${row.original.id}`)}
				/>
			) : (
				<p>Niciun transport de afisat.</p>
			)}
		</section>
	);
};

export default AdminTransports;
