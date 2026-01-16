import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const totalVideos = await Video.countDocuments({ owner: userId });
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });
    const totalLikes = await Like.countDocuments({ 
        video: { $in: await Video.find({ owner: userId }).select('_id') }
    });
    const totalViews = await Video.aggregate([
        { $match: { owner: userId } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);

    const stats = {
        totalVideos,
        totalSubscribers,
        totalLikes: totalLikes || 0,
        totalViews: totalViews[0]?.totalViews || 0
    };

    return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export {
    getChannelStats,
    getChannelVideos
};