const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

module.exports = {
  async create(req, res) {
    const { username, password: unhashedPassword } = req.body;

    const password = await bcrypt.hash(unhashedPassword, 10);

    try {
      if (!username || typeof username !== "string") {
        return res.status(400).json({ error: "Invalid user!" });
      }

      if (!unhashedPassword || typeof unhashedPassword !== "string") {
        return res.status(400).json({ error: "Invalid password!" });
      }

      if (unhashedPassword.length < 5) {
        return res.status(400).json({
          error: "Too small password. It must have at least 6 characters!",
        });
      }

      await User.create({
        username,
        password,
      });

      res.status(200).json({ message: "User created successfully!" });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({ error: "User already exists!" });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "Usuário ou senha inválidos." });
    }

    if (await bcrypt.compare(password, user.dataValues.password)) {
      const token = jwt.sign(
        {
          id: user.dataValues.id,
          username: user.dataValues.username,
        },
        process.env.JWT_SECRET
      );

      res.cookie("jwt", token, {
        sameSite: "strict",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      return res.status(200).json({ message: "Logged in!" });
    }

    return res
      .status(400)
      .clearCookie("jwt")
      .json({ error: "Invalid username or password." });
  },

  async logout(req, res) {
    const token = req.cookies.jwt;
    if (token) {
      return res
        .status(200)
        .clearCookie("jwt")
        .json({ message: "Logged out!" });
    }
    return res.status(500).json({ error: "Unknown error." });
  },

  async validateLogin(req, res) {
    res.status(200).send(true);
  },
};
