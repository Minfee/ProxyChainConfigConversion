import { Controller, Get, Query } from '@nestjs/common';
import { SubService } from './sub.service';

@Controller('sub')
export class SubController {
  constructor(private readonly appService: SubService) {}

  @Get('getSub')
  async getHello(
    @Query('subUrl') subUrl: string,
    @Query('type') type: string,
    @Query('conversionServer') conversionServer: string,
    @Query('proxyChain') proxyChain?: string,
    @Query('proxyChainMap')
    proxyChainMap?: string,
  ): Promise<any> {
    return await this.appService.getSub(
      subUrl,
      type,
      conversionServer,
      proxyChain,
      proxyChainMap,
    );
  }
}
