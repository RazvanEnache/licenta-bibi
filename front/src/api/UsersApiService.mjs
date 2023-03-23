import api from "./Api.mjs";

const getUsers = () => {
	return api.get(`/users`);
};

const getUserById = (id) => {
	return api.get(`/users/${id}`);
};

const registerUser = (data) => {
	return api.post(`/users`, data);
};

const editUser = (id, data) => {
	return api.put(`/users/${id}`, data);
};

const patchUser = (id, data) => {
	return api.patch(`/users/${id}`, data);
};

const deleteUser = (id) => {
	return api.delete(`/users/${id}`);
};

const sendMail = (config) => {
	return api.post("/send-mail", config);
};

const usersService = {
	getUsers,
	getUserById,
	registerUser,
	editUser,
	deleteUser,
	patchUser,
	sendMail,
};

export default usersService;
