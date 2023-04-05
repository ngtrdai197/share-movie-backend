import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentService } from './environment/environment.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const envService = app.get(EnvironmentService);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('/api');

  const PORT = envService.get<number>('api_port');
  await app.listen(PORT, () => {
    Logger.log(`API listening on port: ${PORT}`);
  });
}
bootstrap();
