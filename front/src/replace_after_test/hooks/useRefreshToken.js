import axios from "../api/Api.mjs";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await axios.get("/refresh", {
			withCredentials: true,
		});
		setAuth((prev) => {
			return { ...prev, isAdmin: response.data.isAdmin, accessToken: response.data.accessToken };
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default useRefreshToken;
