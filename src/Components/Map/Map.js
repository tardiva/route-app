import React, { Component } from 'react';
import MapPoint from './MapPoint';
import './Map.css';

class Map extends Component {

  constructor(props) {
    super(props);
    this.map = null;
    this.route = null;
    this.infowindow = null;
    this.mapPoints = [];
    this.handleMapChange = this.handleMapChange.bind(this);
    this.handlePointInfo = this.handlePointInfo.bind(this);
    this.handlePointMove = this.handlePointMove.bind(this);
    this.handlePointHasMoved = this.handlePointHasMoved.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { google } = this.props;
    if (!prevProps.google && google) {
      this.initMap();
      this.initRoute();
      this.initInfowindow();
      this.map.addListener('center_changed', this.handleMapChange);
    }
    if (prevProps.points !== this.props.points) {
      this.updateRoute(prevProps.points, this.props.points)
    }
  }

  render() {
    return (
      <div ref="map" className="map">
        {this.props.warning ? (<div className="map__warning"><span>Что-то пошло не так. Не удается загрузить карту.</span></div>) : ''}
      </div>
    );
  }

  initMap() {
    const { google } = this.props;
    this.map = new google.maps.Map(this.refs.map, {
      zoom: 12,
      center: new google.maps.LatLng(this.props.center.lat, this.props.center.lng),
      mapTypeControl: false,
      streetViewControl: false
    });
  }

  initRoute() {
    this.route = new this.props.google.maps.Polyline({
      geodesic: false,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.route.setMap(this.map);
  }

  initInfowindow() {
    this.infowindow = new this.props.google.maps.InfoWindow({});
  }

  handleMapChange() {
    this.props.handleMapChange(this.transformCoordinates(this.map.getCenter()));
  }

  updateRoute(prevPoints, newPoints) {

    // remove outdated points
    prevPoints.forEach((point) => {
      if (!newPoints.find((newPoint) => newPoint.id === point.id)) {
        this.deletePoint(point.id);
      }
    });

    // add new points
    newPoints.forEach((point, index) => {
      const prevIndex = prevPoints.findIndex((prevPoint) => prevPoint.id === point.id);
      if (prevIndex < 0) {
        this.addPoint(point, index);
      }
    });

    // reorder points
    this.mapPoints.forEach((mapPoint, index) => {
      const id = mapPoint.id;
      if (id !== this.props.points[index].id) {
        const prevIndex = this.mapPoints.findIndex((point) => id === point.id);
        const nextIndex = this.props.points.findIndex((point) => id === point.id);
        this.reorderPoint(prevIndex, nextIndex);
      }
    });
  }

  addPoint(point, index) {
    const mapPoint = new MapPoint(this.props.google, point);

    mapPoint.setEventHandler('click', this.handlePointInfo);
    mapPoint.setEventHandler('drag', this.handlePointMove);
    mapPoint.setEventHandler('dragend', this.handlePointHasMoved);

    mapPoint.setMap(this.map);
    this.mapPoints.splice(index, 0, mapPoint);
    this.route.getPath().insertAt(index, mapPoint.getPosition());
  }

  deletePoint(id) {
    const index = this.mapPoints.findIndex(mapPoint => mapPoint.id === id);
    this.mapPoints[index].setMap(null);
    this.mapPoints.splice(index, 1);
    this.route.getPath().removeAt(index);
  }

  reorderPoint(prevIndex, nextIndex) {
    this.mapPoints.splice(nextIndex, 0, this.mapPoints.splice(prevIndex, 1)[0]);
    const path = this.route.getPath();
    const point = path.getAt(prevIndex);
    path.removeAt(prevIndex);
    path.insertAt(nextIndex, point);
  }

  handlePointInfo(mapPoint) {
    const marker = mapPoint.marker;
    this.infowindow.setContent(`<div class="map__infowindow">${marker.title}</div>`);
    this.infowindow.open(this.map, marker);
  }

  handlePointMove(mapPoint) {
    this.route.getPath().setAt(this.getPointIndexById(mapPoint.id), mapPoint.getPosition());
  }

  handlePointHasMoved(mapPoint) {
    this.props.handlePointMove(this.getPointIndexById(mapPoint.id), this.transformCoordinates(mapPoint.getPosition()));
  }

  getPointIndexById(id) {
    return this.mapPoints.findIndex(point => point.id === id);
  }

  transformCoordinates(googleLatLng) {
    return {lat: googleLatLng.lat(), lng: googleLatLng.lng()}
  }
}

export default Map;