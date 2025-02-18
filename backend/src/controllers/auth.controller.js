import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { genrateJwtToken } from "../lib/utils.js";

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
      genrateJwtToken(newUser._id, res);
      await newUser.save();

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
export const login = (req, res) => {
  res.send("login");
};
export const logout = (req, res) => {
  res.send("logout");
};
