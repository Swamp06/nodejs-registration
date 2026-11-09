import UserController from "../controllers/UserController.js";
import { Router } from "express";

const router = new Router()

router.post("/registration" , UserController.registration)

export default router