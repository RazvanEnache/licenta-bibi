import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios, { axiosPrivate } from "../../api/axios";
import FilteringTable from "../../components/FilteringTable";
import { Spinner } from "react-bootstrap";
import { format } from "date-fns";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as ttapi from "@tomtom-international/web-sdk-services";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const AdminTransportDetail = () => {
	const [transport, setTransport] = useState();

	const mapElement = useRef();
	const [map, setMap] = useState({});

	const navigate = useNavigate();
	const location = useLocation();
	const { id } = useParams();

	const tomtomApiKey = "foQZHPqTvz6z5b9z4gSkaQnzWRoeAmhd";

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		let transportObj = {};

		let map = tt.map({
			key: tomtomApiKey,
			container: mapElement.current,
			stylesVisibility: {
				trafficIncidents: true,
				trafficFlow: true,
			},
			center: [26.096306, 44.439663],
			zoom: 10,
		});

		const getTransport = async () => {
			try {
				const { data: transportData } = await axiosPrivate.get(`/transport/${id}`, {
					signal: controller.signal,
				});

				if (transportData && Object.keys(transportData).length > 0) {
					const { data: merchandise } = await axiosPrivate.get(`/merchandise/${transportData.merchandiseId}`, {
						signal: controller.signal,
					});

					const { data: userData } = await axiosPrivate.get(`/users/${transportData.userId}`, {
						signal: controller.signal,
					});

					transportObj.id = transportData.id;
					transportObj.merchandiseId = transportData.merchandiseId;
					transportObj.userId = transportData.userId;
					transportObj.driver = userData?.firstName + " " + userData?.lastName;
					transportObj.priority = merchandise?.priority;
					transportObj.desirableDeliveringDate = format(new Date(merchandise?.desirableDeliveringDate), "dd/MM/yyy");
					transportObj.latitude = merchandise?.latitude;
					transportObj.longitude = merchandise?.longitude;
					transportObj.volume = merchandise?.volume;
					transportObj.weight = merchandise?.weight;
					//transport.status = status;

					const element = document.createElement("div");
					element.className = "marker-delivery";
					new tt.Marker({
						element: element,
					})
						.setLngLat({ lng: 26.053076, lat: 44.421949 })
						.addTo(map);
				}

				isMounted && setTransport(transportObj);
			} catch (err) {
				console.log(err);
				navigate("/login", { state: { from: location }, replace: true });
			}
		};

		isMounted && setMap(map);
		getTransport();
		return () => {
			isMounted = false;
			map.remove();
			controller.abort();
		};
	}, []);

	return (
		<>
			{map && <div ref={mapElement} className="map" />}
			<section className="nonAuth">
				{transport && Object.keys(transport).length > 0 && (
					<div className="d-flex flex-column">
						<h3>
							Transportator: <b>{transport.driver}</b>
						</h3>
						<h3>
							Prioritate: <b>{transport.priority === 1 ? "Inalta" : "Standard"}</b>
						</h3>
						<h3>
							Data de livrare: <b>{transport.desirableDeliveringDate}</b>
						</h3>
						<h3>
							Volum: <b>{transport.volume}</b>
						</h3>
						<h3>
							Greutate: <b>{transport.weight}</b>
						</h3>
					</div>
				)}

				{!transport && (
					<div className="w-100 h-100 text-center">
						<Spinner animation="border" />
					</div>
				)}
			</section>
		</>
	);
};

export default AdminTransportDetail;
