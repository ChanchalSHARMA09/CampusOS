import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname : {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["student", "admin", "faculty", "placement"],
        default: "student"
    },
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    googleId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default:""
    },
    isEmailVerified:{
        type: Boolean,
        default: false
    }
},
{
    timestamps:true
});

const User= mongoose.model("User",userSchema);

export default User;