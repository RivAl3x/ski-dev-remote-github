import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { map, catchError, tap, delay } from 'rxjs/operators';
import { throwError, from, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DexieService } from 'src/app/_core.module/common.module/services/dexie.service';
import { AppHttpClient } from 'src/app/_core.module/common.module/services/httpClient.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';


@Injectable({ providedIn: 'root' })
export class LocalDBService {
  listingTypesTable: Dexie.Table<ListOption>;
  officeTypesTable: Dexie.Table<ListOption>;
  officeAmenitiesTable: Dexie.Table<ListOption>;
  currenciesTable: Dexie.Table<ListOption>;
  countriesTable: Dexie.Table<ListOption>;
  governmentIdTypesTable: Dexie.Table<ListOption>;
  gendersTable: Dexie.Table<ListOption>;
  bookingFilterOptionsTable: Dexie.Table<ListOption>;
  cancelReasonsTable: Dexie.Table<ListOption>;

  newListingId: number;

  apiOptionsArr = [
    'listing_types', 
    'office_types', 
    'office_amenities', 
    'currencies',
    'countries',
    'government_id_types',
    'genders',
    'booking_filter_options',
    'cancel_reasons'
  ];

  constructor(
    private apiClient: AppHttpClient, 
    private baseHttp: HttpClient,
    private dexieService: DexieService,
  ) {
    this.listingTypesTable = this.dexieService.table('listing_types');
    this.officeTypesTable = this.dexieService.table('office_types');
    this.officeAmenitiesTable = this.dexieService.table('office_amenities');
    this.currenciesTable = this.dexieService.table('currencies');
    this.countriesTable = this.dexieService.table('countries');
    this.governmentIdTypesTable = this.dexieService.table('government_id_types');
    this.gendersTable = this.dexieService.table('genders');
    this.bookingFilterOptionsTable = this.dexieService.table('booking_filter_options');
    this.cancelReasonsTable = this.dexieService.table('cancel_reasons');
  }

  getListingTypes(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('listing_types').then(response => {    
          return response;
      })
    );
  }

  getOfficeTypes(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('office_types').then(response => {    
          return response;
      })
    );
  }

  getOfficeAmenities(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('office_amenities').then(response => {    
          return response;
      })
    );
  }

  getCurrencies(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('currencies').then(response => {    
          return response;
      })
    );
  }

  getCountries(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('countries').then(response => {    
          return response;
      })
    );
  }

  getGovernmentIdTypes(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('government_id_types').then(response => {    
          return response;
      })
    );
  }

  getGenders(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('genders').then(response => {    
          return response;
      })
    );
  }

  getBookingFilters(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('booking_filter_options').then(response => {    
          return response;
      })
    );
  }

  getCancelReasons(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('cancel_reasons').then(response => {    
          return response;
      })
    );
  }

  private async getOptionsFromIndexedDB(option) {
    switch (option) {
      case 'listing_types':
        const listingTypes: ListOption[] = await this.listingTypesTable.toArray();
        return listingTypes;
        break;
      case 'office_types':
        const officeTypes: ListOption[] = await this.officeTypesTable.toArray();
        return officeTypes;
        break;
      case 'office_amenities':
        const officeAmenities: ListOption[] = await this.officeAmenitiesTable.toArray();
        return officeAmenities;
        break;
      case 'currencies':
        const currencies: ListOption[] = await this.currenciesTable.toArray();
        return currencies;
        break;
      case 'countries':
        const countries: ListOption[] = await this.countriesTable.toArray();
        return countries;
        break;
      case 'government_id_types':
        const governmentIdTypes: ListOption[] = await this.governmentIdTypesTable.toArray();
        return governmentIdTypes;
        break;
      case 'genders':
        const genders: ListOption[] = await this.gendersTable.toArray();
        return genders;
        break;
      case 'booking_filter_options':
        const bookingFilters: ListOption[] = await this.bookingFilterOptionsTable.toArray();
        return bookingFilters;
        break;
      case 'cancel_reasons':
        const cancelReasons: ListOption[] = await this.cancelReasonsTable.toArray();
        return cancelReasons;
        break;
      default:
        break;
    }
  }

  syncListOptions() {
    this.listingTypesTable.clear();
    this.officeTypesTable.clear();
    this.officeAmenitiesTable.clear();
    this.currenciesTable.clear();
    this.countriesTable.clear();
    this.governmentIdTypesTable.clear();
    this.gendersTable.clear();
    this.bookingFilterOptionsTable.clear();
    this.cancelReasonsTable.clear();

    this.apiOptionsArr.map((apiOption) => {
      this.getOptionsFromApi(apiOption).subscribe(
        options => {
          options.map((option: ListOption) => {
            this.addOptionToIndexedDb(option, apiOption);
          });
        }
      );
    });
  }

  getOptionsFromApi(apiOption) {
    const url = environment.apiUrl + 'Public/' + apiOption;

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          return response.data.map(option => {
            return {
              ...option
            };
          });
        })
      );
  }

  addOptionToIndexedDb(option: ListOption, apiOption: string) {
    switch (apiOption) {
      case 'listing_types':
        this.listingTypesTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'office_types':
        this.officeTypesTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'office_amenities':
        this.officeAmenitiesTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'currencies':
        this.currenciesTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'countries':
        this.countriesTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'government_id_types':
        this.governmentIdTypesTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'genders':
        this.gendersTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'booking_filter_options':
        this.bookingFilterOptionsTable
          .add(option)
          .catch(e => {
            //alert('Error: ' + (e.stack || e));
            console.error('Error: ' + (e.stack || e));
          });
        break;
      case 'cancel_reasons':
      this.cancelReasonsTable
        .add(option)
        .catch(e => {
          //alert('Error: ' + (e.stack || e));
          console.error('Error: ' + (e.stack || e));
        });
      break;
      default:
        break;
    }
  }

}

