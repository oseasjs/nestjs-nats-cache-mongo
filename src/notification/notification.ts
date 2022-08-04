import { ApiProperty } from '@nestjs/swagger'
export class Notification {
  @ApiProperty({
    required: true,
    description: 'Unique ID for notification',
  })
  messageId: string

  @ApiProperty({
    required: true,
    description: 'The summary for the notification',
  })
  summary: string

  @ApiProperty({ required: true })
  description: string
}
