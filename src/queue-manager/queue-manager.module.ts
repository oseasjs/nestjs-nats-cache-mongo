import { Module } from '@nestjs/common'
import { QueueMessageProducerService } from './queue-message-producer/queue-message-producer.service'
import { QueueMessageConsumerService } from './queue-message-consumer/queue-message.consumer.service'
import { QueueMessageCacheService } from './queue-message-cache/queue-message-cache.service'
import { CacheProvider, ConfigProvider, NatsProvider } from '../providers/custom.providers'

@Module({
  imports: [ConfigProvider, NatsProvider, CacheProvider],
  providers: [QueueMessageConsumerService, QueueMessageProducerService, QueueMessageCacheService],
  exports: [QueueMessageConsumerService, QueueMessageProducerService, QueueMessageCacheService],
})
export class QueueManagerModule {}
