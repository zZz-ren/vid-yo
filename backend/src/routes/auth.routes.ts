import { Router } from "express";
import authControllers from "../controllers/auth.controllers";
import { checkAuth } from "../middlewares/auth.middleware";

const router = Router();

router.get("/");
router.get("/status", checkAuth, authControllers.checkStatus);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/register", authControllers.register);
router.post("/enable2Fa", authControllers.enable2Fa);
router.post("/verify", authControllers.verify2Fa);
router.post("/validate", authControllers.validate2Fa);
router.post("/reset2Fa", authControllers.reset2Fa);

export default router;
