const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const { createAdmin, createUser, uniqueEmail, uniqueUsername, generateToken } = require('./helpers/factories');

const app = buildTestApp();

describe('Admin - felhasználó CRUD (src/routes/adminRoutes.js + adminController.js)', () => {
  let admin;
  let adminToken;
  let plainUser;
  let plainUserToken;
  const createdUserIds = [];

  beforeAll(async () => {
    ({ user: admin } = await createAdmin());
    ({ user: plainUser } = await createUser());
    adminToken = generateToken(admin);
    plainUserToken = generateToken(plainUser);
    createdUserIds.push(admin.id, plainUser.id);
  });

  afterAll(async () => {
    await User.destroy({ where: { id: createdUserIds } });
  });

  test('Authorization header nélkül 401-et ad', async () => {
    const res = await request(app).post('/api/admin/users');
    expect(res.status).toBe(401);
  });

  test('érvényes admin JWT-vel átenged, a body.userId-nek nincs szerepe az auth-ban', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('nem admin JWT esetén 403-at ad', async () => {
    const res = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${plainUserToken}`);

    expect(res.status).toBe(403);
  });

  test('createUser: sikeres létrehozás', async () => {
    const email = uniqueEmail('admincreated');

    const res = await request(app)
      .post('/api/admin/createUser')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
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
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: target.id, fullName: newFullName });

    expect(res.status).toBe(200);

    await target.reload();
    expect(target.fullName).toBe(newFullName);
  });

  test('updateUser: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .put('/api/admin/updateuser')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: 999999999, fullName: 'Nem Létezik' });

    expect(res.status).toBe(404);
  });

  test('deleteUser: sikeres törlés', async () => {
    const { user: target } = await createUser();

    const res = await request(app)
      .delete('/api/admin/deleteUser')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: target.id });

    expect(res.status).toBe(200);

    const found = await User.findByPk(target.id);
    expect(found).toBeNull();
  });

  test('deleteUser: nem létező id esetén 404-et ad', async () => {
    const res = await request(app)
      .delete('/api/admin/deleteUser')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ id: 999999999 });

    expect(res.status).toBe(404);
  });
});
