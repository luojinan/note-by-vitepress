## 估价器请求怎么过滤掉非接口定义的字段


生成携带请求方法的文件（或者纯类型的文件
```ts
import { Method, RequestBodyType, ResponseBodyType, RequestConfig, RequestFunctionRestArgs, prepare } from '@zz-common/zapi-to-typescript'
import request from './request'

// makeRequest
function makeRequestRequired<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(
  requestConfig: TRequestConfig,
) {
  const req = function (requestData: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) {
    return request<TResponseData>(prepare(requestConfig, requestData), ...args)
  }
  req.requestConfig = requestConfig
  return req
}
function makeRequestOptional<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(
  requestConfig: TRequestConfig,
) {
  const req = function (requestData?: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) {
    return request<TResponseData>(prepare(requestConfig, requestData), ...args)
  }
  req.requestConfig = requestConfig
  return req
}
function makeRequest<TReqeustData, TResponseData, TRequestConfig extends RequestConfig>(requestConfig: TRequestConfig) {
  const optional = makeRequestOptional<TReqeustData, TResponseData, TRequestConfig>(requestConfig)
  const required = makeRequestRequired<TReqeustData, TResponseData, TRequestConfig>(requestConfig)
  return (requestConfig.requestDataOptional ? optional : required) as TRequestConfig['requestDataOptional'] extends true
    ? typeof optional
    : typeof required
}

// Request
export type Request<
  TReqeustData,
  TRequestConfig extends RequestConfig,
  TRequestResult,
> = (TRequestConfig['requestDataOptional'] extends true
  ? (requestData?: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult
  : (requestData: TReqeustData, ...args: RequestFunctionRestArgs<typeof request>) => TRequestResult) & {
  requestConfig: TRequestConfig
}

const mockUrl_0_0_0_4 = 'https://zapi.zhuanspirit.com/mock/7895' as any
const devUrl_0_0_0_4 = '' as any
const prodUrl_0_0_0_4 = '' as any
const dataKey_0_0_0_4 = 'data' as any

/**
 * 接口 [实时询价↗](https://zapi.zhuanspirit.com/project/7895/interface/api/3970184) 的 **请求配置的类型**
 */
type EvalPriceRequestConfig = Readonly<
  RequestConfig<
    'https://zapi.zhuanspirit.com/mock/7895',
    '',
    '',
    '/platform/retailPrice4/evalPrice',
    'data',
    string,
    'sceneId' | 'qcCode' | 'version',
    false
  >
>

/**
 * 接口 [实时询价↗](https://zapi.zhuanspirit.com/project/7895/interface/api/3970184) 的 **请求配置**
 */
const evalPriceRequestConfig: EvalPriceRequestConfig = {
  mockUrl: mockUrl_0_0_0_4,
  devUrl: devUrl_0_0_0_4,
  prodUrl: prodUrl_0_0_0_4,
  path: '/platform/retailPrice4/evalPrice',
  method: Method.GET,
  requestHeaders: {},
  requestBodyType: RequestBodyType.query,
  responseBodyType: ResponseBodyType.json,
  dataKey: dataKey_0_0_0_4,
  paramNames: [],
  queryNames: ['sceneId', 'qcCode', 'version'],
  requestDataOptional: false,
  requestDataJsonSchema: {},
  responseDataJsonSchema: {},
  requestFunctionName: 'evalPrice',
  noStrictParams: false,
}

/**
 * 接口 [实时询价↗](https://zapi.zhuanspirit.com/project/7895/interface/api/3970184) 的 **请求函数**
 */
export const evalPrice = makeRequest<EvalPriceRequest, EvalPriceResponse, EvalPriceRequestConfig>(
  evalPriceRequestConfig,
)
```
👆 大部分是请求方法的处理

👇 入参出参的类型其实非常少
```ts
/**
 * 接口 [实时询价↗](https://zapi.zhuanspirit.com/project/7895/interface/api/3970184) 的 **请求类型**
 */
export interface EvalPriceRequest {
  sceneId: string
  qcCode: string
  version: string
}

/**
 * 接口 [实时询价↗](https://zapi.zhuanspirit.com/project/7895/interface/api/3970184) 的 **返回类型**
 */
export type EvalPriceResponse = {
  /**
   * 质检码
   */
  qcCode: string
}[]
```