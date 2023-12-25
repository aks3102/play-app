import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Invalid access token");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    await User.findById(decodedToken._id)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((error) => {
        console.log(error);
        throw new ApiError(401, "Unauthorized request");
      });

    //Alternate options for the above code
    // const user = await User.findById(decodedToken._id);

    // if (!user) {
    //   throw new ApiError(401, "Unauthorized request");
    // }
    // req.user = user;
    // next();
  } catch (error) {
    throw new ApiError(401, "Unauthorized request");
  }
});
