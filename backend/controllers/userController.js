const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt=require('jsonwebtoken')

const user = require("../models/userModel");
const { restart } = require("nodemon");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  // Validation
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if user already exists
  const userExists = await user.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const userData = await user.create({
    name,
    email,
    password: hashedPassword,
  })

  if (userData) {
    res.status(201).json({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      token: generateToken(userData._id),
    })
  } else {
    res.status(400)
    throw new error('Invalid user data')
  }
})
const hashPass = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await await bcrypt.hash(password, salt);
  return hashedPassword;
};

const validateRegistrationFields = (body) => {
  if (!body.name || !body.email || !body.password) {
    return 400;
  } else {
    return 200;
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const userData = await user.findOne({ email });

  if (userData && (await bcrypt.compare(password, userData.password))) {
    res.status(200).json({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      token:generateToken(userData._id)

    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  res.send("Login route");
});

const getMe = asyncHandler(async (req, res) => {
  const user={
    id:req.user._id,
    email:req.user.email,
    name:req.user.name
  }
  res.status(200).json(user)
})

const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET, {
    expiresIn:'30d'
  })
}
module.exports = {
  registerUser,
  loginUser,
  getMe
};
