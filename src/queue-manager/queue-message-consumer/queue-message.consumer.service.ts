import { Inject, Injectable, Logger } from '@nestjs/common'
import { Notification } from '../../notification/notification'
import { QueueMessageProducerService } from '../queue-message-producer/queue-message-producer.service'

import { ConfigService } from '@nestjs/config'
import { MESSAGE_CACHE_TTL, MESSAGE_PATTERN, MESSAGE_PROCESS_CACHE_TTL, NATS_SERVICE, QUEUE_NAME, QUEUE_PREFIX } from '../queue.constants'
import { CacheStatusEnum } from '../queue-message-cache/queue-message-cache.interface'
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices'
import { QueueMessageCacheService } from '../queue-message-cache/queue-message-cache.service'
import { NotificationResponse } from '../../notification/notification-response'

@Injectable()
export class QueueMessageConsumerService {
  private readonly logger = new Logger(QueueMessageConsumerService.name)
  private readonly messageProcessCacheTTL: number
  private readonly messageCacheTTL: number

  public constructor(
    private readonly configService: ConfigService,
    private readonly queueMessageProducerService: QueueMessageProducerService,
    private readonly queueMessageCacheService: QueueMessageCacheService,
    @Inject(NATS_SERVICE) private client: ClientProxy,
  ) {
    this.messageProcessCacheTTL = Number(this.configService.get(MESSAGE_PROCESS_CACHE_TTL))
    this.messageCacheTTL = Number(this.configService.get(MESSAGE_CACHE_TTL))
  }

  private async sendBackToQueue(id, notification) {
    setTimeout(() => {
      this.queueMessageProducerService.sendMessage(notification, false)
      this.logger.log(`Message sent back to queue - id: ${id}`)
    }, 3000)
  }

  private async catchHandleMessageException(error, notificationId: string, notification: Notification): Promise<void> {
    await this.queueMessageCacheService.updateStatus(
      notificationId,
      CacheStatusEnum.FAILED,
      this.messageCacheTTL,
      error.message,
    )

    const isDuplicateKeyError = error.message.includes('duplicate key error')
    if (isDuplicateKeyError) {
      this.logger.error(
        `FAIL on CacheManager with "duplicate key error" - id: ${notificationId}`,
        error.message,
      )
      await this.sendBackToQueue(notificationId, notification)
    } else {
      this.logger.error(
        `FAIL on message process - id: ${notificationId} - message: ${JSON.stringify(alert)}`,
        error.stack,
      )
    }
  }

  @MessagePattern(MESSAGE_PATTERN)
  @MessagePattern('hello')
  public async handleMessage(@Payload() notification: Notification): Promise<void> {

    const processNotificationId = 'process-' + notification.messageId

    this.logger.log(`Message consumed - id: ${notification.messageId}`)

    try {
      const isCached = await this.queueMessageCacheService.isCached(processNotificationId)
      if (isCached) {
        this.sendBackToQueue(processNotificationId, alert)
        return
      }

      await this.queueMessageCacheService.add(
        {
          id: processNotificationId,
          notification,
        },
        this.messageProcessCacheTTL,
      )

      await this.queueMessageCacheService.updateStatus(
        processNotificationId,
        CacheStatusEnum.CONSUMED,
        this.messageCacheTTL,
      )

      await this.handleNotification(notification)
        .then((response) =>
          this.queueMessageCacheService.updateStatus(
            processNotificationId,
            CacheStatusEnum.PROCESSED,
            this.messageCacheTTL
          ),
        )
        .then(() =>
          this.queueMessageCacheService.remove(processNotificationId),
        )

      this.logger.log(`Message processed successfully - id: ${processNotificationId}`)
    } 
    catch (error) {
      await this.catchHandleMessageException(error, processNotificationId, notification)
    }
  }

  private async handleNotification(notification: Notification): Promise<void|NotificationResponse> {
    return await Promise
        .resolve(() => this.logger.debug('Simple Notification Process'))
        .then(() => {message: 'Simple Message'})
  }

}
