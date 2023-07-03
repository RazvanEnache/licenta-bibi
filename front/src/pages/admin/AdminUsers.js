import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import FilteringTable from "../../components/FilteringTable";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import FormSelect from "react-bootstrap/FormSelect";

const AdminHome = () => {
	const [users, setUsers] = useState();
	const [cars, setCars] = useState([]);
	const [selectedCar, setSelectedCar] = useState("");
	const axiosPrivate = useAxiosPrivate();
	const navigate = useNavigate();
	const location = useLocation();

	const [show, setShow] = useState(false);
	const [showPickCar, setShowPickCar] = useState(false);

	const [clickedUser, setClickedUser] = useState("");

	const handleClose = () => {
		setShow(false);
		setShowPickCar(false);
	};

	const handleShow = (userId) => {
		setShow(true);
		setClickedUser(userId);
	};

	const handleShowPickCar = (userId) => {
		setShowPickCar(true);
		setClickedUser(userId);
	};

	const ADMIN_USERS_COLUMNS = [
		{
			Header: "Nume",
			accessor: "firstName",
		},
		{
			Header: "Prenume",
			accessor: "lastName",
		},
		{
			Header: "CNP",
			accessor: "cnp",
		},
		{
			Header: "Telefon",
			accessor: "phoneNumber",
		},
		{
			Header: "Masina",
			accessor: "car",
			Cell: ({ cell }) => (
				<div>
					{cell.row.values.car.length === 0 ? (
						<Button onClick={() => handleShowPickCar(cell.row.values.id)} variant="warning">
							Asociaza masina
						</Button>
					) : (
						<div>{cell.row.values.car}</div>
					)}
				</div>
			),
		},
		{
			Header: "Utilitare",
			accessor: "id",
			Cell: ({ cell }) => (
				<div className="d-flex justify-content-around">
					<Button variant="primary">
						<Link to={`/admin/users/${cell.row.values.id}`}>View</Link>
					</Button>
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
				let usersArray = [];
				const response = await axiosPrivate.get("/users?filter=user/ne/host", {
					signal: controller.signal,
				});

				const carsResponse = await axiosPrivate.get("/transportingCar", {
					signal: controller.signal,
				});

				setSelectedCar(carsResponse.data[0]?.id);

				response?.data?.forEach((user) => {
					let userObj = user;
					userObj.car = "";
					if (Array.isArray(carsResponse.data) && carsResponse.data.length > 0) {
						let userAssociatedCar = carsResponse?.data?.find((car) => car.userId === user.id);
						if (userAssociatedCar && Object.keys(userAssociatedCar).length > 0) {
							userObj.car = userAssociatedCar.id.substr(0, 4) + " " + userAssociatedCar.name;
						}
					}
					usersArray.push(userObj);
				});

				isMounted && setUsers(usersArray);
				isMounted && setCars(Array.isArray(carsResponse.data) && carsResponse?.data.length > 0 ? carsResponse.data : []);
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

	const onRowDblClick = (row) => {
		navigate(`/admin/users/${row.original.id}`, { state: { from: location }, replace: false });
	};

	const handleDelete = async (event) => {
		try {
			const response = await axiosPrivate.delete(`/users/${clickedUser}`);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	const handleAssociateCar = async () => {
		try {
			const response = await axiosPrivate.put(`/transportingCar/${selectedCar}`, { userId: clickedUser });
			setShowPickCar(false);
			window.location.reload();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<section className="nonAuth">
			<Modal show={show} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title className="text-danger">STERGE UTILIZATORUL</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-secondary">Esti sigur ca vrei sa stergi acest utilizator?</Modal.Body>
				<Modal.Footer>
					<Button variant="danger" onClick={handleDelete}>
						Sterge
					</Button>
					<Button variant="info" onClick={handleClose}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showPickCar} onHide={handleClose} centered>
				<Modal.Header closeButton>
					<Modal.Title className="text-warning">ALEGE O MASINA</Modal.Title>
				</Modal.Header>
				<Modal.Body className="text-secondary">
					<div>Asociaza masina acestui utilizator:</div>
					<FormSelect onChange={(e) => setSelectedCar(e.target.value)}>
						{cars.length > 0 &&
							cars.map((car) => (
								<option value={car?.id} key={car?.id}>
									{car?.id?.substr(0, 4) + " " + car?.name}
								</option>
							))}
					</FormSelect>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={handleAssociateCar}>
						Asociaza
					</Button>
					<Button variant="danger" onClick={handleClose}>
						Cancel
					</Button>
				</Modal.Footer>
			</Modal>
			<h1>Lista Utilizatori</h1>
			{users?.length ? (
				<FilteringTable columnsData={ADMIN_USERS_COLUMNS} tableData={users} onRowDblClick={onRowDblClick} />
			) : (
				<p>Niciun utilizator pentru afisare.</p>
			)}
		</section>
	);
};

export default AdminHome;
