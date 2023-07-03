import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import FilteringTable from "../../components/FilteringTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import FormSelect from "react-bootstrap/FormSelect";
import axios from "../../api/axios";

const AdminCars = () => {
	const [users, setUsers] = useState();
	const [cars, setCars] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	const [show, setShow] = useState(false);
	const [showPickUser, setShowPickUser] = useState(false);
	const [showAddCar, setShowAddCar] = useState(false);

	const [clickedCar, setClickedCar] = useState("");

	//regiune modal adaugare masina
	const [maxWeight, setMaxWeight] = useState();
	const [maxVolume, setMaxVolume] = useState();
	const [name, setName] = useState();
	const [consumption, setConsumption] = useState();
	//endregiune

	const handleClose = () => {
		setShow(false);
		setShowPickUser(false);
		setShowAddCar(false);
	};

	const handleShow = (carId) => {
		setShow(true);
		setClickedCar(carId);
	};

	const handleShowAddCar = () => {
		setShowAddCar(true);
	};

	const handleShowPickUser = (carId) => {
		setShowPickUser(true);
		setClickedCar(carId);
	};

	const ADMIN_CARS_COLUMNS = [
		{
			Header: "Model",
			accessor: "name",
		},
		{
			Header: "Greutate maxima",
			accessor: "maxWeight",
		},
		{
			Header: "Volum maxim",
			accessor: "maxVolume",
		},
		{
			Header: "Sofer",
			accessor: "user",
			Cell: ({ cell }) => (
				<div>
					{cell.row.values.user.length === 0 ? (
						<Button onClick={() => handleShowPickUser(cell.row.values.id)} variant="warning">
							Asociaza sofer
						</Button>
					) : (
						<div>{cell.row.values.user}</div>
					)}
				</div>
			),
		},
		{
			Header: "Utilitare",
			accessor: "id",
			Cell: ({ cell }) => (
				<div className="d-flex justify-content-around">
					<Button onClick={() => handleShow(cell.row.values.id)} variant="danger">
						Delete
					</Button>
				</div>
			),
		},
	];

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getUsers = async () => {
			try {
				let carsArray = [];
				const response = await axiosPrivate.get("/users", {
					signal: controller.signal,
				});

				const carsResponse = await axiosPrivate.get("/transportingCar", {
					signal: controller.signal,
				});

				if (Array.isArray(carsResponse.data) && carsResponse?.data?.length > 0) {
					carsResponse?.data?.forEach((car) => {
						let carObj = car;
						carObj.user = "";
						if (Array.isArray(response.data) && response.data.length > 0) {
							let carAssociatedUser = response?.data?.find((user) => user.id === car.userId);
							if (carAssociatedUser && Object.keys(carAssociatedUser).length > 0) {
								carObj.user = carAssociatedUser.firstName + " " + carAssociatedUser.lastName;
							}
						}
						carsArray.push(carObj);
					});
				}

				isMounted && setUsers(response.data);
				isMounted && setCars(Array.isArray(carsResponse.data) && carsArray.length > 0 ? carsArray : []);
			} catch (err) {
				console.error(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getUsers();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	const handleDelete = async (event) => {
		try {
			const response = await axiosPrivate.delete(`/users/${clickedCar}`);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	const handleAssociateUser = async () => {
		try {
			const response = await axiosPrivate.put(`/transportingCar/${clickedCar}`, { userId: selectedUser });
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	const handleAddCar = async (e) => {
		e.preventDefault();
		try {
			const response = await axiosPrivate.post("/transportingCar", { maxWeight, maxVolume, name, consumption });
			setShowAddCar(false);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<section className="nonAuth">
			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title className="text-danger">STERGE MASINA</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-secondary">Esti sigur ca vrei sa stergi aceasta masina?</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={handleDelete}>
						Sterge
					</Button>
					<Button variant="info" onClick={handleClose}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showPickUser} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title className="text-warning">ALEGE UN TRANSPORTATOR</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-secondary">
					<div>Asociaza transportator la aceasta masina:</div>
					<FormSelect onChange={(e) => setSelectedUser(e.target.value)}>
						{users?.length > 0 && users.map((user) => <option key={user.id}>{user.firstName + " " + user.lastName}</option>)}
					</FormSelect>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={handleAssociateUser}>
						Asociaza
					</Button>
					<Button variant="danger" onClick={handleClose}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showAddCar} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title className="text-warning">ADAUGA O MASINA</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-secondary">
					<form onSubmit={handleAddCar}>
						<label htmlFor="name">Model masina:</label>
						<input type="text" id="name" autoComplete="off" onChange={(e) => setName(e.target.value)} value={name} required />

						<label htmlFor="consumption">Consum:</label>
						<input
							type="number"
							step="any"
							id="consumption"
							onChange={(e) => setConsumption(e.target.value)}
							value={consumption}
							required
						/>

						<label htmlFor="maxWeight">Greutate maxima (KG):</label>
						<input
							type="text"
							id="maxWeight"
							autoComplete="off"
							onChange={(e) => setMaxWeight(e.target.value)}
							value={maxWeight}
							required
						/>

						<label htmlFor="maxVolume">Volum maxim (M Cub):</label>
						<input
							type="text"
							id="maxVolume"
							autoComplete="off"
							onChange={(e) => setMaxVolume(e.target.value)}
							value={maxVolume}
							required
						/>
						<hr />
						<button className="btn btn-warning" variant="warning">
							Adauga
						</button>
					</form>
				</Modal.Body>
			</Modal>
			<h1>Lista Masini</h1>
			<Button onClick={handleShowAddCar} variant="warning" className="w-25">
				Adauga masina
			</Button>
			<br />
			{users?.length ? <FilteringTable columnsData={ADMIN_CARS_COLUMNS} tableData={cars} /> : <p>Nicio masina pentru afisare.</p>}
		</section>
	);
};

export default AdminCars;
