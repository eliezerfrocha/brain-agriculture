import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrapTestApp } from './utils/bootstrap-test-app';
import { generateValidCpf } from './utils/generate-cpf';

describe('Produtores (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const createdIds: string[] = [];

  beforeAll(async () => {
    app = await bootstrapTestApp();

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@brainagriculture.com', password: 'Admin@123' });
    token = login.body.accessToken;
  });

  afterAll(async () => {
    for (const id of createdIds) {
      await request(app.getHttpServer())
        .delete(`/produtores/${id}`)
        .set('Authorization', `Bearer ${token}`);
    }
    await app.close();
  });

  function auth() {
    return { Authorization: `Bearer ${token}` };
  }

  it('rejeita CPF com dígito verificador inválido', async () => {
    const response = await request(app.getHttpServer())
      .post('/produtores')
      .set(auth())
      .send({ cpfCnpj: '11111111111', nome: 'CPF Inválido' })
      .expect(400);

    expect(response.body.errors.join(' ')).toMatch(/CPF ou CNPJ/);
  });

  it('cria, lista, busca, atualiza e remove um produtor (CRUD completo)', async () => {
    const cpf = generateValidCpf();

    const created = await request(app.getHttpServer())
      .post('/produtores')
      .set(auth())
      .send({ cpfCnpj: cpf, nome: 'Produtor E2E' })
      .expect(201);

    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.cpfCnpj).toBe(cpf);
    const produtorId = created.body.id;

    const list = await request(app.getHttpServer()).get('/produtores').set(auth()).expect(200);
    expect(list.body.some((p: { id: string }) => p.id === produtorId)).toBe(true);

    const found = await request(app.getHttpServer())
      .get(`/produtores/${produtorId}`)
      .set(auth())
      .expect(200);
    expect(found.body.nome).toBe('Produtor E2E');

    await request(app.getHttpServer())
      .patch(`/produtores/${produtorId}`)
      .set(auth())
      .send({ nome: 'Produtor E2E Editado' })
      .expect(200)
      .expect((res) => {
        expect(res.body.nome).toBe('Produtor E2E Editado');
      });

    await request(app.getHttpServer())
      .delete(`/produtores/${produtorId}`)
      .set(auth())
      .expect(200);

    await request(app.getHttpServer())
      .get(`/produtores/${produtorId}`)
      .set(auth())
      .expect(404);
  });

  it('normaliza CPF com máscara antes de persistir', async () => {
    const cpf = generateValidCpf();
    const masked = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

    const created = await request(app.getHttpServer())
      .post('/produtores')
      .set(auth())
      .send({ cpfCnpj: masked, nome: 'Produtor Mascarado' })
      .expect(201);

    expect(created.body.cpfCnpj).toBe(cpf);
    createdIds.push(created.body.id);
  });
});
