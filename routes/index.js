import { Router } from "express";
import userRoutes from "./user/index.js"
import animeApiRoute from  "./animeDiscover/animeDiscover.routes.js"

const router = Router();

router.use("/user",userRoutes)
router.use("/animeDiscover",animeApiRoute)

export default router