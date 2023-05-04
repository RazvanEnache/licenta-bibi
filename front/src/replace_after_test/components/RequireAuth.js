import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ isAdmin }) => {
	const { auth } = useAuth();
	const location = useLocation();

	console.log("RequireAuth component, auth obj: " + JSON.stringify(auth));
	console.log("RequireAuth component, isAdmin prop: " + JSON.stringify(isAdmin));

	return auth?.isAdmin === isAdmin ? (
		<Outlet />
	) : auth?.user ? (
		<Navigate to="/unauthorized" state={{ from: location }} replace />
	) : (
		<Navigate to="/login" state={{ from: location }} replace />
	);
};

export default RequireAuth;
