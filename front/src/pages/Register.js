import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { isValidCNP } from "../utils/utils";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const PHONE_REGEX =
	/^(?:(?:(?:00\s?|\+)40\s?|0)(?:7\d{2}\s?\d{3}\s?\d{3}|(21|31)\d{1}\s?\d{3}\s?\d{3}|((2|3)[3-7]\d{1})\s?\d{3}\s?\d{3}|(8|9)0\d{1}\s?\d{3}\s?\d{3}))$/;

const REGISTER_URL = "/register";

const Register = () => {
	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [email, setEmail] = useState("");
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [cnp, setCnp] = useState("");
	const [validCnp, setValidCnp] = useState(false);
	const [cnpFocus, setCnpFocus] = useState(false);

	const [phoneNumber, setPhoneNumber] = useState("");
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

	const [firstName, setFirstName] = useState("");
	const [firstNameFocus, setFirstNameFocus] = useState(false);

	const [lastName, setLastName] = useState("");
	const [lastNameFocus, setLastNameFocus] = useState(false);

	const [pwd, setPwd] = useState("");
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState("");
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setValidName(USER_REGEX.test(user));
	}, [user]);

	useEffect(() => {
		setValidCnp(isValidCNP(cnp));
	}, [cnp]);

	useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidPhoneNumber(PHONE_REGEX.test(phoneNumber));
	}, [phoneNumber]);

	useEffect(() => {
		setValidPwd(PWD_REGEX.test(pwd));
		setValidMatch(pwd === matchPwd);
	}, [pwd, matchPwd]);

	useEffect(() => {
		setErrMsg("");
	}, [user, pwd, matchPwd, cnp, email, phoneNumber, firstName, lastName]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		// if button enabled with JS hack
		const v1 = USER_REGEX.test(user);
		const v2 = PWD_REGEX.test(pwd);
		if (!v1 || !v2) {
			setErrMsg("Invalid Entry");
			return;
		}
		try {
			const response = await axios.post(
				REGISTER_URL,
				JSON.stringify({ user, pwd, firstName, lastName, cnp, email, phoneNumber, roles: "2001" }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			// TODO: remove console.logs before deployment
			console.log(JSON.stringify(response?.data));
			//console.log(JSON.stringify(response))
			setSuccess(true);
			//clear state and controlled inputs
			setUser("");
			setPwd("");
			setMatchPwd("");
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 409) {
				setErrMsg("Username Taken");
			} else {
				setErrMsg("Registration Failed");
			}
			errRef.current.focus();
		}
	};

	return (
		<>
			{success ? (
				<section>
					<h1>Success!</h1>
					<p>
						<a href="/">Sign In</a>
					</p>
				</section>
			) : (
				<section>
					<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
						{errMsg}
					</p>
					<h1>Register</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="username">
							Username:
							<FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
							<FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
						</label>
						<input
							type="text"
							id="username"
							ref={userRef}
							autoComplete="off"
							onChange={(e) => setUser(e.target.value)}
							value={user}
							required
							aria-invalid={validName ? "false" : "true"}
							aria-describedby="uidnote"
							onFocus={() => setUserFocus(true)}
							onBlur={() => setUserFocus(false)}
						/>
						<p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
							<FontAwesomeIcon icon={faInfoCircle} />
							4 spre 24 caractere.
							<br />
							Obligatoriu sa inceapa cu o litera.
							<br />
							Litere, numere si underscore acceptate.
						</p>

						<label htmlFor="password">
							Parola:
							<FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
							<FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
						</label>
						<input
							type="password"
							id="password"
							onChange={(e) => setPwd(e.target.value)}
							value={pwd}
							required
							aria-invalid={validPwd ? "false" : "true"}
							aria-describedby="pwdnote"
							onFocus={() => setPwdFocus(true)}
							onBlur={() => setPwdFocus(false)}
						/>
						<p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
							<FontAwesomeIcon icon={faInfoCircle} />
							8 spre 24 caractere.
							<br />
							Obligatoriu sa includa o litera mare, litera mica, un numar si un caracter special.
							<br />
							Caractere speciale permise: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span>{" "}
							<span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
						</p>

						<label htmlFor="confirm_pwd">
							Confirma Parola:
							<FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
							<FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
						</label>
						<input
							type="password"
							id="confirm_pwd"
							onChange={(e) => setMatchPwd(e.target.value)}
							value={matchPwd}
							required
							aria-invalid={validMatch ? "false" : "true"}
							aria-describedby="confirmnote"
							onFocus={() => setMatchFocus(true)}
							onBlur={() => setMatchFocus(false)}
						/>
						<p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Trebuie sa coincida cu primul camp de parola.
						</p>

						<label htmlFor="email">
							Email:
							<FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
							<FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
						</label>
						<input
							type="text"
							id="email"
							autoComplete="on"
							onChange={(e) => setEmail(e.target.value)}
							value={email}
							required
							aria-invalid={validEmail ? "false" : "true"}
							aria-describedby="uidnote"
							onFocus={() => setEmailFocus(true)}
							onBlur={() => setEmailFocus(false)}
						/>
						<p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Trebuie sa fie un email valid.
						</p>

						<label htmlFor="phoneNumber">
							Telefon:
							<FontAwesomeIcon icon={faCheck} className={validPhoneNumber ? "valid" : "hide"} />
							<FontAwesomeIcon icon={faTimes} className={validPhoneNumber || !phoneNumber ? "hide" : "invalid"} />
						</label>
						<input
							type="text"
							id="phoneNumber"
							autoComplete="on"
							onChange={(e) => setPhoneNumber(e.target.value)}
							value={phoneNumber}
							required
							aria-invalid={validPhoneNumber ? "false" : "true"}
							aria-describedby="uidnote"
							onFocus={() => setPhoneNumberFocus(true)}
							onBlur={() => setPhoneNumberFocus(false)}
						/>
						<p id="uidnote" className={phoneNumberFocus && phoneNumber && !validPhoneNumber ? "instructions" : "offscreen"}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Trebuie sa fie un email valid.
						</p>

						<label htmlFor="cnp">
							Cnp:
							<FontAwesomeIcon icon={faCheck} className={validCnp ? "valid" : "hide"} />
							<FontAwesomeIcon icon={faTimes} className={validCnp || !cnp ? "hide" : "invalid"} />
						</label>
						<input
							type="text"
							id="cnp"
							autoComplete="on"
							onChange={(e) => setCnp(e.target.value)}
							value={cnp}
							required
							aria-invalid={validCnp ? "false" : "true"}
							aria-describedby="uidnote"
							onFocus={() => setCnpFocus(true)}
							onBlur={() => setCnpFocus(false)}
						/>
						<p id="uidnote" className={cnpFocus && cnp && !validCnp ? "instructions" : "offscreen"}>
							<FontAwesomeIcon icon={faInfoCircle} />
							Trebuie sa fie un CNP valid.
						</p>

						<label htmlFor="nume">Nume:</label>
						<input
							type="text"
							id="nume"
							autoComplete="on"
							onChange={(e) => setFirstName(e.target.value)}
							value={firstName}
							required
							aria-describedby="uidnote"
							onFocus={() => setFirstNameFocus(true)}
							onBlur={() => setFirstNameFocus(false)}
						/>

						<label htmlFor="prenume">Prenume:</label>
						<input
							type="text"
							id="prenume"
							autoComplete="on"
							onChange={(e) => setLastName(e.target.value)}
							value={lastName}
							required
							aria-describedby="uidnote"
							onFocus={() => setLastNameFocus(true)}
							onBlur={() => setLastNameFocus(false)}
						/>

						<button className="btn btn-primary" disabled={!validName || !validPwd || !validMatch ? true : false}>
							Sign Up
						</button>
					</form>
					<p>
						Deja inregistrat?
						<br />
						<span className="line">
							<Link to="/">Sign In</Link>
						</span>
					</p>
				</section>
			)}
		</>
	);
};

export default Register;
