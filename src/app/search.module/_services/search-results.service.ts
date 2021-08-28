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
import { AppHttpClient } from 'src/app/_core.module/common.module/services/httpClient.service';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import { ListingLocationModel } from 'src/app/host.module/_models/listing-location.model';
import { ListingDescriptionModel } from 'src/app/host.module/_models/listing-description.model';
import { ListingPriceModel } from 'src/app/host.module/_models/listing-price.model';
import { ListingHoursModel } from 'src/app/host.module/_models/listing-hours.model';
import { ListingPaymentModel } from 'src/app/host.module/_models/listing-payment.model';
import { ListingDocumentsModel } from 'src/app/host.module/_models/listing-documents.model';

@Injectable({ providedIn: 'root' })
export class SearchResultsService {

  constructor(
    private apiClient: AppHttpClient, 
  ) { }

  getSearchResults(filters, extraFilters, pageNumber, pageSize) {
    const url = environment.apiUrl + 'Search/listing/-1';

    console.info('service getSearchResults filters: ', filters);
    console.info('service getSearchResults extraFilters: ', extraFilters);


    let params = new HttpParams();

        params = params.append('pageNumber', pageNumber + '');
        params = params.append('pageSize', pageSize + '');

        /* params = params.append('location', filters.location + '');
        params = params.append('officeTypes', filters.officeTypes + '');
        params = params.append('startDate', filters.startDate + '');
        params = params.append('seatsNo', filters.seatsNo + ''); */

        Object.keys(extraFilters).forEach(k => {
          params = params.append(k, extraFilters[k]);
        });

        //params = params.append('priceLevels', extraFilters.priceLevels + '');

    return this.apiClient.get(url, {params})
      .pipe(
        map((response: any) => {
          return response.data.map((apiListing) => {
            return this.listingApiResponseToModel(apiListing)
          });
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getListingById(id: any = 1) {
    const url = environment.apiUrl + 'Search/listing/' + id;

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          return this.listingApiResponseToModel(response.data[0]);
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getListingsByType(type) {
    const url = environment.apiUrl + 'Search/listing/-1';

    let params = new HttpParams();
        //params = params.append('type', type + '');
        // params = params.append('pageNumber', pageNumber + '');
        // params = params.append('pageSize', pageSize + '');

        /* params = params.append('location', filters.location + '');
        params = params.append('officeTypes', filters.officeTypes + '');
        params = params.append('startDate', filters.startDate + '');
        params = params.append('seatsNo', filters.seatsNo + ''); */

    return this.apiClient.get(url, {params})
      .pipe(
        map((response: any) => {
          return response.data.map((apiListing) => {
            return this.listingApiResponseToModel(apiListing)
          });
        }),
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  getListingImageById(id: any = 1) {
    const url = environment.apiUrl + 'Search/image/' + id;

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

  getListingImagesById(id: any = 1) {
    const url = environment.apiUrl + 'Search/images/' + id;

    return this.apiClient.get(url)
      .pipe(
        map((response: any) => {
          //console.info('getListingImagesById response -- ', response);
          return response.data;
        }),
        catchError(errorRes => {
          console.info('error images: ', errorRes);
          return throwError(errorRes);
        })
      );
  }

  private listingApiResponseToModel(apiListing: any) {

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
        apiListing.description.officeTypes /* ? apiListing.description.officeTypes.map(a => a.id) : [] */,
        apiListing.description.availableSpaces,
        apiListing.description.availableSpacesCount,
        [], //images
        apiListing.description.amenities /* ? apiListing.description.amenities.map(a => a.id) : [] */,
      ),
      new ListingPriceModel(
        apiListing.price ? apiListing.price.idCurrency : 1,
        apiListing.price && apiListing.price.listPrice ? apiListing.price.listPrice : 10,
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

}
