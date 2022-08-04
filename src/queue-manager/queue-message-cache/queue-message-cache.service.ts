import { Inject, CACHE_MANAGER, Logger, Injectable } from '@nestjs/common'

import { Cache } from 'cache-manager'
import { isEmpty } from 'lodash'
import { CacheStatusEnum, IQueueMessageCache } from './queue-message-cache.interface'

@Injectable()
export class QueueMessageCacheService {
  private readonly logger = new Logger(QueueMessageCacheService.name)

  public constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

  public async isCached(id: string): Promise<boolean> {
    return await this.cacheManager.get(id).then((resp) => !isEmpty(resp))
  }

  public async add(messageCache: IQueueMessageCache, ttl: number): Promise<void> {
    await this.cacheManager.set(messageCache.id, messageCache, {
      ttl,
    })
  }

  public async remove(id: string): Promise<void> {
    await this.cacheManager.del(id)
  }

  public async updateStatus(
    id: string,
    status: CacheStatusEnum,
    ttl: number,
    errorMessage = '',
  ): Promise<void> {
    const alertCached = (await this.cacheManager.get(id)) as IQueueMessageCache

    await this.cacheManager.set(
      id,
      {
        id,
        cacheType: alertCached.cacheType,
        status,
        errorMessage,
        notification: alertCached.notification,
      },
      { ttl },
    )
  }

  public async get(id: string): Promise<any> {
    return await this.cacheManager.get(id)
  }
}
