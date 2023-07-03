import { Button } from "react-bootstrap";
import axios, { axiosPrivate } from "../../api/axios";
import tomtomService from "../../api/TomTomApiService.mjs";
import { useState, useEffect } from "react";
import { PieChart, Pie, Tooltip, BarChart, XAxis, YAxis, Legend, CartesianGrid, Bar } from "recharts";

const AdminAdministrative = () => {
	const [successAlgorithm, setSuccessAlgorithm] = useState();
	const [transportsData, setTransportsData] = useState([]);
	const [transportersData, setTransportersData] = useState([]);

	const gasolinePrice = 6.5;

	const generateFirstReport = async () => {
		const { data: transportsData } = await axiosPrivate.get("/transport?filter=status/eq/Efectuat");

		const groupTransportsByMonth = (transports) => {
			let groupedTransports = [
				{
					name: "ian",
					transporturi: 0,
				},
				{
					name: "feb",
					transporturi: 0,
				},
				{
					name: "mar",
					transporturi: 0,
				},
				{
					name: "apr",
					transporturi: 0,
				},
				{
					name: "mai",
					transporturi: 0,
				},
				{
					name: "iun",
					transporturi: 0,
				},
				{
					name: "iul",
					transporturi: 0,
				},
				{
					name: "aug",
					transporturi: 0,
				},
				{
					name: "sep",
					transporturi: 0,
				},
				{
					name: "oct",
					transporturi: 0,
				},
				{
					name: "noi",
					transporturi: 0,
				},
				{
					name: "dec",
					transporturi: 0,
				},
			];
			for (let i = 0; i < transports.length; i++) {
				let date = new Date(transports[i].date).toLocaleDateString("ro-RO", { month: "long" }).slice(0, 3);
				var item = groupedTransports.find((item) => item.name === date);
				item.transporturi++;
			}

			return groupedTransports;
		};

		const groupedTransports = groupTransportsByMonth(transportsData);
		setTransportsData(groupedTransports);
	};
	const generateSecondReport = async () => {
		const { data: transportsData } = await axiosPrivate.get("/transport?filter=status/eq/Efectuat");
		const { data: transportersData } = await axiosPrivate.get("/users");

		let transportersArray = [];
		for (let i = 0; i < transportersData.length; i++) {
			let currentTransporter = transportersData[i];
			if (transportersData[i].user !== "host") {
				transportersArray.push({
					name: currentTransporter.firstName + " " + currentTransporter.lastName,
					transporturi: 0,
					id: currentTransporter.id,
				});
			}
		}

		console.log(transportersArray);
		console.log(transportsData);

		for (let i = 0; i < transportsData.length; i++) {
			console.log(transportsData[i].userId);
			transportersArray.find((item) => item.id === transportsData[i].userId).transporturi++;
		}

		setTransportersData(transportersArray);
	};

	useEffect(() => {
		return () => {
			setSuccessAlgorithm(null);
			setTransportersData([]);
			setTransportsData([]);
		};
	}, []);

	let generateSchedule = async function () {
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
				let responseObject = {
					isSuccess: false,
					distanceTraveled: 0,
				};
				let remainedVolume = masterObject[userId].transportingCar.remainedVolume;
				let remainedWeight = masterObject[userId].transportingCar.remainedWeight;
				if (remainedVolume - merchandise.volume >= 0 && remainedWeight - merchandise.weight >= 0) {
					let lastAssociatedMerchandise = masterObject[userId].transportingCar.associatedMerch.at(-1);
					if (!lastAssociatedMerchandise) {
						let fromHQTo = {
							origins: [
								{
									point: {
										latitude: 44.4365,
										longitude: 26.0993,
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
						let routeSummaryFromHQ = await tomtomService.getRouteSummary(fromHQTo);
						console.log(merchandise);
						console.log(routeSummaryFromHQ);
						let distanceTraveledFromHQ = routeSummaryFromHQ.response.routeSummary.lengthInMeters / 1000;
						return { isSuccess: true, distanceTraveled: distanceTraveledFromHQ };
					}
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
						let lengthInKM = routeSummary.response.routeSummary.lengthInMeters / 1000;
						responseObject.distanceTraveled = lengthInKM;
						if (routeSummary.statusCode === 200) {
							let lastMerchandiseDeliveryDate = new Date(lastAssociatedMerchandise.desirableDeliveringDate);

							//de la desirableDeliveringDate de la lastMerchandise, adaug 15 min si adaug travelTimeInSeconds sa vad la ce ora as ajunge
							let arrivalDateFromLastLocation = new Date(
								lastMerchandiseDeliveryDate.setMinutes(
									lastMerchandiseDeliveryDate.getMinutes() +
										15 +
										routeSummary.response.routeSummary.travelTimeInSeconds / 60
								)
							);

							switch (merchandise.priority) {
								case "1":
									if (arrivalDateFromLastLocation <= new Date(merchandise.desirableDeliveringDate)) {
										responseObject.isSuccess = true;
									}
									break;
								case "2":
									if (arrivalDateFromLastLocation <= new Date(new Date().setHours(18, 30))) {
										responseObject.isSuccess = true;
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
				return responseObject;
			};

			const createMasterAggregateObject = async function (transportingCars) {
				let masterObject = {};

				for (let i = 0; i < transportingCars.length; i++) {
					let { data: user } = await axiosPrivate.get(`/users/${transportingCars[i].userId}`);

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

						await axiosPrivate.post("/transport", {
							userId: key,
							merchandiseId: currentMerch.id,
							date: currentMerch.desirableDeliveringDate,
							distanceTraveled: currentMerch.distanceTraveled,
							cost: currentMerch.cost,
							fuelConsumption: currentMerch.fuelConsumption,
						});
					}
				}
			};
			//#end region

			let { data: allMerchandise } = await axiosPrivate.get("/merchandise?filter=associated/eq/0");
			allMerchandise = allMerchandise.filter((merchandise) => merchandise.cancelled !== true);
			let todayMerchandise = allMerchandise.filter((merchandise) => {
				return new Date(merchandise.desirableDeliveringDate).toLocaleDateString("en-US") === new Date().toLocaleDateString("en-US");
			});

			let { data: transportingCars } = await axiosPrivate.get("/transportingCar?filter=userId/not/null");

			let groupedMerchandise = groupMerchandiseByPriority(allMerchandise);
			masterObject = await createMasterAggregateObject(transportingCars);

			//#region asociaza prima marfa de prioritate 1 compatibila la primul sofer
			for (let i = 0; i < transportingCars.length; i++) {
				let currentUser = transportingCars[i].userId;
				let carConsumption = transportingCars[i].consumption;

				for (let j = 0; j < groupedMerchandise.firstPriority.length; j++) {
					let currentMerchandise = groupedMerchandise.firstPriority[j];
					let response = await merchandiseCanBeAssociatedToVehicle(currentMerchandise, currentUser);
					console.log(response);
					if (!currentMerchandise.associated && response.isSuccess) {
						currentMerchandise.distanceTraveled = response.distanceTraveled;
						currentMerchandise.fuelConsumption = (carConsumption / 100) * response.distanceTraveled;
						currentMerchandise.cost = currentMerchandise.fuelConsumption * gasolinePrice;
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
					let response = await merchandiseCanBeAssociatedToVehicle(currentMerchandise, currentUser);
					console.log(response);

					if (!currentMerchandise.associated && response.isSuccess) {
						currentMerchandise.distanceTraveled = response.distanceTraveled;
						currentMerchandise.fuelConsumption = (carConsumption / 100) * response.distanceTraveled;
						currentMerchandise.cost = currentMerchandise.fuelConsumption * gasolinePrice;
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
			console.log("Master object: ");
			console.log(masterObject);
			await finnishAlgorithm();
			setSuccessAlgorithm(true);
		} catch (error) {
			console.log(error);
			setSuccessAlgorithm(false);
		}
	};

	return (
		<div className="growWithChild" style={{ display: "inline-block" }}>
			{successAlgorithm === true && <h2 className="text-success">Algoritmul s-a rulat cu succes!</h2>}
			{successAlgorithm === false && <h2 className="text-danger">Algoritmul a intampinat o eroare!</h2>}
			<h2>Algoritm</h2>
			<Button variant="info" onClick={generateSchedule}>
				Genereaza orar
			</Button>
			<br />
			<br />
			<h2>Regiune rapoarte</h2>
			<hr />
			<h3>Raport detalii transport (lunar)</h3>
			<p>Acest raport ofera informatii despre numarul de transporturi efectuate in ultimul an</p>
			<Button variant="warning" onClick={generateFirstReport}>
				Genereaza raport
			</Button>
			{transportsData.length > 0 && (
				<div id="transportsReport">
					<BarChart
						width={800}
						height={300}
						data={transportsData}
						margin={{
							top: 50,
							right: 30,
							left: 0,
							bottom: 5,
						}}
						barSize={20}
					>
						<XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} tick={{ stroke: "white", strokeWidth: 1 }} />
						<YAxis tick={{ stroke: "white", strokeWidth: 2 }} />
						<Tooltip />
						<Legend />
						<CartesianGrid strokeDasharray="3 3" />
						<Bar dataKey="transporturi" fill="#8884d8" background={{ fill: "#eee" }} />
					</BarChart>
				</div>
			)}

			<br />
			<hr />
			<h3>Raport detalii transportatori (lunar)</h3>
			<p>Acest raport ofera informatii despre numarul de transporturi efectuate in ultimul an de fiecare transportator in parte</p>
			<Button variant="warning" onClick={generateSecondReport}>
				Genereaza raport
			</Button>
			{transportersData.length > 0 && (
				<div id="transportersReport">
					<BarChart
						width={500}
						height={300}
						data={transportersData}
						margin={{
							top: 50,
							right: 30,
							left: 0,
							bottom: 5,
						}}
						barSize={20}
					>
						<XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} tick={{ stroke: "white", strokeWidth: 1 }} />
						<YAxis tick={{ stroke: "white", strokeWidth: 2 }} />
						<Tooltip />
						<Legend />
						<CartesianGrid strokeDasharray="3 3" />
						<Bar dataKey="transporturi" fill="#8884d8" background={{ fill: "#eee" }} />
					</BarChart>
				</div>
			)}
		</div>
	);
};

export default AdminAdministrative;
