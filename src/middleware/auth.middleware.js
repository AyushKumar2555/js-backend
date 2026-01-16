import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || 
                     req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        // Use JWT_SECRET if ACCESS_TOKEN_SECRET is not defined
        const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
        if (!secret) {
            throw new ApiError(500, "JWT secret not configured");
        }

        const decodedToken = jwt.verify(token, secret);
        
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        // Fixed: Changed 'User' to 'user' (lowercase)
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});