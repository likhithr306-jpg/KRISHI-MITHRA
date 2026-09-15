const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Register
exports.register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      state,
      district,
      taluk,
      village,
      soilType,
      landSize,
      lat,
      lon
    } = req.body;

    const checkQuery = [{ phone }];
    if (email && email.trim() !== "") {
      checkQuery.push({ email: email.trim().toLowerCase() });
    }

    const existingUser = await User.findOne({ $or: checkQuery });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Phone number or email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      phone: phone.trim(),
      password: hashedPassword,
      state: state || "Karnataka",
      district,
      taluk,
      village,
      soilType,
      landSize,
      lat,
      lon,
      activeCrop: "",
      currentStage: "Setup",
      completedTasks: {},
    };

    if (email && email.trim() !== "") {
      userData.email = email.trim().toLowerCase();
    }

    const user = await User.create(userData);
    console.log(`✅ New user registered: ${name} (${phone}) at ${lat},${lon}`);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user,
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const cleanIdentifier = identifier ? identifier.trim() : "";

    console.log(`[AUTH] Login attempt for: ${cleanIdentifier}`);

    const user = await User.findOne({
      $or: [
        { phone: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: user._id },
      "krishi_secret_key",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Send OTP via Console (Simulated SMS/Email)
exports.sendOTP = async (req, res) => {
  try {
    const { identifier } = req.body;
    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { phone: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 600000; // 10 mins
    await user.save();

    console.log(`\n******************************************`);
    console.log(`[AUTH] OTP for ${cleanIdentifier}: ${otp}`);
    console.log(`******************************************\n`);

    res.json({
      success: true,
      message: "OTP generated successfully. Please check the backend console.",
      debugOtp: otp
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify OTP only (for multi-step reset)
exports.verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { phone: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() }
      ],
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    res.json({ success: true, message: "OTP verified. You can now set a new password." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify OTP & Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    const cleanIdentifier = identifier.trim();

    const user = await User.findOne({
      $or: [
        { phone: cleanIdentifier },
        { email: cleanIdentifier.toLowerCase() }
      ],
      otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successful. Please login.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
