import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnColudinary } from "../utils/cloudinary.js";

const updateUserAvatar = asyncHandler(async (req, res) => {
  const localAvatarPath = req.file?.path;

  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnColudinary(localAvatarPath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(500, "User update failed");
  }

  if (req.user.avatar) {
    await deleteFromCloudinary(req.user.avatar);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const localCoverImagePath = req.file?.path;

  if (!localCoverImagePath) {
    throw new ApiError(400, "Cover image is required");
  }

  const coverImage = await uploadOnColudinary(localCoverImagePath);

  if (!coverImage) {
    throw new ApiError(500, "Cover image upload failed");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

  if (!user) {
    throw new ApiError(500, "User update failed");
  }

  if (req.user.coverImage) {
    await deleteFromCloudinary(req.user.coverImage);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User cover image updated successfully"));
});

export { updateUserAvatar, updateUserCoverImage };
