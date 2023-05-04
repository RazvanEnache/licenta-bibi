import dotenv from "dotenv";
import express, { json } from "express";
import { initialize } from "./repository.js";
import verifyJWT from "./middleware/verifyJWT.js";
import routesJWT from "./routes/routesJWT.js";
import routesNonJWT from "./routes/routesNonJWT.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";

dotenv.config();
const application = express();
application.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});

application.use(cors(corsOptions));
application.use(express.urlencoded({ extended: false }));
application.use(json());
application.use(cookieParser());
application.use("/api", routesNonJWT);
//application.use(verifyJWT);
application.use("/api", routesJWT);

application.listen(8080, async () => {
	try {
		await initialize();
	} catch (error) {
		console.error(error);
	}
});
