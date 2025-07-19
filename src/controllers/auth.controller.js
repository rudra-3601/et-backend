import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/brcyptPass.js";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  console.log("Registering user");
  const { fullName, email, password, userProfilePic } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      userProfilePic,
    });

    await newUser.save();
    console.log("User created");

    const token = generateToken(newUser);
    if (!token) {
      return res.status(500).json({
        success: false,
        message: "Error generating token",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        userProfilePic: newUser.userProfilePic,
      },
    });
  } catch (error) {
    console.error("Error in register:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordMatch = await comparePassword(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = generateToken(user);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userProfilePic: user.userProfilePic,
      },
      token,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "User found",
      user: req.user, 
    });
  } catch (error) {
    console.error("Error in getUserInfo:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export { register, login, getUserInfo };
