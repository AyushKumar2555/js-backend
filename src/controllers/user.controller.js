import { json } from "express"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCLoudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullName, email, username, password } = req.body
    console.log("email: ", email);
    //validation - not empty
    // if (fullName === "") {
    //     throw new ApiError(400,"fullname is required")
    // }
    if ([fullName, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    //check if user already exists: username , email
    const existedUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already existed")
    }
    //check for images , check for avatar
    const avartarLocalPath = req.files?.avatar[0]?.path;
    //first property
    const coverImageLoaclPath = req.file?.coverImage[0]?.path;
    if (!avartarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // upload them to cloudinary , avatar

    const avatar = await uploadOnCLoudinary(avartarLocalPath)
    const coverImage = await uploadOnCLoudinary(coverImageLoaclPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
    // create user object - create entry in db
   
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    return res.status(201), json(
        new ApiResponse(200, createdUser,"User registered succesfully")
    )
    // remove password and refersh token field response
   
    // check for user creation 
    // return response


})



export { registerUser }
