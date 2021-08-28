import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { MapPoint } from '../../_models/map-point.model';
import { NominatimService } from '../../_services/nominatim-service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  providers: [{
      provide: MAT_RADIO_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
  }]
})
export class LocationComponent implements OnInit {

  @Input() listingForm: FormGroup;
  @Input() listingTypes: ListOption[];
  @Input() countries: ListOption[];

  filteredCountries: Observable<ListOption[]>;

  //public selectedCountry: any = null;
  public selectedCountry$: BehaviorSubject<any>;

  constructor(
    private nominatimService: NominatimService
  ) { 
    this.selectedCountry$ = new BehaviorSubject<any>(null);
  }

  ngOnInit() {

    this.filteredCountries = this.listingForm.get('location').get('country').valueChanges
      .pipe(
        startWith(''),
        map(country => country ? this._filter(country) : this.countries.slice())
      );
  }

  get listingLocation() {
    return this.listingForm.get('location').value;
  }

  public onCountrySelect(event: MatAutocompleteSelectedEvent) {
    console.info('onCountrySelect: ', event);

    if (event.option.value.name) {
      this.nominatimService.addressLookup(event.option.value.name).subscribe(response => {
        console.info('nominatim response -- ', response)
        let selectedCountry = response.length > 1 ? response[0] : null;
        this.selectedCountry$.next(selectedCountry)
      
      });
    } 

  }

  displayFn(country: ListOption): string {
    return country && country.name ? country.name : '';
  }

  private _filter(country: any): ListOption[] {
    console.info('_filter country; ', country);

    const countryName = country.name || country;

    let filteredValues = this.countries.filter(country => country.name.toLowerCase().indexOf(countryName.toLowerCase()) === 0);

    console.info('filteredValues: ', filteredValues);

    return filteredValues;
  }

  public mapMarkerData(mapPoint: MapPoint) {
    console.info('mapMarkerData: ', mapPoint);

    this.listingForm.get('location').get('latitude').patchValue(mapPoint.latitude);
    this.listingForm.get('location').get('longitude').patchValue(mapPoint.longitude);

  }

}
