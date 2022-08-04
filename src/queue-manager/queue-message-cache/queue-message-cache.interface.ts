import { Notification } from 'src/notification/notification'

export interface IQueueMessageCache {
  id: string
  cacheType?: CacheTypeEnum
  status?: CacheStatusEnum
  notification: Notification
}

export enum CacheTypeEnum {
  MESSAGE = 'Message',
  PROCESS = 'Process',
}

export enum CacheStatusEnum {
  NOT_CONSUMED = 'NotConsumed',
  CONSUMED = 'Consumed',
  PROCESSED = 'Processed',
  FAILED = 'Failed',
}
