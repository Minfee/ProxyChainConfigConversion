import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SubService {
  getTarget(type: string): string {
    switch (type) {
      case 'surge4':
        return 'surge&ver=4';
      case 'clash':
        return 'clash';
      default:
        return 'clash';
    }
  }

  surgeProcessing(
    data: string,
    conversionServer: string,
    proxyChainMap?: string,
  ) {
    try {
      const proxyChainMapParse = JSON.parse(proxyChainMap);
      const groupPattern = /\[Proxy\][\s\S]*(?=\[Proxy Group\])/g;

      data = data.replace(groupPattern, (match) => {
        proxyChainMapParse.forEach((item) => {
          const pattern = new RegExp(
            `${item.original}+.+(?=(\r\n|\r|\n))`,
            'g',
          );

          match = match.replace(pattern, (target) => {
            return target + ', ' + 'underlying-proxy=' + item.target;
          });
        });

        return match;
      });
    } catch (error) {}
    const refreshConfigPattern = /#!MANAGED-CONFIG +.+(?=\?)/g;
    data = data.replace(
      refreshConfigPattern,
      `#!MANAGED-CONFIG ${conversionServer}`,
    );
    return data;
  }

  clashProcessing(data: string, proxyChainMap?: string) {
    try {
      const proxyChainMapParse = JSON.parse(proxyChainMap);
      const proxyPattern = /proxy-groups:[\s\S]*(?=rules:)/g;
      data = data.replace(proxyPattern, (match) => {
        proxyChainMapParse.forEach((item) => {
          match = match.replace(
            new RegExp(item.original, 'g'),
            item.original + ' Relay',
          );
          match =
            match +
            `  - name: ${item.original} Relay \n    type: relay \n    proxies: \n      - ${item.original} \n      - ${item.target} \n`;
        });

        return match;
      });
    } catch {}
    return data;
  }

  processing(
    type: string,
    data: string,
    conversionServer: string,
    proxyChainMap?: string,
  ) {
    switch (type) {
      case 'surge4':
        return this.surgeProcessing(data, conversionServer, proxyChainMap);
      case 'clash':
        return this.clashProcessing(data, proxyChainMap);
      default:
        return data;
    }
  }

  async getSub(
    subConfig: string,
    type: string,
    conversionServer: string,
    proxyChainMap?: string,
  ): Promise<any> {
    const config = encodeURIComponent(
      'https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/config/ACL4SSR_Online_Full_AdblockPlus.ini',
    );
    const target = this.getTarget(type);
    const proxyLink = encodeURIComponent(subConfig);

    return await axios
      .get(
        `${conversionServer}?target=${target}&url=${proxyLink}&insert=true&config=${config}&filename=minfee&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&udp=true`,
      )
      .then((r) => {
        return this.processing(type, r.data, conversionServer, proxyChainMap);
      });
  }
}
