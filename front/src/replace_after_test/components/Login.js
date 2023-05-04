import { useRef, useState, useEffect, useContext } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useLogout from "../hooks/useLogout"; //de sters

import usersService from "../api/UsersApiService.mjs";

const Login = () => {
	const { setAuth, persist, setPersist } = useAuth();
	const userRef = useRef();
	const errRef = useRef();

	// de sters
	const logout = useLogout();

	const signOut = async () => {
		await logout();
		navigate("/");
	};
	//end de sters

	const navigate = useNavigate();
	const location = useLocation();
	const from = location.state?.from?.pathname || "/";

	const [user, setUser] = useState("");
	const [pwd, setPwd] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd]);

	useEffect(() => {
		localStorage.setItem("persist", persist);
	}, [persist]);

	const togglePersist = () => {
		setPersist((prev) => !prev);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await usersService.authUser(JSON.stringify({ user, pwd }));
			setSuccess(true);
			console.log(JSON.stringify(response?.data));
			const accessToken = response?.data?.accessToken;
			const isAdmin = response?.data?.isAdmin;
			setAuth({ user, pwd, isAdmin, accessToken });
			setUser("");
			setPwd("");
			navigate(from, { replace: true });
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.response?.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg("Login Failed");
			}
			errRef.current.focus();
		}
	};

	return (
		<>
			{success ? (
				<section>
					<h1>You are logged in!</h1>
					<br />
					<p>
						<a href="#">Go to Home</a>
					</p>
				</section>
			) : (
				<section>
					<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
						{errMsg}
					</p>
					<h1>Sign In</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="username">Username:</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							value={user}
							required
						/>

						<label htmlFor="password">Password:</label>
						<input type="password" id="password" onChange={(e) => setPwd(e.target.value)} value={pwd} required />
						<button>Sign In</button>
						<div className="persistCheck">
							<input type="checkbox" id="persist" onChange={togglePersist} checked={persist} />
							<label htmlFor="persist">Trust This Device</label>
						</div>
					</form>
					<p>
						Need an Account?
						<br />
						<span className="line">
							{/*put router link here*/}
							<Link to="/register">Sign Up</Link>
						</span>
					</p>
					<div className="flexGrow">
						<button onClick={signOut}>Sign Out</button>
					</div>
				</section>
			)}
		</>
	);
};

export default Login;
