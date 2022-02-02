import { Controller, Get, Query } from '@nestjs/common';
import { SubService } from './sub.service';

@Controller('sub')
export class SubController {
  constructor(private readonly appService: SubService) {}

  @Get('getSub')
  async getHello(
    @Query('subConfig') subConfig: string,
    @Query('type') type: string,
    @Query('conversionServer') conversionServer: string,
    @Query('proxyChainMap')
    proxyChainMap?: string,
  ): Promise<any> {
    return await this.appService.getSub(
      subConfig,
      type,
      conversionServer,
      proxyChainMap,
    );
  }
}
