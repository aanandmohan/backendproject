import { asyncHandler } from "../utils/asyncHandler";
import { Apierror } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken"


export const verfyJWT= asyncHandler(async(req,res,next)=>{

    try {
         const token=req.cookies?.accessToken|| req.headers("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new Apierror(401,"you are not authorized to access this resource")
        }
        
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
       const user= await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if(!user){
            //tdo :discuss about frontend
            throw new Apierror(404,"user not found")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new Apierror(401,"Invalid access token")
    }
})