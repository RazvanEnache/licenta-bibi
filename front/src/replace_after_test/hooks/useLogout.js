import axios from "../api/Api.mjs";
import useAuth from "./useAuth";

const useLogout = () => {
	const { setAuth } = useAuth();

	const logout = async () => {
		setAuth({});
		try {
			const response = await axios.get("/logout", {
				withCredentials: true,
			});
		} catch (err) {
			console.error(err);
		}
	};

	return logout;
};

export default useLogout;
