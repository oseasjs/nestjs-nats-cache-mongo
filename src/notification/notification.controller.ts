import { Body, Controller, Logger, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { QueueMessageProducerService } from 'src/queue-manager/queue-message-producer/queue-message-producer.service'
import { Notification } from './notification'

@Controller('notification')
@ApiTags('API')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name)

  constructor(
    private readonly queueMessageProducerService: QueueMessageProducerService,
  ) {}

  @Post('messages')
  async sendMessage(@Body() notification: Notification): Promise<any> {
    try {
      return await this.queueMessageProducerService.sendMessage(notification)
    } catch (error) {
      this.logger.log(JSON.stringify(error))
      return error
    }
  }  
}
