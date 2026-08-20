import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Produtor } from '../../modules/produtores/entities/produtor.entity';
import { Propriedade } from '../../modules/propriedades/entities/propriedade.entity';
import { Safra } from '../../modules/safras/entities/safra.entity';
import { Cultura } from '../../modules/culturas/entities/cultura.entity';
import { CulturaPlantada } from '../../modules/culturas-plantadas/entities/cultura-plantada.entity';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';

const ADMIN_EMAIL = 'admin@brainagriculture.com';
const ADMIN_PASSWORD = 'Admin@123';

/**
 * Popula o banco com dados mockados para testes/demo, cobrindo 5 estados
 * diferentes para os gráficos do dashboard fazerem sentido visualmente.
 *
 * Rodar com: npm run seed
 */
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'brain_agriculture',
  entities: [Produtor, Propriedade, Safra, Cultura, CulturaPlantada, Usuario],
  synchronize: true,
});

async function runSeed() {
  await dataSource.initialize();

  const produtorRepo = dataSource.getRepository(Produtor);
  const propriedadeRepo = dataSource.getRepository(Propriedade);
  const safraRepo = dataSource.getRepository(Safra);
  const culturaRepo = dataSource.getRepository(Cultura);
  const culturaPlantadaRepo = dataSource.getRepository(CulturaPlantada);
  const usuarioRepo = dataSource.getRepository(Usuario);

  // Limpa dados existentes respeitando a ordem das FKs, pra poder rodar o seed várias vezes.
  await culturaPlantadaRepo.createQueryBuilder().delete().execute();
  await propriedadeRepo.createQueryBuilder().delete().execute();
  await produtorRepo.createQueryBuilder().delete().execute();
  await safraRepo.createQueryBuilder().delete().execute();
  await culturaRepo.createQueryBuilder().delete().execute();

  await usuarioRepo.upsert(
    {
      email: ADMIN_EMAIL,
      nome: 'Administrador',
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
    },
    ['email'],
  );

  const [safra2021, safra2022] = await safraRepo.save([
    { nome: 'Safra 2021' },
    { nome: 'Safra 2022' },
  ]);

  const [soja, milho, cafe] = await culturaRepo.save([
    { nome: 'Soja' },
    { nome: 'Milho' },
    { nome: 'Café' },
  ]);

  const produtores = await produtorRepo.save([
    { cpfCnpj: '90746940556', nome: 'João da Silva' },
    { cpfCnpj: '46151735129', nome: 'Maria Oliveira' },
    { cpfCnpj: '33694922539', nome: 'Carlos Souza' },
    { cpfCnpj: '71842777831', nome: 'Ana Pereira' },
    { cpfCnpj: '79841216119455', nome: 'Agropecuária Boa Vista Ltda' },
    { cpfCnpj: '03703473654348', nome: 'Fazendas Reunidas do Cerrado S.A.' },
  ]);

  const propriedades = await propriedadeRepo.save([
    {
      produtorId: produtores[0].id,
      nome: 'Fazenda Boa Esperança',
      cidade: 'Uberlândia',
      estado: 'MG',
      areaTotal: 1000,
      areaAgricultavel: 650,
      areaVegetacao: 350,
    },
    {
      produtorId: produtores[0].id,
      nome: 'Fazenda Santa Rita',
      cidade: 'Patos de Minas',
      estado: 'MG',
      areaTotal: 500,
      areaAgricultavel: 300,
      areaVegetacao: 200,
    },
    {
      produtorId: produtores[1].id,
      nome: 'Fazenda Rio Verde',
      cidade: 'Rio Verde',
      estado: 'GO',
      areaTotal: 2000,
      areaAgricultavel: 1500,
      areaVegetacao: 500,
    },
    {
      produtorId: produtores[2].id,
      nome: 'Fazenda Três Marias',
      cidade: 'Sorriso',
      estado: 'MT',
      areaTotal: 3000,
      areaAgricultavel: 2200,
      areaVegetacao: 800,
    },
    {
      produtorId: produtores[3].id,
      nome: 'Fazenda Vale do Sol',
      cidade: 'Ribeirão Preto',
      estado: 'SP',
      areaTotal: 800,
      areaAgricultavel: 500,
      areaVegetacao: 300,
    },
    {
      produtorId: produtores[4].id,
      nome: 'Fazenda Boa Vista',
      cidade: 'Barreiras',
      estado: 'BA',
      areaTotal: 1500,
      areaAgricultavel: 1000,
      areaVegetacao: 500,
    },
    {
      produtorId: produtores[5].id,
      nome: 'Fazenda Cerrado Alto',
      cidade: 'Rio Verde',
      estado: 'GO',
      areaTotal: 2500,
      areaAgricultavel: 1800,
      areaVegetacao: 700,
    },
  ]);

  const plantios = await culturaPlantadaRepo.save([
    { propriedadeId: propriedades[0].id, safraId: safra2021.id, culturaId: soja.id },
    { propriedadeId: propriedades[0].id, safraId: safra2022.id, culturaId: milho.id },
    { propriedadeId: propriedades[1].id, safraId: safra2021.id, culturaId: cafe.id },
    { propriedadeId: propriedades[2].id, safraId: safra2021.id, culturaId: soja.id },
    { propriedadeId: propriedades[2].id, safraId: safra2022.id, culturaId: soja.id },
    { propriedadeId: propriedades[3].id, safraId: safra2022.id, culturaId: milho.id },
    { propriedadeId: propriedades[3].id, safraId: safra2022.id, culturaId: soja.id },
    { propriedadeId: propriedades[4].id, safraId: safra2021.id, culturaId: cafe.id },
    { propriedadeId: propriedades[5].id, safraId: safra2022.id, culturaId: soja.id },
    { propriedadeId: propriedades[6].id, safraId: safra2021.id, culturaId: milho.id },
  ]);

  console.log(
    `Seed concluído: ${produtores.length} produtores, ${propriedades.length} propriedades (5 estados), ${plantios.length} plantios.`,
  );
  console.log(`Usuário admin: ${ADMIN_EMAIL} / senha: ${ADMIN_PASSWORD}`);

  await dataSource.destroy();
}

runSeed().catch((error) => {
  console.error('Falha ao rodar o seed:', error);
  process.exit(1);
});
