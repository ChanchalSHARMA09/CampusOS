import asyncHandler from "../utils/asyncHandler.js";
import {
  registerUserService,
  loginUserService,
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
  const result = await loginUserService(req.body);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new ApiResponse(HTTP_STATUS.OK, result, "User logged in successfully"),
    );
});

export { registerUser, loginUser };
