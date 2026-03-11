import { Router } from "express";
import {loginUser, LogoutUser,registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {name:"avatar",
         maxCount:1
        },

        {name:"coverImage",
         maxCount:1
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser);
router.route("/logout").post(verfyJWT,LogoutUser);

//router.get("/register", registerUser)
export default router;