import * as L from 'leaflet';

class ResetView extends L.Control {
  options: {
    position: string;
    title: string;
    latlng: L.LatLng | null;
    zoom: number | null;
  };

  constructor (options: {
    position?: string;
    title?: string;
    latlng?: L.LatLng | null;
    zoom?: number | null;
  }) {
    super(options);
    this.options = {
      position: options.position || 'topleft',
      title: options.title || 'Reset view',
      latlng: options.latlng || null,
      zoom: options.zoom || null
    };
  }

  onAdd (map: L.Map): HTMLElement {
    this._map = map;

    this._container = L.DomUtil.create('div', 'leaflet-control-resetview leaflet-bar leaflet-control');
    this._link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', this._container);
    this._link.title = this.options.title;
    this._link.href = '#';
    this._link.setAttribute('role', 'button');
    this._icon = L.DomUtil.create('span', 'leaflet-control-resetview-icon', this._link);

    L.DomEvent.on(this._link, 'click', this._resetView, this);

    return this._container;
  }

  onRemove (map: L.Map): void {
    L.DomEvent.off(this._link, 'click', this._resetView, this);
  }

  private _resetView (e: L.DomEvent): void {
    this._map.setView(this.options.latlng, this.options.zoom);
  }
}

L.control.resetView = function (options: {
  position?: string;
  title?: string;
  latlng?: L.LatLng | null;
  zoom?: number | null;
}): ResetView {
  return new ResetView(options);
};

export { ResetView };
