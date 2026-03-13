import mongoose  from "mongoose";

const SubscriberSchema= new mongoose.Schema({
    userId:{

        type:mongoose.Schema.Types.ObjectId,
    ref:"User"    },

    channelId:{
        type:mongoose.Schema.Types.ObjectId,
    ref:"User"    }



},{timeStamps:true})

export const Subscriber= mongoose.model("Subscriber",SubscriberSchema);