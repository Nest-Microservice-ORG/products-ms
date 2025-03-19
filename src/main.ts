import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// //TODO: resfull api tradicional
// async function bootstrap() {
//   const logger = new Logger('Products_MS');
  
//   const app = await NestFactory.create(AppModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       forbidNonWhitelisted: true,
//     })
//   );

//   await app.listen( envs.port );
//   logger.log(`App running on port: ${ envs.port }`);
// }
// bootstrap();


//TODO: convertir a microservicio
//instalar npm i --save @nestjs/microservices
async function bootstrap() {
  const logger = new Logger('Products_MS');
  
  //construye el factory de la app con createMicroservice<MicroserviceOptions> y le pasas el transport y el puerto de escucha
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: envs.port
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen();
  logger.log(`Products MS running on port: ${ envs.port }`);
}
bootstrap();