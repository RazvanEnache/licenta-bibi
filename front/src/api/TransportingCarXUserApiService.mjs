import api from "./Api.mjs";

const getTransportingCarXUsers = () => {
	return api.get(`/transportingCarXUser`);
};

const getTransportingCarXUserById = (id) => {
	return api.get(`/transportingCarXUser/id/${id}`);
};

const registerTransportingCarXUser = (data) => {
	return api.post(`/transportingCarXUser`, data);
};

const editTransportingCarXUser = (id, data) => {
	return api.put(`/transportingCarXUser/${id}`, data);
};

const patchTransportingCarXUser = (id, data) => {
	return api.patch(`/transportingCarXUser/${id}`, data);
};

const deleteTransportingCarXUser = (id) => {
	return api.delete(`/transportingCarXUser/${id}`);
};

const transportingCarXUserService = {
	getTransportingCarXUsers,
	getTransportingCarXUserById,
	registerTransportingCarXUser,
	editTransportingCarXUser,
	deleteTransportingCarXUser,
	patchTransportingCarXUser,
};

export default transportingCarXUserService;
