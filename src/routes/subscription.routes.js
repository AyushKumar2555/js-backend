import { Router } from "express";
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/:channelId")
    .post(verifyJWT, toggleSubscription)
    .get(getUserChannelSubscribers);

router.route("/subscribed/:subscriberId").get(verifyJWT, getSubscribedChannels);

export default router;