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

  surgeProcessing(data: string, refeashUrl: string, proxyChainMap?: string) {
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
    const refreshConfigPattern = /#!MANAGED-CONFIG+.+/g;
    data =
      data.replace(
        refreshConfigPattern,
        `#!MANAGED-CONFIG ${refeashUrl} interval=43200 strict=true`,
      ) +
      `[MITM]
    ca-passphrase = 99E6F550
    ca-p12 = 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
    `;

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
    refeashUrl: string,
    proxyChainMap?: string,
  ) {
    switch (type) {
      case 'surge4':
        return this.surgeProcessing(data, refeashUrl, proxyChainMap);
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
    const url = `${conversionServer}?target=${target}&url=${proxyLink}&insert=true&config=${config}&filename=minfee&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&udp=true`;

    const ip = await axios.get('http://ifconfig.me/ip').then((r) => {
      return r.data;
    });
    const refeashUrl = `http://${ip}:9090/api/v1/sub/getSub?conversionServer=${encodeURIComponent(
      conversionServer,
    )}&proxyChainMap=${encodeURIComponent(
      proxyChainMap,
    )}&type=${encodeURIComponent(type)}&subConfig=${encodeURIComponent(
      subConfig,
    )}`;

    return await axios.get(url).then((r) => {
      return this.processing(type, r.data, refeashUrl, proxyChainMap);
    });
  }
}
