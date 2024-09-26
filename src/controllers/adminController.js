const Homework = require("../models/homeworkModel.js");
const Course = require("../models/courseModel.js");
const User = require("../models/userModel.js");
const CourseRegister = require("../models/courseRegisterModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fs = require('fs');
const path = require('path');

// Felhasználók lekérése
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Felhasználó szerkesztése
exports.updateUser = async (req, res) => {
  const { userId, id, email, username, fullName, allergies, amalganFilling, bornDate, complaints, courses, description, drugs, goal, mutetek } = req.body;
  console.log(allergies)
  
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Frissítendő mezők beállítása
    if (email) user.email = email;
    if (username) user.username = username;
    if (fullName) user.fullName = fullName;
    if (allergies) user.allergies = allergies;
    if (amalganFilling !== undefined) user.amalganFilling = amalganFilling;
    if (bornDate) user.bornDate = bornDate;
    if (complaints) user.complaints = complaints;
    if (courses) user.courses = courses;
    if (description) user.description = description;
    if (drugs) user.drugs = drugs;
    if (goal) user.goal = goal;
    if (mutetek) user.mutetek = mutetek;

    await user.save();
    res.json({ message: "Update successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid data." });
  }
};

// Felhasználó törlése
exports.deleteUser = async (req, res) => {
  const { id } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    await user.destroy();
    res.json({ message: "Delete successful." });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong." });
  }
};

// Felhasználó létrehozása
exports.createUser = async (req, res) => {
  const { email, username, pwd, fullName } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(pwd, 10);
    const newUser = await User.create({
      email,
      pwd: hashedPassword,
      username,
      fullName,
      rang: "u",
      description: "",
      bornDate: new Date("1900.01.01"),
      allergies: {},
      mutetek: {},
      amalganFilling: false,
      drugs: {},
      complaints: {},
      goal: "",
      courses: {},
    });
    res.status(201).json({ message: "User creation successful." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

// Házifeladatok lekérése
exports.getHomeworks = async (req, res) => {
  try {
    const homeworks = await Homework.findAll();
    res.json(homeworks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Házifeladat létrehozása
exports.createUserHomework = async (req, res) => {
  const {
    cim,
    felhasznaloId,
    leiras,
    hataridoDatum,
    letrehozasDatum,
    megoldas,
    kesz,
  } = req.body;
  try {
    const newHomework = await Homework.create({
      cim,
      felhasznaloId,
      leiras,
      hataridoDatum,
      letrehozasDatum,
      megoldas,
      kesz,
    });
    res.status(201).json({ message: "User homework creation successful." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

// Házifeladat szerkesztése
exports.updateUserHomework = async (req, res) => {
  const {
    id,
    cim,
    felhasznaloId,
    leiras,
    hataridoDatum,
    letrehozasDatuma,
    megoldas,
    kesz,
  } = req.body;
  try {
    const homework = await Homework.findByPk(id);
    if (!homework) {
      return res.status(404).json({ error: "Homework not found." });
    }
    if (cim) homework.cim = cim;
    if (felhasznaloId) homework.felhasznaloId = felhasznaloId;
    if (leiras) homework.leiras = leiras;
    if (hataridoDatum) homework.hataridoDatum = hataridoDatum;
    if (letrehozasDatuma) homework.letrehozasDatuma = letrehozasDatuma;
    if (megoldas) homework.megoldas = megoldas;
    if (kesz !== undefined) homework.kesz = kesz;
    await homework.save();
    res.json({ message: "User homework update successful." });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong." });
  }
};

// Házifeladat törlése
exports.deleteUserHomework = async (req, res) => {
  const { id } = req.body;
  try {
    const homework = await Homework.findByPk(id);
    if (!homework) {
      return res.status(404).json({ error: "Homework not found." });
    }
    await homework.destroy();
    res.json({ message: "User homework delete successful." });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong." });
  }
};

// Kurzusok lekérése
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

// Minikurzus létrehozása
exports.createCourse = async (req, res) => {
  const {
    cim,
    helyszin,
    idopont,
    ar,
    temakor,
    leiras,
    szoveg,
    fajlok,
    felhasznalok,
    megkotesek
  } = req.body;

  const videoUrl = req.file ? req.file.filename : null;
  console.log("videoUrl", videoUrl)

  try {
    const newCourse = await Course.create({
      cim,
      helyszin,
      idopont,
      ar,
      temakor,
      leiras,
      szoveg,
      fajlok,
      felhasznalok,
      megkotesek,
      video: videoUrl
    });
    res.status(201).json({ message: "Course creation successful." });
  } catch (error) {
    console.log("ezittaz", error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

// Minikurzus szerkesztése
exports.updateCourse = async (req, res) => {
  const {
    id,
    cim,
    helyszin,
    idopont,
    ar,
    temakor,
    leiras,
    szoveg,
    fajlok,
    felhasznalok,
    megkotesek,
  } = req.body;

  const videoUrl = req.file ? req.file.filename : null;

  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Update fields if they are provided in the request
    if (cim) course.cim = cim;
    if (helyszin) course.helyszin = helyszin;
    if (idopont) course.idopont = idopont;
    if (ar) course.ar = ar;
    if (temakor) course.temakor = temakor;
    if (leiras) course.leiras = leiras;
    if (szoveg) course.szoveg = szoveg;
    if (fajlok) course.fajlok = fajlok;
    if (felhasznalok) course.felhasznalok = felhasznalok;
    if (megkotesek) course.megkotesek = megkotesek;
    if (videoUrl) course.video = videoUrl;

    await course.save();

    res.json({ message: "Course update successful." });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong." });
  }
};


// Minikurzus törlése 
exports.deleteCourse = async (req, res) => {
  const { id } = req.body;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    if (course.video) {
      const videoPath = path.join(__dirname, '../../uploads/', course.video);

      if (fs.existsSync(videoPath)) {
        fs.unlink(videoPath, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting video file." });
          }
          // Fájl törölve
          console.log("Video file deleted successfully.");
        });
      }
    }

    await course.destroy();
    res.json({ message: "Course delete successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

exports.registerCourses = async (req, res) => {
  const {userId} = req.body
  try {
    const courses = await CourseRegister.findAll();
    res.json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

exports.toggleRegisteredCourse = async (req, res) => {
  const { id } = req.body;
  try {
    const course = await CourseRegister.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const data = course.enabled
    await course.update({ enabled: !data });
    res.json({ message: "Course enabled successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

exports.toggleRegisteredCourseAdminPaid = async (req, res) => {
  const { CourseRegisterId } = req.body;
  try {
    const course = await CourseRegister.findByPk(CourseRegisterId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    const data = course.adminPaid
    await course.update({ adminPaid: !data });
    res.json({ message: "Course adminPaid successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};

exports.deleteRegisteredCourse = async (req, res) => {
  const { id } = req.body;
  try {
    const course = await CourseRegister.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    await course.destroy()
    res.status(200).json({ message: "Course deleted successful." });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Something went wrong." });
  }
};