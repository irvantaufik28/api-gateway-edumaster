import express from "express";

import authController from "../auth/authController";


const router = express.Router();

router.post('/login', authController.login)


export default router;