import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { NotificationModule } from './notification/notification.module'
import { QueueManagerModule } from './queue-manager/queue-manager.module'
import { ConfigProvider } from './providers/custom.providers'
const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

@Module({
  imports: [
    ConfigProvider,
    NotificationModule,
    QueueManagerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
