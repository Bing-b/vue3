import * as L from 'leaflet';
import gcoord from 'gcoord';

/**
 * 生成图标icon
 * @param url  图标路径
 * @param size 图标大小
 * @param anchor  图标坐标
 * @returns
 */
const setIcon = (
  name: string,
  size: [number, number] = [30, 30],
  anchor: [number, number] = [15, 15],
) => {
  return L.icon({
    iconUrl: new URL(`../../../assets/icons/${name}`, import.meta.url).href,
    iconSize: size,
    iconAnchor: anchor,
  });
};

// 坐标转换 国测局转GPS
const GCJ02TOWGS84 = (lng: number, lat: number) => {
  const coordinate = [] as number[];
  const WGS84 = gcoord.transform([lng, lat], gcoord.GCJ02, gcoord.WGS84);
  coordinate.push(WGS84[1], WGS84[0]);
  return coordinate;
};

// 批量生成随机坐标点
const generateMockMarkers = (count: number, center: [number, number]) => {
  const data = [];
  for (let i = 0; i < count; i++) {
    // 随机偏移，约在城市10-20公里范围内
    const lat = center[0] + (Math.random() - 0.5) * 0.3;
    const lng = center[1] + (Math.random() - 0.5) * 0.3;
    data.push({
      id: `id_${i}`,
      coordinate: [lat, lng],
      name: `测试点位_${i}`,
    });
  }
  return data;
};

export { setIcon, GCJ02TOWGS84, generateMockMarkers };
