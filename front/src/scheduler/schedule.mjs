import merchandiseService from "../api/MerchandiseApiService.mjs";
import usersService from '../api/UsersApiService.mjs';
import transportingCarXUserService from "../api/TransportingCarXUserApiService.mjs";
import transportingCarService from "../api/TransportingCarApiService.mjs";
import transportingCarXUserXMerchandiseService from "../api/TransportingCarXUserXMerchandiseApiService.mjs";

let main = async function () {
	const groupMerchandiseByPriority = function (merchandise) {
		let firstPriority = merchandise.filter((item) => {
			return item.priority === 1;
		});
		
		let secondPriority = merchandise.filter((item) => {
			return item.priority === 2;
		});
	
		return {
			firstPriority,
			secondPriority,
		};
	};
	
	const merchandiseCanBeAssociatedToVehicle = async function (
		merchandise,
		userId
	) {
		let remainedVolume = masterObject[userId].transportingCar.remainedVolume;
		let remainedWeight = masterObject[userId].transportingCar.remainedWeight;
		if(remainedVolume - merchandise.volume > 0 && remainedWeight - merchandise.weight) {
			//de adaugat verificare leaflet -- iau lat/lon de pe ultima marfa de pe masina si calculez cu lat/lon de pe marfa din functie sa vad la ce ora ajung
			//compar ora asta cu ora de pe desirableDeliveringDate sa vad daca o depasesc.
			//daca nu depasesc, return true si continui cu asocierea (push in masterObject + insert in baza de date in transportingCarXUserXMerchandise
			// + actualizare remainedV + remainedW)
			// + insert in entitatea de Transport
			return true;
		}
		return false;
	};
	
	const createMasterAggregateObject = async function (transportingCarXUsers) {
		let masterObject = {};
		transportingCarXUsers.forEach(transportingCarXUser => {
			let {data: user} = await usersService.getUserById(transportingCarXUser.userId);
			let {data: transportingCar} = await transportingCarService.getTransportingCarById(transportingCarXUser.transportingCarId);
			user.transportingCar = transportingCar;
			user.transportingCar.remainedVolume = transportingCar.maxVolume;
			user.transportingCar.remainedWeight = transportingCar.maxWeight;
			user.transportingCar.associatedMerch = [];
			
			masterObject[transportingCarXUser.userId] = user;
		})
	}

	

	try {
		let { data: todayMerchandise } =
			await merchandiseService.getMerchandises(
				`desirableDeliveringDate-eq-${new Date().toDateString()}`
			);

		let { data: transportingCarXUsers } =
			await transportingCarXUserService.getTransportingCarXUsers();

		let groupedMerchandise = groupMerchandiseByPriority(todayMerchandise);
		let masterObject = createMasterAggregateObject(transportingCarXUsers);

		//#region asociaza prima marfa de prioritate 1 compatibila la primul sofer

		//#continui asocierea de prioritati 1 cu verificare de leaflet. Se opreste cu acest sofer atunci cand ora de ajungere din punctul ultimului transport depaseste desirableDeliveringDate
		
		
		let result =
			await transportingCarXUserXMerchandiseService.registerTransportingCarXUserXMerchandise(
				{}
			);

		transportingCarXUserService.forEach((transportingCarXUser) => {
			groupedMerchandise.firstPriority.forEach(async (merchandise) => {
				let result =
					await transportingCarXUserXMerchandiseService.registerTransportingCarXUserXMerchandise(
						{}
					);
			});
		});
	} catch (error) {
		console.log(error);
	}
};
main();
