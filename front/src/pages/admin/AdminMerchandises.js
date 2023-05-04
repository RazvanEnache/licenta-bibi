import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import FilteringTable from "../../components/FilteringTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import FormSelect from "react-bootstrap/FormSelect";
import axios from "../../api/axios";
import { format } from "date-fns";

const AdminMerchandises = () => {
	const [merchandises, setMerchandises] = useState([]);
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	const [show, setShow] = useState(false);
	const [showAddMerchandise, setShowAddMerchandise] = useState(false);

	//regiune modal adaugare marfa
	const [volume, setVolume] = useState();
	const [weight, setWeight] = useState();
	const [desirableDeliveringDate, setDesirableDeliveringDate] = useState();
	const [priority, setPriority] = useState();
	const [longitude, setLongitude] = useState();
	const [latitude, setLatitude] = useState();
	//endregiune

	const handleClose = () => {
		setShow(false);
		setShowAddMerchandise(false);
	};

	const handleShow = (carId) => {
		setShow(true);
	};

	const handleShowAddMerchandise = () => {
		setShowAddMerchandise(true);
	};

	const ADMIN_MERCHANDISES_COLUMNS = [
		{
			Header: "Prioritate",
			accessor: "priority",
		},
		{
			Header: "Volum",
			accessor: "volume",
		},
		{
			Header: "Greutate",
			accessor: "weight",
		},
		{
			Header: "Data de livrare",
			accessor: "desirableDeliveringDate",
			Cell: ({ cell }) => format(new Date(cell.row.values.desirableDeliveringDate), "dd/MM/yyyy"),
		},
		{
			Header: "Longitudine",
			accessor: "longitude",
		},
		{
			Header: "Latitudine",
			accessor: "latitude",
		},
		{
			Header: "Utilitare",
			accessor: "id",
			Cell: ({ cell }) => (
				<div className="d-flex justify-content-around">
					<Button variant="danger">Delete</Button>
				</div>
			),
		},
	];

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getMerchandises = async () => {
			try {
				const response = await axiosPrivate.get("/merchandise", {
					signal: controller.signal,
				});

				isMounted && setMerchandises(response.data);
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getMerchandises();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	const handleDelete = async (event) => {
		//trebuie sa modifice si orarul
	};

	const handleAddMerchandise = async (e) => {
		e.preventDefault();
		try {
			const response = await axiosPrivate.post("/merchandise", {
				volume,
				weight,
				desirableDeliveringDate,
				longitude,
				latitude,
				priority,
				associated: false,
			});
			setShowAddMerchandise(false);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<section className="nonAuth">
			<Modal show={showAddMerchandise} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title className="text-warning">ADAUGA O MARFA</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-secondary">
					<form onSubmit={handleAddMerchandise}>
						<label htmlFor="priority">Prioritate:</label>
						<FormSelect id="priority" onChange={(e) => setPriority(e.target.value)}>
							<option value={1}>1</option>
							<option value={2}>2</option>
						</FormSelect>

						<label htmlFor="weight">Greutate (KG):</label>
						<input
							type="number"
							id="weight"
							autoComplete="off"
							onChange={(e) => setWeight(e.target.value)}
							value={weight}
							required
						/>

						<label htmlFor="volume">Volum (M Cub):</label>
						<input
							type="number"
							id="volume"
							autoComplete="off"
							onChange={(e) => setVolume(e.target.value)}
							value={volume}
							required
						/>

						<label htmlFor="desirableDeliveringDate">Data de livrare:</label>
						<input
							type="date"
							id="desirableDeliveringDate"
							autoComplete="off"
							onChange={(e) => setDesirableDeliveringDate(e.target.value)}
							value={desirableDeliveringDate}
							required
						/>

						<label htmlFor="longitude">Longitudine:</label>
						<input
							type="text"
							id="longitude"
							autoComplete="off"
							onChange={(e) => setLongitude(e.target.value)}
							value={longitude}
							required
						/>

						<label htmlFor="latitude">Latitudine:</label>
						<input
							type="text"
							id="latitude"
							autoComplete="off"
							onChange={(e) => setLatitude(e.target.value)}
							value={latitude}
							required
						/>
						<hr />
						<button className="btn btn-warning" variant="warning">
							Adauga
						</button>
					</form>
				</Modal.Body>
			</Modal>
			<h1>Lista Marfuri</h1>
			<Button onClick={handleShowAddMerchandise} variant="warning" className="w-25">
				Adauga marfa
			</Button>
			<br />
			{merchandises?.length ? (
				<FilteringTable columnsData={ADMIN_MERCHANDISES_COLUMNS} tableData={merchandises} />
			) : (
				<p>Nicio marfa pentru afisare.</p>
			)}
		</section>
	);
};

export default AdminMerchandises;
