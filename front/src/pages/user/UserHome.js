import { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useNavigate, useLocation } from "react-router-dom";
import CurrentTransportCard from "../../components/CurrentTransportCard";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as ttapi from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { axiosPrivate } from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { Button, Spinner } from "react-bootstrap";
import FilteringTable from "../../components/FilteringTable";
import { format } from "date-fns";

const tomtomApiKey = "OtuPVAWYG9uHLLVSB1HSaeIZyf9Sv0Mc";

const UserHome = () => {
	const mapElement = useRef();
	const [map, setMap] = useState({});

	const { auth, setAuth } = useAuth();

	const navigate = useNavigate();
	const location = useLocation();

	const [transports, setTransports] = useState([]);
	const [currentTransport, setCurrentTransport] = useState();
	const [currentPositionMarker, setCurrentPositionMarker] = useState();
	const [currentTransportMarker, setCurrentTransportMarker] = useState();
	const [latitude, setLatitude] = useState(44.373831);
	const [longitude, setLongitude] = useState(26.076004);

	const USER_TRANSPORTS_COLUMNS = [
		{
			Header: "Sofer",
			accessor: "driver",
		},
		{
			Header: "Prioritate",
			accessor: "priority",
		},
		{
			Header: "Data de livrare",
			accessor: "desirableDeliveringDate",
			Cell: ({ cell }) => format(new Date(cell.row.values.desirableDeliveringDate), "dd/MM/yyyy"),
		},
		{
			Header: "Latitudine destinatie",
			accessor: "latitude",
		},
		{
			Header: "Longitudine destinatie",
			accessor: "longitude",
		},
		{
			Header: "Volum",
			accessor: "volume",
		},
		{
			Header: "Greutate",
			accessor: "weight",
		},
		{
			Header: "Status",
			accessor: "status",
			Cell: ({ cell }) => {
				return (
					<div
						className={
							cell.row.values.status === "Draft"
								? "text-secondary"
								: cell.row.values.status === "Efectuat"
								? "text-success"
								: cell.row.values.status === "In progres livrare"
								? "text-warning"
								: "text-danger"
						}
					>
						{cell.row.values.status}
					</div>
				);
			},
		},
	];

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const origin = {
			latitude: 44.4365,
			longitude: 26.0993,
		};

		let ttMap = tt.map({
			key: tomtomApiKey,
			container: mapElement.current,
			stylesVisibility: {
				trafficIncidents: true,
				trafficFlow: true,
			},
			center: [origin.longitude, origin.latitude],
			zoom: 12,
		});

		setMap(ttMap);

		const getTransports = async () => {
			let transportsArray = [];

			try {
				const { data: merchandisesData } = await axiosPrivate.get("/merchandise", {
					signal: controller.signal,
				});

				const { data: userData } = await axiosPrivate.get(`/users?filter=user/eq/${auth?.user}`, {
					signal: controller.signal,
				});

				const { data: transportsData } = await axiosPrivate.get(`/transport?filter=userId/eq/${userData[0]?.id}`, {
					signal: controller.signal,
				});

				for (let i = 0; i < transportsData.length; i++) {
					let transport = transportsData[i];
					let associatedMerch = merchandisesData.find((merch) => transport.merchandiseId === merch.id);
					let transportObj = {};

					if (associatedMerch) {
						transportObj.id = transport.id;
						transportObj.index = i;
						transportObj.merchandiseId = transport.merchandiseId;
						transportObj.userId = transport.userId;
						transportObj.driver = userData[0]?.firstName + " " + userData[0]?.lastName;
						transportObj.priority = associatedMerch.priority;
						transportObj.desirableDeliveringDate = associatedMerch.desirableDeliveringDate;
						transportObj.latitude = associatedMerch.latitude;
						transportObj.longitude = associatedMerch.longitude;
						transportObj.volume = associatedMerch.volume;
						transportObj.weight = associatedMerch.weight;
						transportObj.status = transport.status;
						transportObj.client = associatedMerch.client;

						transportsArray.push(transportObj);
					}
				}

				const transport = transportsArray.find((t) => t.status === "Draft" || t.status === "In progres livrare");

				isMounted && setAuth({ ...auth, user: userData[0].user });
				isMounted && setCurrentTransport(transport);
				isMounted && setTransports(transportsArray);
			} catch (err) {
				console.log(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		getTransports();

		return () => {
			isMounted = false;
			ttMap.remove();
			controller.abort();
		};
	}, []);

	useEffect(() => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		};

		const success = (pos) => {
			let crd = pos.coords;
			setLatitude(crd.latitude);
			setLongitude(crd.longitude);

			const element = document.createElement("div");
			element.className = "marker-transporter";
			if (Object.keys(map).length > 0) {
				const currentPositionMarker = new tt.Marker({
					element: element,
				})
					.setLngLat([crd.longitude, crd.latitude])
					.addTo(map);

				setCurrentPositionMarker(currentPositionMarker);
			}

			if (Object.keys(map).length > 0) {
				if (currentTransport && currentTransport.status === "In progres livrare") {
					let locations = crd.longitude + "," + crd.latitude + ":" + currentTransport.longitude + "," + currentTransport.latitude;
					const element = document.createElement("div");
					element.className = "marker-delivery";
					const currentTransportMarker = new tt.Marker({
						element: element,
					})
						.setLngLat([currentTransport.longitude, currentTransport.latitude])
						.setPopup(new tt.Popup({ offset: 36 }).setHTML(`<div class='text-dark'>${currentTransport.client}</div>`))
						.addTo(map);
					setCurrentTransportMarker(currentTransportMarker);

					drawRoute(locations);
				} else {
					if (map.getLayer("route")) {
						map.removeLayer("route");
						map.removeSource("route");
					}
				}
			}
		};

		const error = (err) => {
			console.log(err);
		};

		//if (currentTransport & map) {
		navigator.geolocation.getCurrentPosition(success, error, options);
		//}
		return () => {
			currentTransportMarker && currentTransportMarker.remove();
			currentPositionMarker && currentPositionMarker.remove();
		};
	}, [currentTransport, map]);

	const drawRoute = (locations) => {
		ttapi.services
			.calculateRoute({
				key: tomtomApiKey,
				locations,
			})
			.then((routeData) => {
				const geoJson = routeData.toGeoJson();
				if (map.getLayer("route")) {
					map.removeLayer("route");
					map.removeSource("route");
				}
				map.addLayer({
					id: "route",
					type: "line",
					source: {
						type: "geojson",
						data: geoJson,
					},
					paint: {
						"line-color": "#0000ff",
						"line-width": 6,
					},
				});
			});
	};

	const handleChangeTransportStatus = async (status) => {
		try {
			let deliveredDate = new Date();
			const result = await axiosPrivate.patch(`/transport/${currentTransport.id}`, { status });
			setCurrentTransport({ ...currentTransport, status });
			const index = currentTransport.index;
			setTransports((prev) => {
				return [...prev.slice(0, index), Object.assign({}, transports[index], { status }), ...prev.slice(index + 1)];
			});
			if (transports[index + 1] && transports[index + 1].status === "Draft" && status === "Efectuat") {
				await axiosPrivate.patch(`/transport/${currentTransport.id}`, { date: deliveredDate });
				setCurrentTransport(transports[index + 1]);
			} else if (!transports[index + 1] || transports[index + 1].status !== "Draft") {
				setCurrentTransport(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="container">
			{currentTransport && (
				<>
					<div className="align-self-start">
						<CurrentTransportCard
							status={currentTransport?.status}
							merchandiseId={currentTransport?.merchandiseId}
							destination={currentTransport?.latitude + " " + currentTransport?.longitude}
						/>
					</div>
				</>
			)}
			{!currentTransport && <h1>Niciun transport de efectuat.</h1>}
			<br />
			{map && <div ref={mapElement} className="map" />}
			{currentTransport && (
				<div>
					{currentTransport.status === "Draft" && (
						<Button className="w-25 btn-success" onClick={() => handleChangeTransportStatus("In progres livrare")}>
							Start
						</Button>
					)}
					{currentTransport.status === "In progres livrare" && (
						<Button className="w-25 btn-warning" onClick={() => handleChangeTransportStatus("Efectuat")}>
							Efectuat
						</Button>
					)}
				</div>
			)}

			<br />
			<h4>Transporturi de efectuat: </h4>
			{transports.length > 0 ? (
				<FilteringTable columnsData={USER_TRANSPORTS_COLUMNS} tableData={transports} />
			) : (
				<p>Niciun transport de afisat.</p>
			)}
		</div>
	);
};

export default UserHome;
