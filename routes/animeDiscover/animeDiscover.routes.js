import { Router } from "express";
import { getAnimeList, getAnimeListById } from "../../controllers/animeDiscover.controller.js";

const router = Router();

router.get("/",getAnimeList)
router.get("/:id",getAnimeListById)

export default router