import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { ConfigService } from '@nestjs/config'
import { ApiTags } from '@nestjs/swagger'

@Controller('app')
@ApiTags('API')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly configService: ConfigService) {}
  @Get()
  public async helloApi(): Promise<any> {
    return 'Hello app!!!'
  }
}
