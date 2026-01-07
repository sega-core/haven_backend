import { Router } from "express";
import { createBlagodarnost } from "../controllers/blagodarnost.controller";

const router = Router();

router.post("/", createBlagodarnost);

export default router;
