import express from "express";
import protect from "../middlewares/authMiddlewares.js";
import { allMessages, sendMessage } from "../controllers/messageControllers.js";

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;
