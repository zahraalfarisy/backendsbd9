const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse.util");
const bcrypt = require("bcryptjs");


const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;


exports.registerUser = async (req, res) => {
  const { email, password, name } = req.body;

  
  if (!regexEmail.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format", null);
  }

  
  if (!regexPassword.test(password)) {
    return baseResponse(res, false, 400, "Password must be at least 8 characters long and contain at least 1 letter, 1 number, and 1 special character", null);
  }

  try {
   
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 409, "Email already used", null);
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userRepository.createUser({ email, password: hashedPassword, name });
    return baseResponse(res, true, 201, "User created", newUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error creating user", error);
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and password are required", null);
  }

  try {
    const user = await userRepository.getUserByEmail(email);

    if (!user) {
      return baseResponse(res, false, 400, "Invalid email or password", null);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return baseResponse(res, false, 400, "Invalid email or password", null);
    }

    return baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error logging in", error);
  }
};


exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    return baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving user", error);
  }
};


exports.updateUser = async (req, res) => {
  const { id, email, password, name } = req.body;
  if (!id || !email || !password || !name) {
    return baseResponse(res, false, 400, "ID, email, password, and name are required", null);
  }

  try {
    const updatedUser = await userRepository.updateUser(id, email, password, name);
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    return baseResponse(res, true, 200, "User updated", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating user", error);
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userRepository.deleteUser(id);
    if (!deletedUser) {
      return baseResponse(res, false, 404, "User not found", null);
    }
    return baseResponse(res, true, 200, "User deleted", deletedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting user", error);
  }
};

exports.topUpUserBalance = async (req, res) => {
  const { id, amount } = req.query;

  // Validate amount
  if (parseFloat(amount) <= 0) {
    return baseResponse(res, false, 400, "Amount must be larger than 0", null);
  }

  try {
    const user = await userRepository.getUserById(id);
    if (!user) {
      return baseResponse(res, false, 404, "User not found", null);
    }

    // Update user balance
    const updatedBalance = user.balance + parseFloat(amount);
    const updatedUser = await userRepository.updateUserBalance(id, updatedBalance);

    return baseResponse(res, true, 200, "Top up successful", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating balance", error);
  }
};