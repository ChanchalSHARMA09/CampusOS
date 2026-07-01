import UserRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (user) => {

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    await UserRepository.updateRefreshToken(
        user._id,
        refreshToken
    );

    return {
        accessToken,
        refreshToken
    };

};

const registerUserService = async (userData) => {
  const { fullName, email, password } = userData;

  if (!fullName || !email || !password) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "All fields are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await UserRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new ApiError(
      HTTP_STATUS.CONFLICT,
      "User already exists with this email.",
    );
  }

  const newUser = await UserRepository.create({
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
  });

  const createdUser = await UserRepository.findById(newUser._id);

  return createdUser;
};

const loginUserService = async (userData) => {
  const { email, password } = userData;

  if (!email || !password) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Email and password are required.",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await UserRepository.findByEmailWithPassword(normalizedEmail);

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

const { accessToken, refreshToken } =
  await generateAccessAndRefreshTokens(user);

  const loggedInUser = await UserRepository.findById(user._id);

  return {
    user: loggedInUser,
    accessToken,
    refreshToken,
  };
};

const refreshAccessTokenService = async (incomingRefreshToken) => {
  if (!incomingRefreshToken) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Refresh token is required.");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET,
  );

  const user = await UserRepository.findByIdWithRefreshToken(
    decodedToken.userId,
  );

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid Refresh Token.");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Refresh Token Expired or Reused.",
    );
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user);

  return {
    accessToken,
    refreshToken,
  };
};

export { registerUserService, loginUserService, refreshAccessTokenService };
