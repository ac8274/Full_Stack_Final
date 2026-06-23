import { Router } from "express";
import authRoutes from "./user.auth.routes.js"
import watchlistRoutes from "./user.watchlist.routes.js"

const router = Router();

router.use("/auth",authRoutes)
//router.use("/watchlist",watchlistRoutes)

export default router