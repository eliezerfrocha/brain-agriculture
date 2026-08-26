import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { buildOpenApiDocument } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const configService = app.get(ConfigService);

  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS_ORIGIN aceita uma ou mais origens separadas por vírgula (ex.: Vercel
  // expõe mais de uma URL de produção pro mesmo deploy).
  const corsOrigins = configService
    .get('CORS_ORIGIN', 'http://localhost:5173')
    .split(',')
    .map((origin: string) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
  });

  SwaggerModule.setup('docs', app, buildOpenApiDocument(app));

  const port = configService.get('PORT', 3000);
  await app.listen(port);
}
bootstrap();
