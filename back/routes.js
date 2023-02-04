import express from "express";
import { User, Application, Clinic, Address } from "./repository.js";
import {
  getRecords,
  postRecord,
  deleteRecords,
  getRecord,
  headRecord,
  putRecord,
  patchRecordByAddress,
  patchRecord,
  deleteRecord,
  getRecordByAddress,
  getRecordByCNP,
  sendMail,
  deleteRecordByEthAddress,
  getUserByPrivateCode,
} from "./service.js";

const router = express.Router();

router
  .route("/send-mail")
  .post(async (request, response) => sendMail(request, response));

router
  .route("/users")
  .get(async (request, response) => getRecords(User, request, response))
  .post(async (request, response) => postRecord(User, request, response))
  .delete(async (request, response) => deleteRecords(User, request, response));

router
  .route("/users/:address")
  .get(async (request, response) => getRecordByAddress(User, request, response))
  .head(async (request, response) => headRecord(User, request, response))
  .put(async (request, response) => putRecord(User, request, response))
  .patch(async (request, response) =>
    patchRecordByAddress(User, request, response)
  )
  .delete(async (request, response) =>
    deleteRecordByEthAddress(User, request, response)
  );

router
  .route("/users/id/:id")
  .get(async (request, response) => getRecord(User, request, response));

router
  .route("/users/cnp/:cnp")
  .get(async (request, response) => getRecordByCNP(User, request, response));

router
  .route("/users/privateCode/:privateCode")
  .get(async (request, response) =>
    getUserByPrivateCode(User, request, response)
  );

router
  .route("/clinics")
  .get(async (request, response) => getRecords(Clinic, request, response))
  .post(async (request, response) => postRecord(Clinic, request, response))
  .delete(async (request, response) =>
    deleteRecords(Clinic, request, response)
  );

router
  .route("/clinics/:address")
  .get(async (request, response) =>
    getRecordByAddress(Clinic, request, response)
  )
  .head(async (request, response) => headRecord(Clinic, request, response))
  .put(async (request, response) => putRecord(Clinic, request, response))
  .patch(async (request, response) =>
    patchRecordByAddress(Clinic, request, response)
  )
  .delete(async (request, response) => deleteRecord(User, request, response));

router
  .route("/addresses")
  .get(async (request, response) => getRecords(Address, request, response))
  .post(async (request, response) => postRecord(Address, request, response))
  .delete(async (request, response) =>
    deleteRecords(Address, request, response)
  );

router
  .route("/addresses/:id")
  .get(async (request, response) => getRecord(Address, request, response))
  .head(async (request, response) => headRecord(Address, request, response))
  .put(async (request, response) => putRecord(Address, request, response))
  .patch(async (request, response) => patchRecord(Address, request, response))
  .delete(async (request, response) => deleteRecord(User, request, response));

router
  .route("/applications")
  .get(async (request, response) => getRecords(Application, request, response))
  .post(async (request, response) => postRecord(Application, request, response))
  .delete(async (request, response) =>
    deleteRecords(Application, request, response)
  );

router
  .route("/applications/:id")
  .get(async (request, response) => getRecord(Application, request, response))
  .head(async (request, response) => headRecord(Application, request, response))
  .put(async (request, response) => putRecord(Application, request, response))
  .patch(async (request, response) =>
    patchRecord(Application, request, response)
  )
  .delete(async (request, response) =>
    deleteRecord(Application, request, response)
  );

// router
//   .route("/policies")
//   .get(async (request, response) => getRecords(Policy, request, response))
//   .post(async (request, response) => postRecord(Policy, request, response))
//   .delete(async (request, response) =>
//     deleteRecords(Policy, request, response)
//   );

// router
//   .route("/policies/:id")
//   .get(async (request, response) => getRecord(Policy, request, response))
//   .head(async (request, response) => headRecord(Policy, request, response))
//   .put(async (request, response) => putRecord(Policy, request, response))
//   .patch(async (request, response) => patchRecord(Policy, request, response))
//   .delete(async (request, response) => deleteRecord(Policy, request, response));

export default router;
