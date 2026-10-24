import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieparser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieparser());
  app.setGlobalPrefix('api');
  /**
   * 
   * whitelist: true: field di body yang tidak ada di DTO dibuang.

     forbidNonWhitelisted: true: bekerja bersama whitelist. Alih-alih membuang field asing diam-diam, request langsung ditolak dengan 400.

    transform: true: body diubah menjadi instance class DTO, dan tipe primitif dikonversi sesuai tipe parameter (misalnya @Param('id') id: number yang awalnya string "2" jadi angka 2).
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: process.env.WEB_URL ?? 'http://localhost:3001',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
}
void bootstrap();
