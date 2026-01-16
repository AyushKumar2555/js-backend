import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const healthcheck = asyncHandler(async (req, res) => {
    return res.status(200).json(
        new ApiResponse(200, 
            { 
                status: "OK", 
                timestamp: new Date().toISOString(),
                service: "VideoTube API"
            }, 
            "Health check passed"
        )
    );
});

export { healthcheck };