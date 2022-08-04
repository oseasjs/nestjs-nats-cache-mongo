import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('NestJS, Nats, Cache and Mongo')
    .setDescription('Application that provide messages persistence using NestJS, Nats, Cache Manager and MongoDB')
    .setVersion('1.0')
    .addTag('API')
    // .addTag('NestJS')
    // .addTag('Nats')
    // .addTag('Cache Manager')
    // .addTag('MongoDB')
    .build()
  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('OpenApi', app, document)

  await app.listen(process.env.PORT || 5001)
}
bootstrap()
