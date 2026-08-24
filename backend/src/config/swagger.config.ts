import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

// Documento OpenAPI compartilhado entre o bootstrap (`/docs`, main.ts) e o
// script `npm run export:openapi` — pra não haver duas configurações que
// possam divergir.
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription(
      'API REST para gestão de cadastro de produtores rurais, suas propriedades e os ' +
        'plantios por safra/cultura, incluindo o dashboard de indicadores.\n\n' +
        'Autenticação: faça login em `POST /auth/login` e use o `accessToken` retornado ' +
        'como `Authorization: Bearer <token>` nas demais requisições (botão "Authorize" acima).',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .addTag('auth', 'Login e identificação do usuário autenticado')
    .addTag('produtores', 'Cadastro de produtores rurais (CPF ou CNPJ)')
    .addTag('propriedades', 'Cadastro de propriedades rurais, vinculadas a um produtor')
    .addTag('safras', 'Cadastro de safras (ex.: "Safra 2021")')
    .addTag('culturas', 'Cadastro de culturas (ex.: "Soja", "Milho")')
    .addTag('culturas-plantadas', 'Plantios: associação entre propriedade, safra e cultura')
    .addTag('dashboard', 'Indicadores agregados para os gráficos do painel')
    .addTag('geocoding', 'Geocodificação auxiliar do mapa ilustrativo de propriedades')
    .build();

  return SwaggerModule.createDocument(app, config);
}
