import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const response = await axios.get("/refresh", {
			withCredentials: true,
		});
		setAuth((prev) => {
			console.log(JSON.stringify(prev));
			console.log(response.data.accessToken);
			console.log(response.data.roles);
			console.log(response.data.user);
			return {
				...prev,
				roles: response.data.roles,
				accessToken: response.data.accessToken,
				user: response.data.user,
				userObj: response.data.userObj,
			};
		});
		return response.data.accessToken;
	};
	return refresh;
};

export default useRefreshToken;
