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

export { setIcon, GCJ02TOWGS84 };
