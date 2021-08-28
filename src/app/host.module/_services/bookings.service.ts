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
import { FilterBookingsModel } from '../_models/filter-bookings.model';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  

  constructor(
    private apiClient: AppHttpClient, 
  ) { }

  getBookings(pageNumber: number = 1, pageSize: number = 10, filters: FilterBookingsModel) {
    const url = environment.apiUrl + 'Book';

    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber + '');
    params = params.append('pageSize', pageSize + '');
    params = params.append('buildingName', filters.buildingName + '');
    params = params.append('officeTypes', filters.officeTypes + '');
    params = params.append('officeName', filters.officeName + '');
    params = params.append('startDate', filters.startDate + '');
    params = params.append('endDate', filters.endDate + '');

    return this.apiClient.get(url, {params}).pipe(
        map((response: any) => {
            return response.data;
        }),
        catchError(errorRes => {
            return throwError(errorRes);
        })
    );
  }

  getBookingById(id: number) {
    const url = environment.apiUrl + 'Book/' + id;

    return this.apiClient.get(url).pipe(
        map((response: any) => {
            return response.data;
        }),
        catchError(errorRes => {
            return throwError(errorRes);
        })
    );
}

  cancelBooking(id: number, reasonId: number, details: string) {
    const url = environment.apiUrl + 'Book/cancel/' + id;

    const formData: any = new FormData();

    formData.append('reasonId', reasonId);
    formData.append('details', details);

    return this.apiClient.post(url, formData, {}, true).pipe(
      map((response) => {
        return response;
      }),
      catchError(errorRes => {
          return throwError(errorRes);
      })
    );
  }

  private handleError(response: any) {
    let errorMessage = 'An error occured.';

    console.info('response ', response);

    let composedErrorMessage = response.error.messages.join('<br/>')

    if (!response) {
        return throwError(errorMessage);
    } else {
        return throwError(composedErrorMessage);
    }
  }

}

