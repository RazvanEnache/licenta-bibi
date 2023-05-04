import api from "./Api.mjs";

const getTransportingCars = (query) => {
	return api.get(`/transportingCar?filter=${query}`);
};

const getTransportingCarById = (id) => {
	return api.get(`/transportingCar/${id}`);
};

const registerTransportingCar = (data) => {
	return api.post(`/transportingCar`, data);
};

const editTransportingCar = (id, data) => {
	return api.put(`/transportingCar/${id}`, data);
};

const patchTransportingCar = (id, data) => {
	return api.patch(`/transportingCar/${id}`, data);
};

const deleteTransportingCar = (id) => {
	return api.delete(`/transportingCar/${id}`);
};

const transportingCarService = {
	getTransportingCars,
	getTransportingCarById,
	registerTransportingCar,
	editTransportingCar,
	deleteTransportingCar,
	patchTransportingCar,
};

export default transportingCarService;
