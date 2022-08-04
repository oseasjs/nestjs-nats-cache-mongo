import { Inject, Injectable, Logger } from '@nestjs/common'
import { MESSAGE_CACHE_TTL, MESSAGE_PATTERN, NATS_SERVICE, NOTIFICATION_QUEUE_SUCCESSFULLY, QUEUE_NAME } from '../queue.constants'
import { ConfigService } from '@nestjs/config'
import {
  CacheStatusEnum,
  CacheTypeEnum,
} from '../queue-message-cache/queue-message-cache.interface'
import { NotificationResponse } from '../../notification/notification-response'
import { Notification } from '../../notification/notification'
import { randomUUID } from 'crypto'
import { QueueMessageCacheService } from '../queue-message-cache/queue-message-cache.service'
import { ClientProxy } from '@nestjs/microservices'
import { take } from 'rxjs'

@Injectable()
export class QueueMessageProducerService {
  private readonly logger = new Logger(QueueMessageProducerService.name)
  private readonly ttl: number

  public constructor(
    private readonly queueMessageCacheService: QueueMessageCacheService,
    private readonly configService: ConfigService,
    @Inject(NATS_SERVICE) private client: ClientProxy
  ) {
    this.ttl = Number(this.configService.get(MESSAGE_CACHE_TTL))
  }

  async sendMessage(notification: Notification, firstSend = true): Promise<NotificationResponse> {
    const notificationId = randomUUID()

    if (firstSend) {
      await this.queueMessageCacheService.add(
        {
          id: notificationId,
          cacheType: CacheTypeEnum.MESSAGE,
          status: CacheStatusEnum.NOT_CONSUMED,
          notification,
        },
        this.ttl,
      )
    }

    return Promise.resolve(
        this.client
          .send(MESSAGE_PATTERN, notification)
          .pipe(take(1))
      )
      .then(() =>
        this.logger.log(
          `Message sent to queue: ${QUEUE_NAME}, messagePartner: ${MESSAGE_PATTERN} and id: ${notificationId}`,
        ),
      )
      .then(() => ({
        id: notificationId,
        state: CacheStatusEnum.NOT_CONSUMED,
        message: NOTIFICATION_QUEUE_SUCCESSFULLY
      }))
      .catch((err) => {
        this.logger.error(
          `Failed on send message to queue: ${QUEUE_NAME}, messagePartner: ${MESSAGE_PATTERN} and id: ${notificationId}`,
          err,
        )
        throw err
      })

  }
}
