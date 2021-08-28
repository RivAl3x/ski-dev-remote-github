import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';
import {icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer} from 'leaflet';
import { Observable } from 'rxjs';
import { ListingLocationModel } from '../../_models/listing-location.model';
import { ListingModel } from '../../_models/listing.model';
import {MapPoint} from '../../_models/map-point.model';
import { NominatimResponse } from '../../_models/nominatim-response.model';

const DEFAULT_LATITUDE = 45.9852129;
const DEFAULT_LONGITUDE = 24.6859225;
const DEFAULT_ZOOM = 6;
const LOCATION_ZOOM = 16;

const BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
const DEFAULT_VIEW_BOX: string = 'viewbox=-25.0000%2C70.0000%2C50.0000%2C40.0000';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  map: Map;
  mapPoint: MapPoint;
  options: MapOptions;
  lastLayer: any;

  @Input() location: ListingLocationModel;
  @Input() selectedCountry: Observable<any>;
  @Output() onMarkerChange = new EventEmitter();

  constructor () {
  }

  ngOnInit() {
    console.info('init map');
    console.info('input location -- ', this.location);
    console.info('selectedCountry -- ', this.selectedCountry);
    
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();
  }

  ngAfterViewInit() {
    this.selectedCountry.subscribe((val) => {
      console.info('val', val);
      if (val) this.mapCountry(val);
    });
  }

  initializeMap(map: Map) {
    this.map = map;
    this.createMarker();
  }

  mapCountry(country: any) {
    console.info('mapCountry ---- ', country);

    this.updateMapPoint(country.latitude, country.longitude, country.displayName);
    this.createMarker();
  }

  onMapClick (e: LeafletMouseEvent) {
    //console.info(e);
    //console.info(this.map.getZoom());
    
    this.clearMap();
    this.updateMapPoint(e.latlng.lat, e.latlng.lng);
    this.createMarker();

    this.onMarkerChange.emit(this.mapPoint);
  }

  private initializeMapOptions () {
    this.options = {
      zoom: this.location.latitude && this.location.longitude ? LOCATION_ZOOM : DEFAULT_ZOOM,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'OSM'})
      ]
    }
  }

  private initializeDefaultMapPoint () {
    this.mapPoint = {
      name: '-',
      latitude: this.location.latitude || DEFAULT_LATITUDE,
      longitude: this.location.longitude || DEFAULT_LONGITUDE
    };
  }

  private updateMapPoint (latitude: number, longitude: number, name?: string) {
    this.mapPoint = {
      latitude: latitude,
      longitude: longitude,
      name: name ? name : this.mapPoint.name
    };

    console.info('this.mapPoint _____ ', this.mapPoint);
  }

  private createMarker () {
    this.clearMap();
    const mapIcon = this.getDefaultIcon();
    const coordinates = latLng([this.mapPoint.latitude, this.mapPoint.longitude]);
    this.lastLayer = marker(coordinates).setIcon(mapIcon).addTo(this.map);
    this.map.setView(coordinates, this.map.getZoom());
  }

  private getDefaultIcon () {
    return icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/images/marker-icon.png'
    });
  }

  private clearMap () {
    if (this.map.hasLayer(this.lastLayer)) this.map.removeLayer(this.lastLayer);
  }

}
