import asyncHandler from "../utils/asyncHandler.js";
import {
  registerUserService,
  loginUserService,
  refreshAccessTokenService,
} from "../services/auth.service.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);

  return res
    .status(HTTP_STATUS.CREATED)
    .json(
      new ApiResponse(
        HTTP_STATUS.CREATED,
        user,
        "User registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await loginUserService(req.body);

  const cookieOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(HTTP_STATUS.OK)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        { user, accessToken },
        "User logged in successfully",
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const result = await refreshAccessTokenService(req.cookies.refreshToken);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(
        HTTP_STATUS.OK,
        result,
        "Access Token Refreshed Successfully.",
      ),
    );
});

export { registerUser, loginUser, refreshAccessToken };
