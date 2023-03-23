import express from "express";
import { User, Merchandise, Transport, TransportingCar } from "./repository.js";
import { getRecords, postRecord, deleteRecords, getRecord, headRecord, putRecord, patchRecord, deleteRecord, sendMail } from "./service.js";

const router = express.Router();

router.route("/send-mail").post(async (request, response) => sendMail(request, response));

router
	.route("/users")
	.get(async (request, response) => getRecords(User, request, response))
	.post(async (request, response) => postRecord(User, request, response))
	.delete(async (request, response) => deleteRecords(User, request, response));

router
	.route("/users/:id")
	.get(async (request, response) => getRecord(User, request, response))
	.head(async (request, response) => headRecord(User, request, response))
	.put(async (request, response) => putRecord(User, request, response))
	.patch(async (request, response) => patchRecord(User, request, response))
	.delete(async (request, response) => deleteRecordByEthAddress(User, request, response));

router
	.route("/transportingCar")
	.get(async (request, response) => getRecords(TransportingCar, request, response))
	.post(async (request, response) => postRecord(TransportingCar, request, response))
	.delete(async (request, response) => deleteRecords(TransportingCar, request, response));

router
	.route("/transportingCar/:id")
	.get(async (request, response) => getRecord(TransportingCar, request, response))
	.head(async (request, response) => headRecord(TransportingCar, request, response))
	.put(async (request, response) => putRecord(TransportingCar, request, response))
	.patch(async (request, response) => patchRecord(TransportingCar, request, response))
	.delete(async (request, response) => deleteRecord(TransportingCar, request, response));

router
	.route("/merchandise")
	.get(async (request, response) => getRecords(Merchandise, request, response))
	.post(async (request, response) => postRecord(Merchandise, request, response))
	.delete(async (request, response) => deleteRecords(Merchandise, request, response));

router
	.route("/merchandise/:id")
	.get(async (request, response) => getRecord(Merchandise, request, response))
	.head(async (request, response) => headRecord(Merchandise, request, response))
	.put(async (request, response) => putRecord(Merchandise, request, response))
	.patch(async (request, response) => patchRecord(Merchandise, request, response))
	.delete(async (request, response) => deleteRecord(Merchandise, request, response));

router
	.route("/transport")
	.get(async (request, response) => getRecords(Transport, request, response))
	.post(async (request, response) => postRecord(Transport, request, response))
	.delete(async (request, response) => deleteRecords(Transport, request, response));

router
	.route("/transport/:id")
	.get(async (request, response) => getRecord(Transport, request, response))
	.head(async (request, response) => headRecord(Transport, request, response))
	.put(async (request, response) => putRecord(Transport, request, response))
	.patch(async (request, response) => patchRecord(Transport, request, response))
	.delete(async (request, response) => deleteRecord(Transport, request, response));

export default router;
