import { CacheModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ClientsModule, Transport } from "@nestjs/microservices"
import { DATABASE_URI, NATS_MESSAGES_CACHE_MANAGER, NATS_SERVICE, QUEUE_NAME } from "src/queue-manager/queue.constants"
import * as mongodbStore from 'cache-manager-mongodb'

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

export const ConfigProvider = ConfigModule.forRoot({
  envFilePath: `./config/${env}.env`,
  isGlobal: true,
})

export const NatsProvider = ClientsModule.register([
  {
    name: NATS_SERVICE,
    transport: Transport.NATS,
    options: {
      servers: [`${process.env.NATS_SERVER}`],
      queue: QUEUE_NAME,
      concurrentLimit: 10, // Maximum concurrency per concurrentGroupId
      activationIntervalSec: 2, // Add/Reduce concurrent consumers within the interval
      ackWaitSec: 60, // Time to process message before redelivery
      batchSize: 1, // Number of messages to fetch in 1 request
      pollIntervalSec: 20, // Interval to check for new messages if queue is empty
      retryLimit: -1,
    },
  },
])

export const CacheProvider = CacheModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (cs: ConfigService) => ({
    store: mongodbStore,
    uri: `${cs.get(DATABASE_URI)}`,
    options: {
      collection: NATS_MESSAGES_CACHE_MANAGER,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  }),
})