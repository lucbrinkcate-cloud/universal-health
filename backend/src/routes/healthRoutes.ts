import { Router } from "express";
import { HealthController } from "../controllers/healthController";

const router = Router();

router.post("/sync", HealthController.syncData);

export default router;