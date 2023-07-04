import { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { axiosPrivate } from "../../api/axios";
import FilteringTable from "../../components/FilteringTable";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";

const AdminUserDetails = () => {
	const [user, setUser] = useState({});
	const [transports, setTransports] = useState();

	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

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
				const response = await axiosPrivate.get(`/users/${id}`, {
					signal: controller.signal,
				});

				const { data: transportsData } = await axiosPrivate.get(`/transport?filter=userId/eq/${id}`, {
					signal: controller.signal,
				});
				if (Array.isArray(transportsData) && transportsData.length > 0) {
					for (let i = 0; i < transportsData.length; i++) {
						let transport = transportsData[i];
						let transportObj = {};
						const { data: merchandise } = await axiosPrivate.get(`/merchandise/${transport.merchandiseId}`, {
							signal: controller.signal,
						});
						if (merchandise) {
							transportObj.id = transport.id;
							transportObj.merchandiseId = transport.merchandiseId;
							transportObj.userId = id;
							transportObj.driver = response.data.firstName + " " + response.data.lastName;
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
				isMounted && setUser(response.data);
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
		<>
			{Object.keys(user).length > 0 && (
				<div className="d-flex flex-column">
					<h1 className="display-1">
						{user.firstName} {user.lastName}
					</h1>
					<h1>
						Email: <b>{user.email}</b>
					</h1>
					<h1>
						CNP: <b>{user.cnp}</b>
					</h1>
					<h1>
						Telefon: <b>{user.phoneNumber}</b>
					</h1>

					<br />
					<h1>Transporturi efectuate și de efectuat: </h1>
					{transports.length > 0 ? (
						<FilteringTable
							columnsData={ADMIN_USER_TRANSPORTS_COLUMNS}
							tableData={transports}
							onRowDblClick={(row) => navigate(`/admin/transports/${row.original.id}`)}
						/>
					) : (
						<p>Niciun transport de afisat.</p>
					)}
				</div>
			)}

			{Object.keys(user).length <= 0 && (
				<div className="w-100 h-100 text-center">
					<Spinner animation="border" />
				</div>
			)}
		</>
	);
};

export default AdminUserDetails;
