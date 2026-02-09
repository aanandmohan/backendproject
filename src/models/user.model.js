import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema= new mongoose.Schema(
    {

     Username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        index:true
     },
     email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
     },
     fullname:{
        type:String,
        required:true,
        trim:true,
        immdex:true
     },
     avatar:{
        type:String,
        required:true,

     },
     coverImage:{
        type:String,
     },
     watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
     ],
     password:{
        type:String,
        required:[true,"password is required"]
     },
     refreshToken:{
        type:String,
     }


},
{timestamps:true}
)

UserSchema.pre("save",async function(){
    if(!this.isModified("password")) return next();
    this.password=  awaitbcrypt.hash(this.password,10)
    next();

})

UserSchema.methods.ispasswordCorrect= async function(password){

   return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
        _id:this._id,
        email:this.email,
        Username:this.Username,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

UserSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
        _id:this._id,
        },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

const User= mongoose.model("User",UserSchema)