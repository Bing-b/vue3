import request from '@/utils/request'

export function getWeather<T>(params:{city:string}) {
  return request<T>({
    url: 'http://wthrcdn.etouch.cn/weather_mini',
    method: 'get',
    params
  });
}
