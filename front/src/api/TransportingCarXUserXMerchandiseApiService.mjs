import api from "./Api";

const getTransportingCarXUserXMerchandise = (query) => {
	return api.get(`/transportingCarXUserXMerchandise/?filter=${query}`);
};

const getTransportingCarXUserXMerchandiseById = (id) => {
	return api.get(`/transportingCarXUserXMerchandise/id/${id}`);
};

const registerTransportingCarXUserXMerchandise = (data) => {
	return api.post(`/transportingCarXUserXMerchandise`, data);
};

const editTransportingCarXUserXMerchandise = (id, data) => {
	return api.put(`/transportingCarXUserXMerchandise/${id}`, data);
};

const patchTransportingCarXUserXMerchandise = (id, data) => {
	return api.patch(`/transportingCarXUserXMerchandise/${id}`, data);
};

const deleteTransportingCarXUserXMerchandise = (id) => {
	return api.delete(`/transportingCarXUserXMerchandise/${id}`);
};

const transportingCarXUserXMerchandiseService = {
	getTransportingCarXUserXMerchandise,
	getTransportingCarXUserXMerchandiseById,
	registerTransportingCarXUserXMerchandise,
	editTransportingCarXUserXMerchandise,
	deleteTransportingCarXUserXMerchandise,
	patchTransportingCarXUserXMerchandise,
};

export default transportingCarXUserXMerchandiseService;
