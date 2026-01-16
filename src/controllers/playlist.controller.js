import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;
    const userId = req.user._id;

    if (!name) {
        throw new ApiError(400, "Playlist name is required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: userId
    });

    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const playlists = await Playlist.find({ owner: userId }).sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId)
        .populate("videos")
        .populate("owner", "username avatar");

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only modify your own playlists");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist");
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only modify your own playlists");
    }

    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video not in playlist");
    }

    playlist.videos = playlist.videos.filter(id => id.toString() !== videoId);
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only update your own playlists");
    }

    if (name) playlist.name = name;
    if (description) playlist.description = description;
    
    await playlist.save();

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const userId = req.user._id;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You can only delete your own playlists");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
};