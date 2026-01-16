import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user._id;

    if (channelId === subscriberId.toString()) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: subscriberId
    });

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed successfully"));
    } else {
        const subscription = await Subscription.create({
            channel: channelId,
            subscriber: subscriberId
        });
        return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed successfully"));
    }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    const subscribers = await Subscription.find({ channel: channelId })
        .populate("subscriber", "username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    const subscriptions = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username avatar")
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, subscriptions, "Subscribed channels fetched successfully"));
});

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
};