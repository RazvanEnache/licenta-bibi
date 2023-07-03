import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isValidCNP } from "../../utils/utils";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/axios";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/;
const PHONE_REGEX =
	/^(?:(?:(?:00\s?|\+)40\s?|0)(?:7\d{2}\s?\d{3}\s?\d{3}|(21|31)\d{1}\s?\d{3}\s?\d{3}|((2|3)[3-7]\d{1})\s?\d{3}\s?\d{3}|(8|9)0\d{1}\s?\d{3}\s?\d{3}))$/;

const MyProfile = () => {
	const { auth } = useAuth();

	const userRef = useRef();
	const errRef = useRef();

	const [user, setUser] = useState("");
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

	const [disabled, setDisabled] = useState(true);

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

	const [errMsg, setErrMsg] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		userRef.current.focus();
		setUser(auth.userObj.user);
		setEmail(auth.userObj.email);
		setCnp(auth.userObj.cnp);
		setPhoneNumber(auth.userObj.phoneNumber);
		setFirstName(auth.userObj.firstName);
		setLastName(auth.userObj.lastName);
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
		setErrMsg("");
	}, [user, cnp, email, phoneNumber, firstName, lastName]);

	const handleSave = async (e) => {
		e.preventDefault();
		const v1 = USER_REGEX.test(user);
		if (!v1) {
			setErrMsg("Invalid Entry");
			return;
		}
		try {
			const response = await axios.put(
				`/users/${auth.userObj.id}`,
				JSON.stringify({ user, firstName, lastName, cnp, email, phoneNumber }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			// TODO: remove console.logs before deployment
			console.log(JSON.stringify(response?.data));
			//console.log(JSON.stringify(response))
			setSuccess(true);
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 409) {
				setErrMsg("Username Taken");
			} else {
				setErrMsg("Registration Failed");
			}
			errRef.current.focus();
		} finally {
			setDisabled(true);
		}
	};

	return (
		<>
			<section>
				<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">
					{errMsg}
				</p>
				<form>
					<label htmlFor="username">
						Username:
						<FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
						<FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
					</label>
					<input
						type="text"
						id="username"
						disabled={disabled}
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

					<label htmlFor="email">
						Email:
						<FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
						<FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
					</label>
					<input
						type="text"
						id="email"
						disabled={disabled}
						autoComplete="off"
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
						disabled={disabled}
						autoComplete="off"
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
						Trebuie sa fie un numar de telefon valid.
					</p>

					<label htmlFor="cnp">
						Cnp:
						<FontAwesomeIcon icon={faCheck} className={validCnp ? "valid" : "hide"} />
						<FontAwesomeIcon icon={faTimes} className={validCnp || !cnp ? "hide" : "invalid"} />
					</label>
					<input
						type="text"
						id="cnp"
						disabled={disabled}
						autoComplete="off"
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
						disabled={disabled}
						autoComplete="off"
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
						disabled={disabled}
						autoComplete="off"
						onChange={(e) => setLastName(e.target.value)}
						value={lastName}
						required
						aria-describedby="uidnote"
						onFocus={() => setLastNameFocus(true)}
						onBlur={() => setLastNameFocus(false)}
					/>

					<button
						className="btn btn-primary"
						onClick={() => setDisabled(false)}
						disabled={disabled ? false : true}
						className={disabled ? "" : "d-none"}
					>
						Edit
					</button>
					<button
						className="btn btn-warning"
						onClick={handleSave}
						disabled={!disabled && validPhoneNumber && validName && validEmail && validCnp ? false : true}
						className={disabled ? "d-none" : ""}
					>
						Save
					</button>
				</form>
			</section>
		</>
	);
};

export default MyProfile;
