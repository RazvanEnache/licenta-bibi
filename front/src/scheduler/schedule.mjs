import axios, { axiosPrivate } from "../api/axios.js";
import tomtomService from "../api/TomTomApiService.mjs";

let main = async function () {
	try {
		let masterObject = {};

		//#region utility functions
		const groupMerchandiseByPriority = function (merchandise) {
			merchandise.sort((first, second) => {
				let firstDate = new Date(first.desirableDeliveringDate);
				let secondDate = new Date(second.desirableDeliveringDate);

				return firstDate - secondDate;
			});

			let firstPriority = merchandise.filter((item) => {
				return item.priority === "1";
			});

			let secondPriority = merchandise.filter((item) => {
				return item.priority === "2";
			});

			return {
				firstPriority,
				secondPriority,
			};
		};

		const merchandiseCanBeAssociatedToVehicle = async function (merchandise, userId) {
			let remainedVolume = masterObject[userId].transportingCar.remainedVolume;
			let remainedWeight = masterObject[userId].transportingCar.remainedWeight;
			if (remainedVolume - merchandise.volume >= 0 && remainedWeight - merchandise.weight >= 0) {
				let lastAssociatedMerchandise = masterObject[userId].transportingCar.associatedMerch.at(-1);
				if (!lastAssociatedMerchandise) return true;
				let fromTo = {
					origins: [
						{
							point: {
								latitude: lastAssociatedMerchandise.latitude,
								longitude: lastAssociatedMerchandise.longitude,
							},
						},
					],
					destinations: [
						{
							point: {
								latitude: merchandise.latitude,
								longitude: merchandise.longitude,
							},
						},
					],
				};
				try {
					let routeSummary = await tomtomService.getRouteSummary(fromTo);
					if (routeSummary.statusCode === 200) {
						let lastMerchandiseDeliveryDate = new Date(lastAssociatedMerchandise.desirableDeliveringDate);

						//de la desirableDeliveringDate de la lastMerchandise, adaug 15 min si adaug travelTimeInSeconds sa vad la ce ora as ajunge
						let arrivalDateFromLastLocation = new Date(
							lastMerchandiseDeliveryDate.setMinutes(
								lastMerchandiseDeliveryDate.getMinutes() + 15 + routeSummary.response.routeSummary.travelTimeInSeconds / 60
							)
						);

						switch (merchandise.priority) {
							case "1":
								if (arrivalDateFromLastLocation <= new Date(merchandise.desirableDeliveringDate)) {
									return true;
								}
								break;
							case "2":
								if (arrivalDateFromLastLocation <= new Date(new Date().setHours(18, 30))) {
									return true;
								}
								break;
							default:
								break;
						}
					} else {
						console.log("TomTom Request error");
					}
				} catch (error) {
					console.log(error);
				}
			}
			return false;
		};

		const createMasterAggregateObject = async function (transportingCars) {
			let masterObject = {};

			for (let i = 0; i < transportingCars.length; i++) {
				let { data: user } = await axiosPrivate.get(`/user/${transportingCars[i].userId}`);

				user.transportingCar = transportingCars[i];
				user.transportingCar.remainedVolume = transportingCars[i].maxVolume;
				user.transportingCar.remainedWeight = transportingCars[i].maxWeight;
				user.transportingCar.associatedMerch = [];

				masterObject[user.id] = user;
			}

			return masterObject;
		};

		const finnishAlgorithm = async function () {
			//trb sa insereze obiecte in entitate: Transport
			for (let key in masterObject) {
				for (let i = 0; i < masterObject[key].transportingCar.associatedMerch.length; i++) {
					let currentMerch = masterObject[key].transportingCar.associatedMerch[i];
					await transportService.registerTransport({
						userId: key,
						merchandiseId: currentMerch.id,
						date: currentMerch.desirableDeliveringDate,
					});
				}
			}
		};
		//#end region

		let { data: allMerchandise } = await axiosPrivate.get("/merchandise?filter=associated/eq/0");
		let todayMerchandise = allMerchandise.filter((merchandise) => {
			return new Date(merchandise.desirableDeliveringDate).toLocaleDateString("en-US") === new Date().toLocaleDateString("en-US");
		});

		let { data: transportingCars } = await axiosPrivate.get("/transportingCar?filter=userId/not/null");

		let groupedMerchandise = groupMerchandiseByPriority(todayMerchandise);

		masterObject = await createMasterAggregateObject(transportingCars);

		//#region asociaza prima marfa de prioritate 1 compatibila la primul sofer
		for (let i = 0; i < transportingCars.length; i++) {
			let currentUser = transportingCars[i].userId;
			for (let j = 0; j < groupedMerchandise.firstPriority.length; j++) {
				let currentMerchandise = groupedMerchandise.firstPriority[j];
				if (
					currentMerchandise.associated !== false &&
					(await merchandiseCanBeAssociatedToVehicle(currentMerchandise, currentUser))
				) {
					masterObject[currentUser].transportingCar.associatedMerch.push(currentMerchandise);
					masterObject[currentUser].transportingCar.remainedVolume -= currentMerchandise.volume;
					masterObject[currentUser].transportingCar.remainedWeight -= currentMerchandise.weight;
					groupedMerchandise.firstPriority[j].associated = true;
					await axiosPrivate.patch(`/merchandise/${currentMerchandise.id}`, { associated: true });
				}
			}

			//de grupat prioritatea 2
			for (let j = 0; j < groupedMerchandise.secondPriority.length; j++) {
				let currentMerchandise = groupedMerchandise.secondPriority[j];
				if (
					currentMerchandise.associated !== false &&
					(await merchandiseCanBeAssociatedToVehicle(currentMerchandise, currentUser))
				) {
					masterObject[currentUser].transportingCar.associatedMerch.push(currentMerchandise);
					masterObject[currentUser].transportingCar.remainedVolume -= currentMerchandise.volume;
					masterObject[currentUser].transportingCar.remainedWeight -= currentMerchandise.weight;
					groupedMerchandise.secondPriority[j].associated = true;
					await axiosPrivate.patch(`/merchandise/${currentMerchandise.id}`, { associated: true });
				}
			}
			//trebuie marcat in baza de date marfurile asociate si cele ramase neasociate
		}
		//#endregion
		await finnishAlgorithm();
	} catch (error) {
		console.log(error);
	}
};
await main();
