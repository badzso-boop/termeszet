const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { send } = require('../helpers/emailSender.js');
const User = require("../models/userModel.js");
const Course = require("../models/courseModel.js");
const CourseRegister = require("../models/courseRegisterModel.js");
require('dotenv').config();

const path = require("path");

exports.register = async (req, res) => {
  const { email, pwd, username, fullName } = req.body;
  console.log(req.body);

  if (!email || !pwd || !username || !fullName) {
    return res.status(400).json({ error: "Invalid input data." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(pwd, 10);

    const rang = "u";
    const description = "-";
    const bornDate = "-";
    const allergies = {};
    const mutetek = {};
    const amalganFilling = false;
    const drugs = {};
    const complaints = {};
    const goal = "";
    const courses = {};

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
      courses,
    });

    // Send a congratulatory email after successful registration
    try {
      await send(
        email,
        'Gratulálunk a sikeres regisztrációhoz!',
        fullName,
        'Köszönjük, hogy regisztráltál a platformunkra. Örülünk, hogy csatlakoztál hozzánk!'
      );
      console.log('Registration email sent.');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
    }

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error." });
  }
};


exports.login = async (req, res) => {
  const { email, pwd } = req.body;

  if (!email || !pwd) {
    return res.status(400).json({ error: "Invalid input data." });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(pwd, user.pwd);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const rang = user.rang;
    const userId = user.id;

    return res.status(200).json({
      userId,
      rang,
      token,
      message: "Login successful.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.registerCourse = async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // Ellenőrizzük, hogy létezik-e már ilyen userId és courseId kombináció
    const existingRegister = await CourseRegister.findOne({
      where: { userId, courseId },
    });

    if (!existingRegister) {
      const newCourseRegister = await CourseRegister.create({
        userId,
        courseId,
        enabled: false,
      });

      const user = await User.findOne({ where: { id: userId } });
      const course = await Course.findOne({ where: { id: courseId } });

      if (user && course) {
        try {
          await send(
            "norbi.rumli007@gmail.com",
            `Egy felhasználó regisztrált a(z) ${course.title} nevű kurzusra!`,
            'Németh Gabriella',
            `${user.fullName} regisztrált a(z) ${course.title} nevű kurzusra! Kérlek lépj be és engedélyezd!`
          );
          console.log('Registration email sent.');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      } else {
        console.error('User or Course not found.');
        return res.status(404).json({ error: "User or Course not found." });
      }
  
      return res.status(200).json({ message: "Course registered successfully." }); 
    } else {
      return res.status(201).json({ message: "User has already registered for this course." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error." });
  }
};


exports.oneUser = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Invalid input data." });
  }

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error." });
  }
};

exports.getOneCourse = async (req, res) => {
  const { id } = req.body;

  try {
    const course = await Course.findOne({ where: { id: id } });
    if (course) {
      res.json(course);
    }

    res.status(404).json({ error: "Not found this course!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.toggleRegisteredCoursePaid = async (req, res) => {
  const { CourseRegisterId } = req.body;

  try {
    const courseRegister = await CourseRegister.findOne({
      where: {
        id: CourseRegisterId,
      },
    });

    if (!courseRegister) {
      console.log("valami nem jo :)")
      return res.status(404).json({ error: "Course registration not found." });
    }

    if (!courseRegister.paid) {
      const user = await User.findOne({ where: { id: courseRegister.userId } });
      const course = await Course.findOne({ where: { id: courseRegister.courseId } });
  
      if (user && course) {
        try {
          await send(
            process.env.EMAIL_USER,
            `Befizetés - ${course.cim}`,
            'Németh Gabriella',
            `${user.fullName} befizetett ${course.ar} Ft-ot a(z) ${course.cim} nevű kurzusra! <br> Kérlek lépj be és igazold vissza a befizetést!`
          );
          console.log('Registration email sent.');
        } catch (emailError) {
          console.error('Error sending email:', emailError);
        }
      } else {
        console.error('User or Course not found.');
        return res.status(404).json({ error: "User or Course not found." });
      }
  
      await courseRegister.update({ paid: true });
  
      res.status(200).json({ message: "Course payment status updated successfully." });
    }
    else {
      res.status(201).json({ message: "Már fizettél" });
    }

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.getRegisteredCourses = async (req, res) => {
  try {
    const registeredCourses = await CourseRegister.findAll();
    res.json(registeredCourses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.getVideo = async (req, res) => {
  console.log(req.params.filename);
  const filePath = path.join(__dirname, "../../uploads", req.params.filename);
  res.sendFile(filePath);
};