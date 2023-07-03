import Card from "react-bootstrap/Card";

function CurrentTransportCard({ destination, merchandiseId, status }) {
	return (
		<Card>
			<Card.Header>TRANSPORT CURENT:</Card.Header>
			<Card.Body>
				<blockquote className="blockquote mb-0">
					<footer>
						Destinatie: <b>{destination}</b>
					</footer>
					<footer>
						Marfa: <b>{merchandiseId}</b>
					</footer>
					<footer>
						Status transport:{" "}
						<b className={status === "Draft" ? "text-secondary" : status === "Efectuat" ? "text-success" : "text-warning"}>
							{status}
						</b>
					</footer>
				</blockquote>
			</Card.Body>
		</Card>
	);
}

export default CurrentTransportCard;
