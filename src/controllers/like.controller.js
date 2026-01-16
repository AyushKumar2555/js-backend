import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Video unliked"));
    } else {
        const like = await Like.create({
            video: videoId,
            likedBy: userId
        });
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Video liked"));
    }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Comment unliked"));
    } else {
        const like = await Like.create({
            comment: commentId,
            likedBy: userId
        });
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Comment liked"));
    }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const userId = req.user._id;

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Tweet unliked"));
    } else {
        const like = await Like.create({
            tweet: tweetId,
            likedBy: userId
        });
        return res.status(200).json(new ApiResponse(200, { liked: true }, "Tweet liked"));
    }
});

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const likes = await Like.find({ likedBy: userId, video: { $exists: true } })
        .populate("video")
        .sort({ createdAt: -1 });

    const likedVideos = likes.map(like => like.video).filter(video => video !== null);

    return res.status(200).json(new ApiResponse(200, likedVideos, "Liked videos fetched"));
});

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
};