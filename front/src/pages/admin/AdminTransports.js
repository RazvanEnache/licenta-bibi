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
			Header: "Data de livrare",
			accessor: "desirableDeliveringDate",
			Cell: ({ cell }) => format(new Date(cell.row.values.desirableDeliveringDate), "dd/MM/yyyy"),
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
			Header: "Volum",
			accessor: "volume",
		},
		{
			Header: "Greutate",
			accessor: "weight",
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
							transportObj.latitude = merchandise.latitude;
							transportObj.longitude = merchandise.longitude;
							transportObj.volume = merchandise.volume;
							transportObj.weight = merchandise.weight;
							//transport.status = status;

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
			<h1>Lista transporturi de efectuat astazi:</h1>
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
