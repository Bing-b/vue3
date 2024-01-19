import * as L from 'leaflet';

L.Edit.Circle = L.Edit.CircleMarker.extend({
  _createResizeMarker() {
    const center = this._shape.getLatLng();
    const resizemarkerPoint = this._getResizeMarkerPoint(center);

    this._resizeMarkers = [];
    this._resizeMarkers.push(this._createMarker(resizemarkerPoint, this.options.resizeIcon));
  },

  _getResizeMarkerPoint(latlng) {
    const delta = this._shape._radius * Math.cos(Math.PI / 4);
    const point = this._map.project(latlng);
    return this._map.unproject([point.x + delta, point.y - delta]);
  },

  _resize(latlng) {
    const moveLatLng = this._moveMarker.getLatLng();
    let radius;

    if (L.GeometryUtil.isVersion07x()) {
      radius = moveLatLng.distanceTo(latlng);
    } else {
      radius = this._map.distance(moveLatLng, latlng);
    }
    // 修改leaflet-draw的源码，解决无法编辑半径的问题！！！
    this._shape.setRadius(radius);

    this._map.fire(L.Draw.Event.EDITRESIZE, { layer: this._shape });
  },
});
