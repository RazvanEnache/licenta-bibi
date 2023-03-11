import api from "./Api";

const getAddresses = () => {
	return api.get(`/addre`);
};

const getAddressById = (id) => {
	return api.get(`/address/id/${id}`);
};

const registerAddress = (data) => {
	return api.post(`/address`, data);
};

const editAddress = (id, data) => {
	return api.put(`/address/${id}`, data);
};

const patchAddress = (id, data) => {
	return api.patch(`/address/${id}`, data);
};

const deleteAddress = (id) => {
	return api.delete(`/address/${id}`);
};

const addressService = {
	getAddresses,
	getAddressById,
	registerAddress,
	editAddress,
	deleteAddress,
	patchAddress,
};

export default addressService;
