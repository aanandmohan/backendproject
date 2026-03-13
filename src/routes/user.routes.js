import { Router } from "express";
import {loginUser, LogoutUser,refreshAccessToken,registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verfyJWT } from "../middlewares/auth.middlewares.js";
import { ApiResponse } from "../utils/apiResponse.js";

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

router.route("/refresh-token").post(refreshAccessToken)

//router.get("/register", registerUser)
export default router;