import { Router } from "express"
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| AUTH & USER CREATION ROUTES
|--------------------------------------------------------------------------
*/

/*
  Register a new user.

  - Accepts multipart/form-data
  - Avatar is mandatory
  - Cover image is optional
  - Creates a new user entry in the database
*/
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
);

/*
  Login user.

  - Accepts email/username + password
  - Generates access token and refresh token
  - Sets tokens in httpOnly cookies
*/
router.route("/login").post(loginUser);

/*
|--------------------------------------------------------------------------
| AUTHENTICATION & SESSION ROUTES
|--------------------------------------------------------------------------
*/

/*
  Logout user.

  - Protected route
  - Requires valid access token
  - Clears access token and refresh token cookies
  - Removes refresh token from database
*/
router.route("/logout").post(verifyJWT, logoutUser);

/*
  Refresh access token.

  - Used when access token expires
  - Accepts refresh token from cookie or request body
  - Generates a new access token without forcing login
*/
router.route("/refresh-token").post(refreshAccessToken);

/*
|--------------------------------------------------------------------------
| ACCOUNT & SECURITY ROUTES
|--------------------------------------------------------------------------
*/

/*
  Change current user's password.

  - Protected route
  - Requires old password and new password
  - Updates password securely in database
*/
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

/*
  Get currently logged-in user details.

  - Protected route
  - Returns user info attached by auth middleware
*/
router.route("/current-user").get(verifyJWT, getCurrentUser);

/*
  Update basic account details.

  - Protected route
  - Allows updating full name and email
*/
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

/*
|--------------------------------------------------------------------------
| PROFILE MEDIA ROUTES
|--------------------------------------------------------------------------
*/

/*
  Update user avatar.

  - Protected route
  - Accepts single image file
  - Replaces existing avatar
*/
router.route("/avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
);

/*
  Update user cover image.

  - Protected route
  - Accepts single image file
  - Updates cover image for user profile
*/
router.route("/cover-image").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
);

/*
|--------------------------------------------------------------------------
| CHANNEL & ACTIVITY ROUTES
|--------------------------------------------------------------------------
*/

/*
  Get public channel profile by username.

  - Protected route
  - Returns channel information
  - Includes subscriber count and subscription status
*/
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

/*
  Get watch history of logged-in user.

  - Protected route
  - Returns list of watched videos
*/
router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
