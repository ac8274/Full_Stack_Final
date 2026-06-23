import { Router } from "express";
import {signUpUser, signInUser} from "../../controllers/user.auth.controller.js"

const router = Router();

router.get("/signin",signInUser)
router.post("/signup",signUpUser)


export default router