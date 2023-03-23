import api from "./Api.mjs";

const getMerchandises = () => {
	return api.get(`/merchandise`);
};

const getMerchandiseById = (id) => {
	return api.get(`/merchandise/${id}`);
};

const registerMerchandise = (data) => {
	return api.post(`/merchandise`, data);
};

const editMerchandise = (id, data) => {
	return api.put(`/merchandise/${id}`, data);
};

const patchMerchandise = (id, data) => {
	return api.patch(`/merchandise/${id}`, data);
};

const deleteMerchandise = (id) => {
	return api.delete(`/merchandise/${id}`);
};

const merchandiseService = {
	getMerchandises,
	getMerchandiseById,
	registerMerchandise,
	editMerchandise,
	deleteMerchandise,
	patchMerchandise,
};

export default merchandiseService;
