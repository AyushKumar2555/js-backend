import mongoose, { mongo, Schema } from "mongoose";
const likeSchema = new mongoose.Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "Video"
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        },
        likedBy: {
            type: Schema.Types.ObjectId,
            ref: "Users"

        },
        tweet: {
            type: Schema.Types.ObjectId,
            ref: "Tweet"
        }
    },
    {timestamps:true}
)
export const Like = mongoose.model("Like", likeSchema)