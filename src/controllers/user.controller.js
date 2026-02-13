import {asyncHandler} from '../utils/asyncHandler.js';
import{Apierror} from '../utils/apiError.js';
import User from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import{ApiResponse} from '../utils/apiResponse.js';

const registerUser = asyncHandler(async ( req,res)=>{

    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

   const {username,email,fullname,password}= req.body
    console.log("email",email,"fullname",fullname )

   if(
    [username,email,fullname,password].some((field)=>field?.trim() ==="")
   ){
    throw  new Apierror(400,"all field is required")
   }
   
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existedUser){
        throw new Apierror(401,"user already exit with this username or email")

    }

   const avatarLocalPath = req.files?.avatar[0]?.path;
  const   coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(avatarLocalPath){
    throw new Apierror(400,"avatar file is required")
  }

  const avatar= await   uploadOnCloudinary(avatarLocalPath);
  const coverImage= await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new Apierror(500,"avatar pload failed tr again later")
  }
    const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
       username: username.toLowerCase(),
     })

    const  createdUser= await User.findById(user._id).select(
        " - password -refreshToken"
    )
    if(!createdUser){
        throw new Apierror(500,"something went wrong")
    }
   res.status(201).json(
    new ApiResponse(201,"user created successfully",createdUser)
   )

})

export {registerUser}