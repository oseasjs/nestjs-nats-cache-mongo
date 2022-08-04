import { Module } from '@nestjs/common'
import { CacheProvider, NatsProvider } from 'src/providers/custom.providers';
import { QueueManagerModule } from 'src/queue-manager/queue-manager.module';
import { QueueMessageCacheService } from 'src/queue-manager/queue-message-cache/queue-message-cache.service';
import { QueueMessageProducerService } from 'src/queue-manager/queue-message-producer/queue-message-producer.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [NatsProvider, CacheProvider, QueueManagerModule],
  controllers: [NotificationController],
  providers: [QueueMessageProducerService, QueueMessageCacheService],
  exports: [],
})
export class NotificationModule {}
