import express from "express";

import authController from "../auth/authController";
import { upload } from "../middleware/handle-upload";
import uploadController from "../upload/uploadController";


const router = express.Router();

router.post('/login', authController.login)
router.post('/upload', upload.single('file'), uploadController.upload)


export default router;