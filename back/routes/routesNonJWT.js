import express from "express";
import { User } from "../repository.js";
import { authUser, registerUser, handleRefreshToken, handleLogout } from "../service.js";

const router = express.Router();

router.route("/auth").post(async (request, response) => authUser(User, request, response));
router.route("/register").post(async (request, response) => registerUser(User, request, response));
router.route("/refresh").get(async (request, response) => handleRefreshToken(User, request, response));
router.route("/logout").get(async (request, response) => handleLogout(User, request, response));

export default router;
