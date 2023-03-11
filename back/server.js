import express, { json } from "express";
import { initialize } from "./repository.js";
import routes from "./routes.js";

const application = express();
application.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});
application.use(json());
application.use("/api", routes);
// application.use((req, res, next) => {
//   res.status(404).send("<h1> Page not found </h1>");
// });

application.listen(8080, async () => {
	try {
		await initialize();
	} catch (error) {
		console.error(error);
	}
});
