import User from "../models/userModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) throw new Error("Please fill all fields");

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).send("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  createToken(res, newUser._id);
  res.status(201).json({ _id: newUser._id, username: newUser.username, email: newUser.email });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
  
    createToken(res, user._id);
    return res.status(200).json({ _id: user._id, username: user.username, email: user.email });
  }
  res.status(401).send("Invalid credentials");
});

const logoutCurrentUser = asyncHandler((req, res) => {console.log('clear cookie');

  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});


const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) return res.json({ _id: user._id, username: user.username, email: user.email });
  res.status(404).send("User not found");
});

export { createUser, loginUser, logoutCurrentUser, getCurrentUserProfile };
