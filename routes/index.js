import { Router } from "express";
import userRoutes from "./user/index.js"

const router = Router();

router.use("/user",userRoutes)

export default router