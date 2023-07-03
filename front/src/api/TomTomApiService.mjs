import axios from "axios";

const getRouteSummary = async (body) => {
	try {
		const { data } = await axios.post(
			`https://api.tomtom.com/routing/1/matrix/sync/json?key=OtuPVAWYG9uHLLVSB1HSaeIZyf9Sv0Mc&routeType=fastest&travelMode=car`,
			body
		);

		return data.matrix[0][0];
	} catch (error) {
		console.log(error);
	}
};

const tomtomService = {
	getRouteSummary,
};

export default tomtomService;
