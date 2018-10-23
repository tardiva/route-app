export default class MapPoint {
  constructor(mapProvider, point) {
    this.id = point.id;
    this.marker = new mapProvider.maps.Marker({
      position: new mapProvider.maps.LatLng(point.coord.lat, point.coord.lng),
      title: point.name,
      draggable: true
    });
  }

  setEventHandler(eventName, handler) {
    this.marker.addListener(eventName, () => {
      handler(this);
    });
  }

  getPosition() {
    return this.marker.getPosition();
  }

  setMap(map) {
    this.marker.setMap(map);
  }
}