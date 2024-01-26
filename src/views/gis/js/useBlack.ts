
import * as L from 'leaflet';



export const DesignTileLayer:any = L.TileLayer.extend({


  leafletMap: null,

  initialize: function (url: string, options: any) {

    this.url = url;
    // @ts-ignore
    L.GridLayer.prototype.initialize.call(this, options);
  },

  createTile: function (coords:any) {
    /** 获取外部接受的颜色 */
    const { color } = this.options;
    this.leafletMap = this.options.leafletMap;

    // 创建一个用于绘图的 <canvas> 元素
    const tile = L.DomUtil.create('canvas', 'leaflet-tile');

    // 根据选项设置瓦片的宽度和高度
    const size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;

    // 获得一个 canvas 上下文，并使用 coords.x、coords.y 和 coords.z 在上面画东西
    const ctx: any = tile.getContext('2d');

    // 使用传入的 URL 模板替换变量
    const url = this.url
      .replace('{x}', coords.x)
      .replace('{y}', coords.y)
      .replace('{z}', this.leafletMap );
    console.log(this.leafletMap)
    // 创建一个图像对象来加载瓦片
    const img = new Image();

    img.src = url; // 替换为你的图片路径

    // 当图片加载完成后，绘制到 Canvas 上
    img.onload = function () {
      // 绘制图片到 Canvas 上
      ctx.drawImage(img, 0, 0, tile.width, tile.height);
      // 获取图像的像素数据
      const imageData = ctx.getImageData(0, 0, tile.width, tile.height);
      // 获取原来的图片的像素颜色
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        // 计算灰度
        let grayVal = (r + g + b) / 3;
        // 灰度反转--会使图片整体变成灰色--方便上色
        grayVal = 255 - grayVal;
        // 将灰度替换掉原始的颜色
        pixels[i] = grayVal + color.r;
        pixels[i + 1] = grayVal + color.g;
        pixels[i + 2] = grayVal + color.b;
        // 设置一个前景透明度，以便和背景混合
        if (color.a) {
          pixels[i + 3] = a * color.a;
        }
      }
      // 将修改后的像素数据放回 Canvas
      ctx.putImageData(imageData, 0, 0);
    };
    // 返回瓦片，以便在屏幕上呈现
    return tile;
  }
}) 
