import UserRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";

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

  if(!email || !password){
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email and password are required.");
  };

  const normalizedEmail = email.trim().toLowerCase();

  const user = await UserRepository.findByEmailWithPassword(normalizedEmail);

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid email or password.");
  }

 const loggedInUser = await UserRepository.findById(user._id); 

 return loggedInUser;
};

export { registerUserService, loginUserService };
