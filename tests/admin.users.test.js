const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const { createAdmin, createUser, uniqueEmail, uniqueUsername } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - felhasználó CRUD (src/routes/adminRoutes.js + adminController.js)', () => {
  let admin;
  let plainUser;
  const createdUserIds = [];

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    ({ user: plainUser } = await createUser());
    createdUserIds.push(admin.id, plainUser.id);
  });

  afterAll(async () => {
    await User.destroy({ where: { id: createdUserIds } });
  });

  test('verifyAdmin a MAI kódban req.body.userId-t nézi, nem valódi JWT-t: Authorization header nélkül is átenged, ha a body-ban admin userId van', async () => {
    // Ez szándékosan dokumentálja a security-review.md #1 pontjában leírt, mai (hibás)
    // viselkedést -- NEM a kívánt/javítandó állapotot teszteli.
    const res = await request(app)
      .post('/api/admin/users')
      .send({ userId: admin.id });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('nem admin userId esetén 403-at ad', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .send({ userId: plainUser.id });

    expect(res.status).toBe(403);
  });

  test('createUser: sikeres létrehozás', async () => {
    const email = uniqueEmail('admincreated');

    const res = await request(app)
      .post('/api/admin/createUser')
      .send({
        userId: admin.id,
        email,
        username: uniqueUsername('admincreated'),
        pwd: 'AdminAltalLetrehozott123!',
        fullName: 'Admin Által Létrehozott',
      });

    expect(res.status).toBe(201);

    const created = await User.findOne({ where: { email } });
    expect(created).not.toBeNull();
    createdUserIds.push(created.id);
  });

  test('updateUser: sikeres módosítás', async () => {
    const { user: target } = await createUser();
    createdUserIds.push(target.id);

    const newFullName = 'Frissített Név';

    const res = await request(app)
      .put('/api/admin/updateuser')
      .send({ userId: admin.id, id: target.id, fullName: newFullName });

    expect(res.status).toBe(200);

    await target.reload();
    expect(target.fullName).toBe(newFullName);
  });

  test('updateUser: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .put('/api/admin/updateuser')
      .send({ userId: admin.id, id: 999999999, fullName: 'Nem Létezik' });

    expect(res.status).toBe(404);
  });

  test('deleteUser: sikeres törlés', async () => {
    const { user: target } = await createUser();

    const res = await request(app)
      .delete('/api/admin/deleteUser')
      .send({ userId: admin.id, id: target.id });

    expect(res.status).toBe(200);

    const found = await User.findByPk(target.id);
    expect(found).toBeNull();
  });

  test('deleteUser: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .delete('/api/admin/deleteUser')
      .send({ userId: admin.id, id: 999999999 });

    expect(res.status).toBe(404);
  });
});
