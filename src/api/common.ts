import request from '@/utils/request'

export function getWeather<T>(data:{city:string}) {
  return request<T>({
    url: 'tq/version=v6&appid=21375891&appsecret=fTYv7v5E&city=南京',
    method: 'get',
    data
  });
}