import api from "./Api.mjs";

const getTransports = () => {
	return api.get(`/transport`);
};

const getTransportById = (id) => {
	return api.get(`/transport/${id}`);
};

const registerTransport = (data) => {
	return api.post(`/transport`, data);
};

const editTransport = (id, data) => {
	return api.put(`/transport/${id}`, data);
};

const patchTransport = (id, data) => {
	return api.patch(`/transport/${id}`, data);
};

const deleteTransport = (id) => {
	return api.delete(`/transport/${id}`);
};

const transportService = {
	getTransports,
	getTransportById,
	registerTransport,
	editTransport,
	deleteTransport,
	patchTransport,
};

export default transportService;
