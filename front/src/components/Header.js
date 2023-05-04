import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Button, Form } from "react-bootstrap";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";

function Header() {
	let { auth } = useAuth();
	const roles = auth?.roles?.split(" ");
	const logout = useLogout();
	const navigate = useNavigate();

	const handleSignOut = async () => {
		await logout();
		navigate("/login");
	};

	return (
		<>
			{roles ? (
				<Navbar bg="primary" variant="dark">
					<Container fluid>
						<Navbar.Brand>
							<Link to="/">SimpleLogistics</Link>
						</Navbar.Brand>
						<Nav className="me-auto">
							{roles.find((role) => role === "5150") ? (
								<>
									<Nav.Link>
										<Link to="/admin/users">Utilizatori</Link>
									</Nav.Link>
									<Nav.Link>
										<Link to="/admin/cars">Masini</Link>
									</Nav.Link>
									<Nav.Link>
										<Link to="/admin/merchandises">Marfuri</Link>
									</Nav.Link>
									<Nav.Link>
										<Link to="/admin/transports">Transporturi</Link>
									</Nav.Link>
									<Nav.Link>
										<Link to="#">Administrativ</Link>
									</Nav.Link>
								</>
							) : (
								<>
									<Nav.Link>
										<Link to="/profile">Profilul meu</Link>
									</Nav.Link>
								</>
							)}
						</Nav>
						<Form className="d-flex">
							<Button onClick={handleSignOut} variant="light">
								Sign Out
							</Button>
						</Form>
					</Container>
				</Navbar>
			) : (
				<></>
			)}
		</>
	);
}

export default Header;
