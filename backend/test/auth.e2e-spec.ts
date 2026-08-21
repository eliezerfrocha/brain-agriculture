import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrapTestApp } from './utils/bootstrap-test-app';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await bootstrapTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejeita requisição sem token em rota protegida', async () => {
    await request(app.getHttpServer()).get('/produtores').expect(401);
  });

  it('rejeita login com senha incorreta', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@brainagriculture.com', password: 'senha-errada' })
      .expect(401);
  });

  it('rejeita login com e-mail inexistente', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ninguem@example.com', password: 'qualquer' })
      .expect(401);
  });

  it('faz login com sucesso e acessa rota protegida com o token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@brainagriculture.com', password: 'Admin@123' })
      .expect(201);

    expect(loginResponse.body.accessToken).toEqual(expect.any(String));
    expect(loginResponse.body.usuario).toMatchObject({
      email: 'admin@brainagriculture.com',
      nome: 'Administrador',
    });

    const token = loginResponse.body.accessToken;

    const meResponse = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(meResponse.body.email).toBe('admin@brainagriculture.com');

    await request(app.getHttpServer())
      .get('/produtores')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  });
});
