/* import { authMiddleware } from './../middlewares/authMiddleware'; */
import { Router } from "express";
import { createBlagodarnost, getBlagodarnost } from "../controllers/blagodarnost.controller";

const router = Router();

router.post("/blagodarnost", createBlagodarnost);
router.get("/blagodarnost", getBlagodarnost);

export default router;
