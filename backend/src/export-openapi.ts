import { writeFileSync } from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildOpenApiDocument } from './config/swagger.config';

/**
 * Gera uma cópia estática da especificação OpenAPI (mesmo documento servido
 * em `/docs`), pra existir versionada no repositório sem precisar da API
 * rodando. Rodar com: npm run export:openapi
 */
async function exportOpenApi() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const document = buildOpenApiDocument(app);
  writeFileSync('openapi.json', JSON.stringify(document, null, 2));
  console.log('OpenAPI exportado para backend/openapi.json');

  await app.close();
}

exportOpenApi();
