import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { genrateJwtToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    // check if email already exists.
    const user = await User.findOne({ email, delete_type: 0 });
    if (user) return res.status(400).json({ message: "Email already exists." });

    // generate salt and hash the password before saving it to database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    // generate the auth token if new user is created
    if (newUser) {
      await newUser.save();
      genrateJwtToken(newUser._id, res);

      res.status(201).json({
        userId: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    console.log("Error in signup controller.", error.message);
    // Handle Mongoose validation errors (required fields, password format, etc.)
    if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).reduce((acc, field) => {
        acc[field] = error.errors[field].message;
        return acc;
      }, {});
      return res.status(400).json({ errors });
    }

    res.status(500).json({ message: "Internal Server Error." });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user.name);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    genrateJwtToken(user._id, res);

    res.status(200).json({
      userId: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller.", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out succesfully." });
  } catch (error) {
    console.log("Error in logout controller.", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(404).json({ message: "No image found." });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.log("Error in updateProfile controller.", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller.", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
