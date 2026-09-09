// Segédfüggvények teszt-adatok létrehozásához. Minden email/username egyedi
// (timestamp + véletlen suffix), hogy a tesztek egymás mellett/után se ütközzenek a
// unique constraint-ekkel (User.email, User.username, NewsletterSubscriber.email), és hogy
// ne kelljen a teszt-DB-t minden futtatás előtt kézzel ürítenünk.

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../src/models/userModel');
const Course = require('../../src/models/courseModel');
const CourseRegister = require('../../src/models/courseRegisterModel');
const Lesson = require('../../src/models/lessonModel');

// Valódi JWT előállítása egy usernek, ugyanazzal a payload-formával (`{ userId }`), mint
// amit a login endpoint (src/controllers/userController.js) kiad -- így a
// verifyToken/verifyAdmin middleware-ek a tesztekben is a valós auth-utat futtatják végig,
// nem a body.userId-t.
function generateToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function uniqueSuffix() {
  return `${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function uniqueEmail(prefix = 'test') {
  return `${prefix}_${uniqueSuffix()}@example.com`;
}

function uniqueUsername(prefix = 'user') {
  return `${prefix}_${uniqueSuffix()}`;
}

// Sima ('u' rangú) user létrehozása közvetlenül a modellen keresztül (nem a HTTP API-n át),
// hogy a register/login teszteken kívüli suite-ok ne függjenek a register endpoint
// viselkedésétől.
async function createUser(overrides = {}) {
  const plainPassword = overrides.plainPassword || 'Password123!';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await User.create({
    email: overrides.email || uniqueEmail('user'),
    username: overrides.username || uniqueUsername('user'),
    fullName: overrides.fullName || 'Teszt Elek',
    pwd: hashedPassword,
    rang: overrides.rang || 'u',
    description: '-',
    bornDate: null,
    allergies: {},
    mutetek: {},
    amalganFilling: false,
    drugs: {},
    complaints: {},
    goal: '',
    courses: {},
  });

  return { user, plainPassword };
}

async function createAdmin(overrides = {}) {
  return createUser({ ...overrides, rang: 'a' });
}

async function createCourse(overrides = {}) {
  return Course.create({
    cim: overrides.cim || `Teszt kurzus ${uniqueSuffix()}`,
    helyszin: overrides.helyszin || 'Online',
    idopont: overrides.idopont || new Date('2026-12-01T10:00:00Z'),
    ar: overrides.ar !== undefined ? overrides.ar : 10000,
    temakor: overrides.temakor || 'egyeb',
    leiras: overrides.leiras || 'Leírás',
    szoveg: overrides.szoveg || 'Szöveg',
  });
}

async function createCourseRegister(overrides = {}) {
  return CourseRegister.create({
    userId: overrides.userId,
    courseId: overrides.courseId,
    enabled: overrides.enabled !== undefined ? overrides.enabled : false,
    paid: overrides.paid !== undefined ? overrides.paid : false,
    adminPaid: overrides.adminPaid !== undefined ? overrides.adminPaid : false,
  });
}

async function createLesson(overrides = {}) {
  return Lesson.create({
    courseId: overrides.courseId,
    cim: overrides.cim || `Teszt lecke ${uniqueSuffix()}`,
    sorrend: overrides.sorrend !== undefined ? overrides.sorrend : 0,
    szoveg: overrides.szoveg || 'Lecke szöveg',
  });
}

module.exports = {
  uniqueEmail,
  uniqueUsername,
  createUser,
  createAdmin,
  createCourse,
  createCourseRegister,
  createLesson,
  generateToken,
};
