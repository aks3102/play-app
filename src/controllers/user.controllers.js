import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnColudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res, next) => {
  // get user details from frontend
  // validation - not empty, valid email, password length
  // check if user already exists : username and email
  // check for imges, check for avatar
  // upload them to clodinarym, avatar
  // create user object - create entry in db
  // remove passsword and refresh token field from response
  // check user creation
  // return response

  const { fullName, username, email, password } = req.body;

  if (
    [email, username, fullName, password].some(
      (field) => field === undefined || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password should be at least 6 characters");
  }

  // if (await User.exists({ $or: [{ email }, { username }] })) {
  //   throw new ApiError(400, "Email or username already exists");
  // }

  const existedUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existedUser) {
    throw new ApiError(409, "Email or username already exists");
  }

  const localAvatarPath = req.files?.avatar?.[0]?.path;
  // const localCoverImagePath = req.files?.coverImage?.[0]?.path;

  let localCoverImagePath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    localCoverImagePath = req.files?.coverImage?.[0]?.path;
  }

  if (!localAvatarPath) {
    throw new ApiError(400, "Avatar is required");
  }

  const avatar = await uploadOnColudinary(localAvatarPath);
  const coverImage = await uploadOnColudinary(localCoverImagePath);

  if (!avatar) {
    throw new ApiError(500, "Avatar upload failed");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    username: username.toLowerCase(),
  });

  const createdUser = await User.findOne({
    _id: user._id,
  }).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User creation failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export { registerUser };
