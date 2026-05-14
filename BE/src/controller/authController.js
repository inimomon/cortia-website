const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { nik, nama_panjang, tgl_lahir, no_hp, email, password } = req.body;

    const checkEmail = await User.findOne({
      where: { email },
    });

    if (checkEmail) {
      return res.status(400).json({
        message: "Email already used",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      nik,
      nama_panjang,
      tgl_lahir,
      no_hp,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Register success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        username: user.nama_panjang,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      message: "Login success",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
