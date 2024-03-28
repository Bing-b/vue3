
import * as L from 'leaflet';

/**
 * 生成图标icon
 * @param url  图标路径
 * @param size 图标大小
 * @param anchor  图标坐标
 * @returns 
 */
const setIcon = (url: string, size: [number, number] = [30, 30], anchor: [number, number] = [16, 16]) => {
  return L.icon({
    iconUrl: new URL(url, import.meta.url).href,
    iconSize: size,
    iconAnchor: anchor
  });
}

export { setIcon }