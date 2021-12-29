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
import { ListingModel } from '../_models/listing.model';
import { DexieService } from 'src/app/_core.module/common.module/services/dexie.service';
import { AppHttpClient } from 'src/app/_core.module/common.module/services/httpClient.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { ListingLocationModel } from '../_models/listing-location.model';
import { ListingDescriptionModel } from '../_models/listing-description.model';
import { ListingPriceModel } from '../_models/listing-price.model';
import { ListingHoursModel } from '../_models/listing-hours.model';
import { ListingPaymentModel } from '../_models/listing-payment.model';
import { ListingDocumentsModel } from '../_models/listing-documents.model';
//16.12.2021
import { SkiSchoolModel } from '../_models/ski-schools.model';

@Injectable({ providedIn: 'root' })
export class ListingsService {
  listingsTable: Dexie.Table<ListingModel, number>;
  listingTypesTable: Dexie.Table<ListOption>;
  officeTypesTable: Dexie.Table<ListOption>;
  officeAmenitiesTable: Dexie.Table<ListOption>;
  currenciesTable: Dexie.Table<ListOption>;
  newListingId: number;
  //27.12.2021
  lessonTypesTable: Dexie.Table<ListOption>;
  //28.12.2021
  public url = environment.url + '/assets/data/';
  apiOptionsArr = [
    'listing_types',
    'office_types',
    'office_amenities',
    'currencies',
    //27.12.2021
    'lesson_types'
  ];

  constructor(
    private apiClient: AppHttpClient,
    private baseHttp: HttpClient,
    private dexieService: DexieService,
    //16.12.2021
    public http:HttpClient
  ) {
    this.listingsTable = this.dexieService.table('listings');

    this.listingTypesTable = this.dexieService.table('listing_types');
    this.officeTypesTable = this.dexieService.table('office_types');
    this.officeAmenitiesTable = this.dexieService.table('office_amenities');
    this.currenciesTable = this.dexieService.table('currencies');
    //27.12.2021
    this.lessonTypesTable = this.dexieService.table('lesson_types');
  }

  async addListingToIndexedDb(listing: ListingModel) {
    const localId = await this.listingsTable.add(listing);
    return localId;

  }

  getLocalListings(): Observable<any> {
    return from(
      this.getListingsFromIndexedDb().then(response => {
        console.info('getListingsFromIndexedDb', response);
          return response;
      })
   );
  }

  //16.12.2021
public getHardCodedListings(): Observable<SkiSchoolModel[]>{
  const url = environment.urlLocal + 'ski-schools.json';
  return this.http.get<SkiSchoolModel[]>(url)
  .pipe(
    map(response => response ),
    catchError(errorRes => {
      return throwError(errorRes);
    })
  );
}
//

  getApiListings() {
    const url = environment.apiUrl + 'Listing/-1';

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          return response.data.map((apiListing) => {
            return apiListing
          });
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getListingByLocalId(id: string): Observable<any> {
    let numberId = parseFloat(id);

    return from(
      this.getListingFromIndexedDb(numberId).then(response => {
        console.info('getListingFromIndexedDb', response);
          return response;
      })
   );
  }

  getListingById(id: any = 1) {
    const url = environment.apiUrl + 'Listing/' + id;

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          return this.listingApiResponseToModel(response.data);
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getListingImagesById(id: any = 1) {
    const url = environment.apiUrl + 'Listing/images/' + id;

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          console.info('getListingImagesById response -- ', response);
          return response.data;
        }),
        catchError(errorRes => {
          console.info('error images: ', errorRes);
          return throwError(errorRes);
        })
      );
  }

  async getListingsFromIndexedDb() {
    const localListings = await this.listingsTable.toArray();

    return localListings;
  }

  async getListingFromIndexedDb(localId: number) {
    const listing = await this.listingsTable.get(localId);

    return listing;
  }

  saveListingToIndexedDb(localId: string, listing: ListingModel) { //primeste localId si obiectul {listing} cu toate valorile din  listingForm trimise din add-listing.ts la onStepChange
    console.info('id for idexedDb: ', localId);
    this.listingsTable      // proprietatea listingTable de tip Dexie.Table<ListingModel, number>, cu id si {obj}
      .update(parseFloat(localId), listing) //obiectul identificat in colectie cu localId si updatat cu noul obiect mai complet la fiecare pas  :)
      .then(async (response) => { //then, cu succes si error  /  async  returneaza un Promise
        console.info('add to listingTable response', response);
        const allItems: ListingModel[] = await this.listingsTable.toArray(); //The await operator is used to wait for a Promise.  ---- toArray()->A function that returns an Observable that emits an array of items
        console.log('saved in listingTable, listingTable is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }

  deleteLocalListing(id: any) {
    console.info('deleteLocalListing with id: ', id);
    this.listingsTable.delete(parseFloat(id)).then(() => {
      console.log(`Listing with local id ${id} sent to api and deleted locally.`);
    });
  }

  saveListing(listing, localId, idStatus) {
    this.sendListingToApi(listing, idStatus).subscribe((response) => {
      const apiId = response.data.id;

      if (listing.description.images.length) {
        this.sendListingImagesToApi(apiId, listing).subscribe(() => {
          //delete revision from local db
          if (localId) {
            this.listingsTable.delete(parseFloat(localId)).then(() => {
              console.log(`has images - Listing with local id ${localId} sent to api and deleted locally.`);
            });
          }
        })
      } else {
        //delete revision from local db
        if (localId) {
          this.listingsTable.delete(parseFloat(localId)).then(() => {
            console.log(`no images - Listing with local id ${localId} sent to api and deleted locally.`);
          });
        }

      }
    }, (error) => {
      console.log('Send listing error: ', error );
    });
  }

  deleteApiListing(id: any) {
    const url = environment.apiUrl + 'Listing/' + id;

    return this.apiClient.delete(url)
      .subscribe((response) => {
        return response;
      });
  }

  sendListingToApi(listing: ListingModel, idStatus: any) {

    const url = environment.apiUrl + 'Listing';

    const formData: any = new FormData();

    let listingData = this.transformListingForApiPost(listing, idStatus);

    formData.append('json', JSON.stringify(listingData));


    return this.apiClient.post(url, formData, {}, true)
        .pipe(
          catchError(this.handleSaveListingError),
          map((res: any) => {
            return res;
          })
        );
  }

  sendListingImagesToApi(id, listing: ListingModel) {

    const url = environment.apiUrl + 'Listing/images/save';

    let payload = {
      'id': id,
      'images': listing.description.images
    }

    const formData: any = new FormData();

    formData.append('listingId', id);
    formData.append('images', JSON.stringify(listing.description.images));

    return this.apiClient.post(url, formData, {}, true)
        .pipe(
          catchError(this.handleSaveListingError),
          map((res: any) => {
            return res;
          })
        );
  }

  private handleSaveListingError(errorRes: HttpErrorResponse) {
    let errorCode = errorRes.status;
    return throwError(errorCode);
  }

  private transformListingForApiPost(localListing: ListingModel, idStatus: any) {

    let transformedListing = {
      'id': localListing.id,
      'idStatus': idStatus,
      'location': {
        'name': localListing.location.name,
        'streetAddress': localListing.location.streetAddress,
        'apartmentSuite': localListing.location.apartmentSuite,
        'locality': localListing.location.locality,
        'state': localListing.location.state,
        'zipCode': localListing.location.zipCode,
        'idCountry': localListing.location.idCountry,
        'latitude': localListing.location.latitude,
        'longitude': localListing.location.longitude,
        'listingId': localListing.location.listingType,
      },
      'description': {
        'description': localListing.description.description,
        'officeTypes': localListing.description.officeTypes.map(a => {return {'id': a}}),
        'availableSpaces': localListing.description.availableSpaces,
        'amenities': localListing.description.amenities.map(a => {return {'id': a}}),
      },
      'price': {
        'idCurrency': localListing.price.currency,
        'availableSpacesPrice': localListing.price.availableSpacesPrice,
      },
      'hours': {
        'availableHours': localListing.hours.availableHours,
        'fromHours': localListing.hours.fromHours,
        'toHours': localListing.hours.toHours,
        'differentHours': localListing.hours.differentHours,
        'satOpen': localListing.hours.satOpen,
        'sunOpen': localListing.hours.sunOpen
      },
      'payment': {
        'id': localListing.payment.id
      }
    };

    return transformedListing;

  }

  private listingApiResponseToModel(apiListing: any) {

    console.info('apiListing -------------- ', apiListing);

    let listing = new ListingModel(
      apiListing.id,
      '', //localId
      apiListing.idStatus,
      apiListing.statusCode,
      apiListing.modifiedDate,
      new ListingLocationModel(
        apiListing.location.name,
        apiListing.location.streetAddress,
        apiListing.location.apartmentSuite,
        apiListing.location.locality,
        apiListing.location.state,
        apiListing.location.zipCode,
        apiListing.location.idCountry,
        apiListing.location.country,
        { id: apiListing.location.idCountry, name: apiListing.location.country },
        apiListing.location.latitude,
        apiListing.location.longitude,
        apiListing.location.listingId,
        apiListing.location.listingType,
      ),
      new ListingDescriptionModel(
        apiListing.description.description,
        apiListing.description.officeTypes ? apiListing.description.officeTypes.map(a => a.id) : [],
        apiListing.description.availableSpaces,
        apiListing.description.availableSpacesCount,
        [], //images
        apiListing.description.amenities ? apiListing.description.amenities.map(a => a.id) : [],
      ),
      new ListingPriceModel(
        apiListing.price ? apiListing.price.idCurrency : 1,
        apiListing.price ? apiListing.price.listPrice : 0,
        apiListing.price ? apiListing.price.availableSpacesPrice : [],
      ),
      new ListingHoursModel(
        apiListing.hours ? apiListing.hours.availableHours : '',
        apiListing.hours ? apiListing.hours.fromHours : '',
        apiListing.hours ? apiListing.hours.toHours : '',
        apiListing.hours ? apiListing.hours.differentHours : '',
        apiListing.hours ? apiListing.hours.satOpen : '',
        apiListing.hours ? apiListing.hours.sunOpen : ''
      ),
      new ListingPaymentModel(
        apiListing.payment.id,
      ),
      new ListingDocumentsModel()
    );

    return listing;
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
  //27.12.2021
  getLessonTypes(): Observable<any> {
    return from(
      this.getOptionsFromIndexedDB('lesson_types').then(response => {
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
        //27.12.2021

        case 'lesson_types':
          const lessonTypes: ListOption[] = await this.lessonTypesTable.toArray();
          return lessonTypes;
          break;

      default:
        break;
    }
  }

  syncListOptions() { //nu e chemata nicaieri
    this.listingTypesTable.clear();
    this.officeTypesTable.clear();
    this.officeAmenitiesTable.clear();
    this.currenciesTable.clear();
    //27.12.2021
    // this.lessonTypesTable.clear();

    this.apiOptionsArr.map((apiOption) => {
      this.getOptionsFromApi2(apiOption).subscribe(  //schimbat provizoriu cu 2
        options => {
          options.map((option: ListOption) => {
            this.addOptionToIndexedDb(option, apiOption);
            console.log(option, "OPTION");

          });
        }
      );
    })

  }
//   public getSkiSchools(): Observable<SkiSchoolModel[]>{
//     return this.http.get<SkiSchoolModel[]>(this.url + 'ski-schools.json')
//     .pipe(
//       map(response => response ),
//       catchError(errorRes => {
//         return throwError(errorRes);
//       })
//     );
// }

getOptionsFromApi2(apiOption) {
  const url = environment.urlLocal + 'lesssons-type.json' ;
  console.log(url);


  return this.http.get(url)
    .pipe(
      map((response: any) => {
        console.log(response, "RESPONSE");

        return response.data.map(option => {
          return {
            ...option
          };
        });
      })
    );
}



  getOptionsFromApi(apiOption) {
    const url = environment.apiUrl + 'SP/comm.ctrl_' + apiOption;

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
    console.log(option, "OPTION");

    switch (apiOption) {
      case 'listing_types':
        this.listingTypesTable
          .add(option)
          .catch(e => {
            alert('Error: ' + (e.stack || e));
          });
        break;
      case 'office_types':
        this.officeTypesTable
          .add(option)
          .catch(e => {
            alert('Error: ' + (e.stack || e));
          });
        break;
      case 'office_amenities':
        this.officeAmenitiesTable
          .add(option)
          .catch(e => {
            alert('Error: ' + (e.stack || e));
          });
        break;
      case 'currencies':
        this.currenciesTable
          .add(option)
          .catch(e => {
            alert('Error: ' + (e.stack || e));
          });
        break;
        //27.12.2021
        case 'lesson_types':
          this.lessonTypesTable
            .add(option)
            .catch(e => {
              alert('Error: ' + (e.stack || e));
            });
          break;

      default:
        break;
    }
  }
  //start 27.12.2021
  public getListingsForCards(): Observable<SkiSchoolModel[]>{
    const url = environment.urlLocal + 'ski-schools.json';
    return this.http.get<SkiSchoolModel[]>(url)
    .pipe(
      map((response: any) => {
        console.info("getListingsForCards din listing.service.ts",response)
        return response;
      }),

      catchError(errorRes => {
        return throwError(errorRes);
      })
    );
  }
//


}

