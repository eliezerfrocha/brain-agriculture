import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrapTestApp } from './utils/bootstrap-test-app';
import { generateValidCpf } from './utils/generate-cpf';

describe('Propriedades (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let produtorId: string;

  beforeAll(async () => {
    app = await bootstrapTestApp();

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@brainagriculture.com', password: 'Admin@123' });
    token = login.body.accessToken;

    const produtor = await request(app.getHttpServer())
      .post('/produtores')
      .set(auth())
      .send({ cpfCnpj: generateValidCpf(), nome: 'Produtor Propriedades E2E' });
    produtorId = produtor.body.id;
  });

  afterAll(async () => {
    // remover o produtor cobre a propriedade em cascata (onDelete: CASCADE)
    await request(app.getHttpServer()).delete(`/produtores/${produtorId}`).set(auth());
    await app.close();
  });

  function auth() {
    return { Authorization: `Bearer ${token}` };
  }

  it('rejeita quando areaAgricultavel + areaVegetacao > areaTotal', async () => {
    const response = await request(app.getHttpServer())
      .post('/propriedades')
      .set(auth())
      .send({
        produtorId,
        nome: 'Fazenda Inválida',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 100,
        areaAgricultavel: 80,
        areaVegetacao: 30,
      })
      .expect(400);

    expect(response.body.errors.join(' ')).toMatch(/areaTotal/);
  });

  it('aceita quando a soma das áreas é exatamente igual à área total', async () => {
    const created = await request(app.getHttpServer())
      .post('/propriedades')
      .set(auth())
      .send({
        produtorId,
        nome: 'Fazenda Válida',
        cidade: 'Uberlândia',
        estado: 'MG',
        areaTotal: 1000,
        areaAgricultavel: 600,
        areaVegetacao: 400,
      })
      .expect(201);

    expect(created.body.id).toEqual(expect.any(String));
  });

  it('reflete a propriedade criada no dashboard (resumo e uso do solo)', async () => {
    const resumo = await request(app.getHttpServer())
      .get('/dashboard/resumo')
      .set(auth())
      .expect(200);

    expect(resumo.body.totalFazendas).toBeGreaterThanOrEqual(1);
    expect(resumo.body.totalHectares).toBeGreaterThanOrEqual(1000);

    const usoDoSolo = await request(app.getHttpServer())
      .get('/dashboard/uso-do-solo')
      .set(auth())
      .expect(200);

    expect(usoDoSolo.body.areaAgricultavel).toBeGreaterThanOrEqual(600);
    expect(usoDoSolo.body.areaVegetacao).toBeGreaterThanOrEqual(400);

    const porEstado = await request(app.getHttpServer())
      .get('/dashboard/por-estado')
      .set(auth())
      .expect(200);

    expect(porEstado.body.some((item: { estado: string }) => item.estado === 'MG')).toBe(true);
  });
});
