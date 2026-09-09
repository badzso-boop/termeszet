const request = require('supertest');
const fs = require('fs');
const path = require('path');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const CourseRegister = require('../src/models/courseRegisterModel');
const { createAdmin, createUser, createCourse, createCourseRegister, generateToken } = require('./helpers/factories');

const app = buildTestApp();

describe('GET /api/video/:filename (src/controllers/userController.js getVideo)', () => {
  let admin;
  let adminToken;
  let allowedUser;
  let allowedToken;
  let strangerUser;
  let strangerToken;
  let course;
  const filename = `testvideo_${Date.now()}.mp4`;
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const filePath = path.join(uploadsDir, filename);

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    adminToken = generateToken(admin);
    ({ user: allowedUser } = await createUser());
    allowedToken = generateToken(allowedUser);
    ({ user: strangerUser } = await createUser());
    strangerToken = generateToken(strangerUser);

    course = await createCourse();
    await course.update({ video: filename });

    await createCourseRegister({
      userId: allowedUser.id,
      courseId: course.id,
      enabled: true,
      paid: true,
      adminPaid: true,
    });

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    fs.writeFileSync(filePath, 'fake mp4 content for tests');
  });

  afterAll(async () => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await CourseRegister.destroy({ where: { userId: [allowedUser.id, strangerUser.id] } });
    await Course.destroy({ where: { id: course.id } });
    await User.destroy({ where: { id: [admin.id, allowedUser.id, strangerUser.id] } });
  });

  test('token nélkül 401-et ad', async () => {
    const res = await request(app).get(`/api/video/${filename}`);
    expect(res.status).toBe(401);
  });

  test('olyan usernek, aki nincs regisztrálva/kifizetve a kurzusra, 403-at ad', async () => {
    const res = await request(app)
      .get(`/api/video/${filename}`)
      .set('Authorization', `Bearer ${strangerToken}`);
    expect(res.status).toBe(403);
  });

  test('regisztrált, kifizetett és engedélyezett usernek 200-at ad', async () => {
    const res = await request(app)
      .get(`/api/video/${filename}`)
      .set('Authorization', `Bearer ${allowedToken}`);
    expect(res.status).toBe(200);
  });

  test('adminnak mindig 200-at ad, hozzáférés-ellenőrzés nélkül', async () => {
    const res = await request(app)
      .get(`/api/video/${filename}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
  });

  test('query paraméterben átadott tokent is elfogadja (a <video> tag nem tud headert küldeni)', async () => {
    const res = await request(app).get(`/api/video/${filename}?token=${allowedToken}`);
    expect(res.status).toBe(200);
  });

  test('path traversal kísérlet esetén nem lép ki az uploads/ könyvtárból (path.basename véd)', async () => {
    const res = await request(app)
      .get('/api/video/..%2f..%2fpackage.json')
      .set('Authorization', `Bearer ${adminToken}`);
    // A path.basename miatt a "..%2f..%2fpackage.json" a "package.json" fájlnévvé
    // egyszerűsödik, ami nem létezik az uploads/ alatt -- tehát 404-et kell kapnunk, nem a
    // repó gyökerében lévő valódi package.json tartalmát.
    expect(res.status).toBe(404);
  });
});
