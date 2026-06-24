import { Router } from "express";
import {filterWatchList, listActions} from "../../controllers/user.watchlist.controller.js"

const router = Router();

router.get("/",filterWatchList)
router.use("/:mal_id",listActions)

export default router