const request = require('supertest');
const buildTestApp = require('./helpers/testApp');
const User = require('../src/models/userModel');
const { createUser } = require('./helpers/factories');

const app = buildTestApp();

describe('POST /api/login', () => {
  let user;
  let plainPassword;

  beforeAll(async () => {
    const created = await createUser({ rang: 'u' });
    user = created.user;
    plainPassword = created.plainPassword;
  });

  afterAll(async () => {
    await User.destroy({ where: { id: user.id } });
  });

  test('helyes email + jelszó esetén 200-at, tokent, userId-t és rangot ad', async () => {
    const res = await request(app).post('/api/login').send({
      email: user.email,
      pwd: plainPassword,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
    expect(res.body.userId).toBe(user.id);
    expect(res.body.rang).toBe('u');
  });

  test('rossz jelszó esetén 401-et ad', async () => {
    const res = await request(app).post('/api/login').send({
      email: user.email,
      pwd: 'rossz-jelszo',
    });

    expect(res.status).toBe(401);
    expect(res.body).not.toHaveProperty('token');
  });

  test('nem létező email esetén 401-et ad', async () => {
    const res = await request(app).post('/api/login').send({
      email: 'nincs-ilyen-user@example.com',
      pwd: 'barmi123',
    });

    expect(res.status).toBe(401);
  });

  test('hiányzó mezők esetén 400-at ad', async () => {
    const res = await request(app).post('/api/login').send({ email: user.email });
    expect(res.status).toBe(400);
  });
});
