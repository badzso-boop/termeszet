const Homework = require("../models/homeworkModel.js");
const Course = require("../models/courseModel.js");
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
  const { id, email, password, name } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (email) user.email = email;
    if (password) user.pwd = await bcrypt.hash(password, 10);
    if (name) user.fullName = name;
    await user.save();
    res.json({ message: "Update successful." });
  } catch (error) {
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

// Minikurzus létrehozása
exports.createCourse = async (req, res) => {
  const {
    cim,
    helyszin,
    idopont,
    ar,
    temakor,
    leiras,
    fajlok,
    felhasznalok,
    megkotesek
  } = req.body;
  try {
    const newCourse = await Course.create({
      cim,
      helyszin,
      idopont,
      ar,
      temakor,
      leiras,
      fajlok,
      felhasznalok,
      megkotesek,
    });
    res.status(201).json({ message: "Course creation successful." });
  } catch (error) {
    console.log(error);
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
    fajlok,
    felhasznalok,
    megkotesek,
  } = req.body;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }
    if (cim) course.cim = cim;
    if (helyszin) course.helyszin = helyszin;
    if (idopont) course.leiras = leiras;
    if (ar) course.ar = ar;
    if (temakor) course.temakor = temakor;
    if (leiras) course.leiras = leiras;
    if (fajlok) course.fajlok = fajlok;
    if (felhasznalok) course.felhasznalok = felhasznalok;
    if (megkotesek) course.megkotesek = megkotesek;
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
    await course.destroy();
    res.json({ message: "Course delete successful." });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong." });
  }
};
