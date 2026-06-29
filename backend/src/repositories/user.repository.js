import User from "../models/user.model.js";

class UserRepository {
  static async findByEmail(email) {
    return await User.findOne({ email }).select("-password");
  }

  static async create(userData) {
    return await User.create(userData);
  }

  static async findById(id){
    return await User.findById(id).select("-password");
  }

  static async findByEmailWithPassword(email) {
    return await User.findOne({email}).select("+password");
  }
}

export default UserRepository;
