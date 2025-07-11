import request from '@/utils/request';
enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * 获取指定城市天气信息（高德）
 * @param data
 * @returns
 */
export function getWeather<T>() {
  return request<T>({
    url: `/api/v3/weather/weatherInfo?city=510100&key=850268c979fccb70b1ee1732dc64f20c`, // 动态传入 city
    method: 'get',
  });
}

/**
 * 测试
 * @param data
 * @param signal
 * @returns
 */
export function testCancelApi<T>(data: string, signal: AbortSignal) {
  return request<T>({
    url: '/api/v1/test',
    method: RequestEnum.POST,
    data,
    signal,
  });
}

export function getGitHubProject<T>() {
  return request<any[]>({
    url: '/github/users/Bing-b/repos',
    method: RequestEnum.GET,
    headers: {
      token: import.meta.env.VITE_GITHUB_TOKEN,
    },
  });
}
