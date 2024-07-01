const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

exports.register = async (req, res) => {
  const { email, pwd, username, fullName, rang, description, bornDate, allergies, mutetek, amalganFilling, drugs, complaints, goal, courses } = req.body;

  if (!email || !pwd || !username || !fullName) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);

    const newUser = await User.create({
      email,
      pwd: hashedPassword,
      username,
      fullName,
      rang,
      description,
      bornDate,
      allergies,
      mutetek,
      amalganFilling,
      drugs,
      complaints,
      goal,
      courses
    });

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error.' });
  }
};

exports.login = async (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd) {
    return res.status(400).json({ error: 'Invalid input data.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    return res.status(200).json({
      token,
      message: 'Login successful.'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Server error.' });
  }
};
