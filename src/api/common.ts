import request from '@/utils/request';
enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export function getWeathers<T>(data: { city: string }) {
  return request<T>({
    url: 'tq/version=v6&appid=21375891&appsecret=fTYv7v5E&city=南京',
    method: 'get',
    data,
  });
}

export function getWeather<T>() {
  return request<T>({
    url: `/api/v3/weather/weatherInfo?city=510100&key=850268c979fccb70b1ee1732dc64f20c`, // 动态传入 city
    method: 'get',
  });
}

export function testCancelApi<T>(data: string, signal: AbortSignal) {
  return request<T>({
    url: '/api/v1/test',
    method: RequestEnum.POST,
    data,
    signal,
  });
}
