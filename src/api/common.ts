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
  const isProd = import.meta.env.PROD; // true 生产环境，false 开发环境
  const baseURL = isProd ? '' : '/api';
  return request<T>({
    url: `${baseURL}/v3/weather/weatherInfo?city=510100&key=850268c979fccb70b1ee1732dc64f20c`, // 动态传入 city
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
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: any = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return request<any[]>({
    url: '/github/users/Bing-b/repos',
    method: RequestEnum.GET,
    headers,
  });
}

export function getGithubUser(username: string) {

  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: any = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return request<any>({
    url: `/github/users/${username}`,
    method: RequestEnum.GET,
    headers,
  });
}

export function getGithubEvents(username: string) {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: any = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return request<any[]>({
    url: `/github/users/${username}/events`,
    method: RequestEnum.GET,
    params: { per_page: 20 },
    headers,
  });
}

/**
 * 获取地点坐标信息
 * @param params
 * @returns
 */
export function getPlaceGeo(params: { keyword: string }) {
  const ds = JSON.stringify({ keyWord: params.keyword });

  return request<{
    location: {
      lon: string;
      lat: string;
    };
  }>({
    url: `/td/geocoder?ds=${encodeURIComponent(ds)}&tk=b40e3cf3d6fa4b1a6c1dc2d2a5288b7e`,
    method: RequestEnum.GET,
  });
}

/**
 * 获取高度区间道路信息
 * @param params
 * @returns
 */
export function getloadGeo<T>(params: { orig: string; dest: string }) {
  const postStr = JSON.stringify({
    orig: params.orig,
    dest: params.dest,
    style: '0',
  });

  return request<string>({
    url: `/td/drive`,
    method: RequestEnum.GET,
    params: {
      postStr,
      type: 'search',
      tk: 'b40e3cf3d6fa4b1a6c1dc2d2a5288b7e',
    },
  });
}
