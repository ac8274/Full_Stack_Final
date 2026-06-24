import { Router } from "express";
import authRoutes from "./user.auth.routes.js"
import watchlistRoutes from "./user.watchlist.routes.js"
import {isTokenValid} from "../../utils/reqValidation.js"


const router = Router();

router.use("/auth",authRoutes)
router.use("/watchlist",isTokenValid,watchlistRoutes)

export default router