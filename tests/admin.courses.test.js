const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const Course = require('../src/models/courseModel');
const { createAdmin, createCourse, generateToken } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - kurzus CRUD (src/routes/adminRoutes.js + adminController.js)', () => {
  let admin;
  let adminToken;
  const createdCourseIds = [];

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    adminToken = generateToken(admin);
  });

  afterAll(async () => {
    if (createdCourseIds.length) {
      await Course.destroy({ where: { id: createdCourseIds } });
    }
    await User.destroy({ where: { id: admin.id } });
  });

  test('createCourse: érvényes admin JWT nélkül 401-et ad, még helyes body mellett is', async () => {
    const res = await request(app)
      .post('/api/admin/createCourse')
      .field('cim', 'Új Kurzus Token Nélkül')
      .field('helyszin', 'Online')
      .field('idopont', '2026-12-01T10:00:00Z')
      .field('ar', '15000')
      .field('temakor', 'egyeb')
      .field('leiras', 'Leírás')
      .field('szoveg', 'Szöveg');

    expect(res.status).toBe(401);

    const created = await Course.findOne({ where: { cim: 'Új Kurzus Token Nélkül' } });
    expect(created).toBeNull();
  });

  test('createCourse: sikeres létrehozás (multipart/form-data, videó fájl nélkül)', async () => {
    // A createCourse route-on a `verifyToken`/`verifyAdmin` (router.use az adminRoutes.js
    // tetején) fut le az upload.single('video') ELŐTT -- multer akkor is helyesen tölti a
    // req.body-t szöveges mezőkkel, ha nincs csatolt fájl, ezért itt szándékosan nem
    // csatolunk videót (elkerülve az 'uploads/' könyvtár létét megkövetelő diskStorage-ot).
    const res = await request(app)
      .post('/api/admin/createCourse')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('cim', 'Új Kurzus')
      .field('helyszin', 'Online')
      .field('idopont', '2026-12-01T10:00:00Z')
      .field('ar', '15000')
      .field('temakor', 'egyeb')
      .field('leiras', 'Leírás')
      .field('szoveg', 'Szöveg');

    expect(res.status).toBe(201);

    const created = await Course.findOne({ where: { cim: 'Új Kurzus' } });
    expect(created).not.toBeNull();
    createdCourseIds.push(created.id);
  });

  test('updateCourse: sikeres módosítás', async () => {
    const course = await createCourse();
    createdCourseIds.push(course.id);

    const res = await request(app)
      .put('/api/admin/updateCourse')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('id', String(course.id))
      .field('cim', 'Frissített Cím');

    expect(res.status).toBe(200);

    await course.reload();
    expect(course.cim).toBe('Frissített Cím');
  });

  test('updateCourse: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .put('/api/admin/updateCourse')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('id', '999999999')
      .field('cim', 'Nem Létezik');

    expect(res.status).toBe(404);
  });

  test('deleteCourse: sikeres törlés', async () => {
    const course = await createCourse();

    const res = await request(app)
      .delete('/api/admin/deleteCourse')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: course.id });

    expect(res.status).toBe(200);

    const found = await Course.findByPk(course.id);
    expect(found).toBeNull();
  });

  test('deleteCourse: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .delete('/api/admin/deleteCourse')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: 999999999 });

    expect(res.status).toBe(404);
  });
});
