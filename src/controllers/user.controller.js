import {asyncHandler} from '../utils/asyncHandler.js';
import{Apierror} from '../utils/apiError.js';
//import User from '../models/user.model.js';
import{User} from '../models/user.model.js';
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
        throw new Apierror(409,"user already exit with this username or email")

    }
    console.log("files",req.files);

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const   coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new Apierror(400,"avatar file is required")
  }

  const avatar= await   uploadOnCloudinary(avatarLocalPath);
  const coverImage= await uploadOnCloudinary(coverImageLocalPath);

  if(!avatar){
    throw new Apierror(400,"avatar pload failed tr again later")
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
        "- password -refreshToken"
    )
    if(!createdUser){
        throw new Apierror(500,"something went wrong")
    }
 return  res.status(201).json(
    new ApiResponse(201,createdUser,"user created successfully")
   )

})

const generateAccessTokenAndRefreshToken= async(userid){
  try {
      const user= await User.findById(userid);
      const accessToken= user.generateAccessToken();
      const refreshToken= user.generateRefreshToken();
     user.refreshToken= refreshToken;
     await user.save({
    validateBeforeSave:false
     });

     return { accessToken,refreshToken}



  } catch (error) {
    throw new Apierror(500,"something went wrong while generating access toekn")
    
  }
}

const loginUser= asyncHandler(async(req,res)=>{
    const {email,username,password}= req.body;

    if(!username || !email){
        throw new Apierror(400,"email and username is required")
    }
     const user= await   User.findOne({
            $or:[{email},{username}]
        })

        if(!user){
            throw new Apierror(404,"user not found with this email or username")
        }

    const ispasswordValid= await user.ispasswordCorrect(password)  ;
    if(!ispasswordValid){
        throw new Apierror(401,"invalid password")
    }

   const{accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);
   const LoggedInUser= await User.findById(user._id)
   .select("password -refreshToken")  


   const options={
    httpOnly:true,
    secure: true
   }

   return res.status(200)
   .cookie("refreshToken",refreshToken,options)
   .cookie("accessToken",accessToken,options)
   .json(
    new ApiResponse(200,
        {
            user:LoggedInUser,accessToken,refreshToken

        },

        "user logged in successfully"
   )
) 

})

const LogoutUser= asyncHandler(async(req, res)=>{
   await User.findByIdAndUpdate(req.user._id,
    {
       $set:{
        refreshToken:undefined
       }
    },
    {
        new:true
    })

    const options={
    httpOnly:true,
    secure: true
   }

   return res.status(200)
   .clearCookie("refreshToken",options)
   .clearCookie("accessToken",options)
   .json(
    new ApiResponse(200,null,"user logged out successfully")    
   )
})

export {registerUser,
         loginUser,
            LogoutUser
        }