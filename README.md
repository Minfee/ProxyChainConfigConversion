# Proxy Chain Config Conversion

### 用于完成 clash、surge 订阅配置与代理链配置信息的自动改写与更新

### 接口参数说明

| 参数名称         | 是否必填 | 注释                                                                                        |
| ---------------- | -------- | ------------------------------------------------------------------------------------------- |
| subConfig        | 是       | 订阅的代理配置或者配置链接用`\|`间隔                                                        |
| type             | 是       | clash 或 surge4                                                                             |
| conversionServer | 是       | 填写提供订阅转换的服务地址(subconverter)                                                    |
| proxyChainMap    | 否       | 填写被代理服务器和代理服务器的映射 格式为 JSON.stringify({original:string,target:string}[]) |
