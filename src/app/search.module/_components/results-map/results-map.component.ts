import {Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef, OnChanges} from '@angular/core';
import {featureGroup, icon, latLng, LeafletMouseEvent, Map, MapOptions, marker, tileLayer} from 'leaflet';
import { Observable } from 'rxjs';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import {MapPoint} from '../../../host.module/_models/map-point.model';
import { MapPopupService } from '../../_services/map-popup.service';

const DEFAULT_LATITUDE = 45.9852129;
const DEFAULT_LONGITUDE = 24.6859225;
const DEFAULT_ZOOM = 6;
const LOCATION_ZOOM = 16;

const BASE_NOMINATIM_URL: string = 'nominatim.openstreetmap.org';
const DEFAULT_VIEW_BOX: string = 'viewbox=-25.0000%2C70.0000%2C50.0000%2C40.0000';

@Component({
  selector: 'app-results-map',
  templateUrl: './results-map.component.html',
  styleUrls: ['./results-map.component.scss']
})
export class ResultsMapComponent implements OnInit, OnChanges {

  map: Map;
  mapPoint: MapPoint;
  options: MapOptions;
  lastLayer: any;

  @Input() results: ListingModel[];
  @Input() imagesLoaded: boolean;

  constructor (
    private cdRef: ChangeDetectorRef,
    private mapPopupService: MapPopupService 
  ) { }

  ngOnInit() {
    this.initializeDefaultMapPoint();
    this.initializeMapOptions();

  }

  ngOnChanges() {
    this.addMarkers();
  }

  ngAfterViewInit() {
    //this.initializeDefaultMapPoint();
    //this.initializeMapOptions();

    //this.cdRef.detectChanges();
  }

  public initializeMap(map: Map) {
    console.info('initializeMap -- ', map);

    this.map = map;

    this.addMarkers();
  }
  

  private addMarkers() {
    console.info('addMarkers - results:', this.results);

    let customOptions = {
      maxWidth: 500,
      minWidth: 180
    }

    let markers = [];

    this.results.map((result) => {
      //this.createMarker(result.location);
      const mapIcon = this.getDefaultIcon();
      const coordinates = latLng([result.location.latitude, result.location.longitude]);
      this.lastLayer = marker(coordinates, {riseOnHover: true}).setIcon(mapIcon).addTo(this.map).bindPopup(this.mapPopupService.makeListingPopup(result), customOptions);

      //markers.push(marker([result.location.latitude, result.location.longitude]));
      markers.push(this.lastLayer);
    });

    if (markers.length >=2) {
      const group = featureGroup(markers);

      group.addTo(this.map);
      this.map.fitBounds(group.getBounds());
    }
    
  }

  private initializeMapOptions() {
    console.info('initializeMapOptions -- ');

    this.options = {
      attributionControl: false,
      center: [ DEFAULT_LATITUDE, DEFAULT_LONGITUDE ],
      zoom: DEFAULT_ZOOM,
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'OSM'})
      ]
    }
  }

  private initializeDefaultMapPoint() {
    this.mapPoint = {
      name: 'Hello',
      latitude: DEFAULT_LATITUDE,
      longitude: DEFAULT_LONGITUDE
    };
  }

  private createMarker(location: any = {latitude: this.mapPoint.latitude, longitude: this.mapPoint.longitude}) {

    console.info('createMarker - location: ', location);

    //this.clearMap();
    const mapIcon = this.getDefaultIcon();
    const coordinates = latLng([location.latitude, location.longitude]);
    this.lastLayer = marker(coordinates).setIcon(mapIcon).addTo(this.map);

    this.map.setView(coordinates, this.map.getZoom());
  }

  private getDefaultIcon() {
    return icon({
      iconSize: [25, 41],
      iconAnchor: [13, 41],
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });
  }

  private clearMap() {
    if (this.map.hasLayer(this.lastLayer)) this.map.removeLayer(this.lastLayer);
  }

}
