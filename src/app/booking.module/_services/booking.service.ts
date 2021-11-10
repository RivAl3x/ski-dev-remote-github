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
import { MatSnackBar } from '@angular/material/snack-bar';
import { Booking } from '../_model/booking.model';
import { ISpaceAvailablePriceModel } from 'src/app/host.module/_models/space-available-price.model';
import { DexieService } from 'src/app/_core.module/common.module/services/dexie.service';
import { Guid } from 'guid-typescript';


@Injectable({ providedIn: 'root' })
export class BookingService {
    bookingsTable: Dexie.Table<ListingModel, number>;

    public bookingList: ListingModel[] = [];
    public totalPrice = null;
    public totalBookingCount = 0;

    constructor(
        private dexieService: DexieService,
        private apiClient: AppHttpClient,
        public snackBar: MatSnackBar
    ) {
        this.bookingsTable = this.dexieService.table('bookings');

        this.loadLocalBookings();
    }

    loadLocalBookings() {
        this.getLocalBookings().subscribe((response) => {
            // console.info('getLocalBookings response -- ', response);
            this.bookingList = response;

            this.bookingList.forEach( listing => {
                listing.bookedSpaces.map((bookedSpace) => {
                    this.totalPrice = this.totalPrice + bookedSpace.bookedPrice;
                    this.totalBookingCount = this.totalBookingCount + bookedSpace.bookedUnitsNo;
                });
            });
        });
    }

    async addBookingToIndexedDb(booking: ListingModel) {
        booking.id = parseFloat(booking.id);

        let parsedBooking = JSON.parse(JSON.stringify(booking));

        const id = await this.bookingsTable.add(parsedBooking);

        console.info('booking id from add', id);
        return id;
    }

    getLocalBookings(): Observable<any> {
        return from(
          this.getBookingsFromIndexedDb().then(response => {
            // console.info('getBookingsFromIndexedDb', response);
              return response;
          })
       );
    }

    async getBookingsFromIndexedDb() {
        const localBookings = await this.bookingsTable.toArray();

        return localBookings;
    }

    private deleteLocalBooking(id: any) {
        console.info('deleteLocalBooking with id: ', id);
        this.bookingsTable.delete(parseFloat(id)).then(() => {
          console.log(`Booking with local id ${id} deleted from bookingsTable.`);
        });
    }

    public addToBookingList(listing: ListingModel, bookedSpace: ISpaceAvailablePriceModel){
        let message, status;

        this.totalPrice = null;
        this.totalBookingCount = null;

        console.info(listing);

        bookedSpace.bookedGuid = Guid.raw();

        if(this.bookingList.filter(item=>item.id == listing.id)[0]) {
            let item = this.bookingList.filter(item=>item.id == listing.id)[0];
            item.bookedSpaces.push(bookedSpace);
        } else {
            listing.bookedSpaces.push(bookedSpace);
            this.bookingList.push(listing);
        }

        this.bookingList.forEach( listing => {
            listing.bookedSpaces.map((bookedSpace) => {
                this.totalPrice = this.totalPrice + bookedSpace.bookedPrice;
                this.totalBookingCount = this.totalBookingCount + bookedSpace.bookedUnitsNo;
            });

            this.deleteLocalBooking(listing.id);
            this.addBookingToIndexedDb(listing);
        });

        message = 'Your booking has been added to the booking list!';
        status = 'success';
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });
    }

    public removeBookedSpace(listingId, bookedSpace: ISpaceAvailablePriceModel) {
        let message, status;

        this.totalPrice = null;
        this.totalBookingCount = null;

        let item = this.bookingList.filter(item=>item.id == listingId)[0];

        if (item) {
            if (item.bookedSpaces.length < 2) {
                this.deleteLocalBooking(listingId);
            } else {
                item.bookedSpaces.splice(item.bookedSpaces.findIndex(function(i){
                    return i.id === bookedSpace.id;
                }), 1);

                this.deleteLocalBooking(listingId);
                this.addBookingToIndexedDb(item);
            }
        }

        setTimeout(() => this.loadLocalBookings(), 300);

        message = 'Your booking has been deleted!';
        status = 'success';
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });

    }

    public clearBookingList(showFlash: boolean = true) {
        let message, status;

        this.totalPrice = null;
        this.totalBookingCount = null;

        this.bookingsTable.clear();
        setTimeout(() => this.loadLocalBookings(), 300);

        if (showFlash) {
            message = 'Your booking list has been cleared!';
            status = 'success';
            this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });
        }
    }


    public checkAvailability(listing: ListingModel, bookedSpace: ISpaceAvailablePriceModel) {
        const url = environment.apiUrl + 'Search/listing/availablity';

        let payload = {
            listingId: listing.id,
            availableSpaceId: bookedSpace.idAvailableSpace,
            bookedUnitsNo: bookedSpace.bookedUnitsNo,
            checkin: bookedSpace.checkin,
            checkout: bookedSpace.checkout
        }

        console.info('payload -- ', payload);

        return this.apiClient.post(url, payload).pipe(
            catchError(this.handleError),
            map((response: any)  => {
                return response.data;
            })
        );
    }

    public bookListings(billingAddressId: number, bookings: ListingModel[] = this.bookingList){

        console.info(bookings);

        const url = environment.apiUrl + 'book';

        const formData: any = new FormData();

        formData.append('billingAddressId', billingAddressId);
        formData.append('bookings', JSON.stringify(bookings));

        return this.apiClient.post(url, formData, {}, true)
            .pipe(
                catchError(this.handleBookError),
                map((res: any) => {
                   if (res.data.length) {
                       this.mapApiBookingResponse(res.data);
                   }

                   return res.data;
                })
            );
    }

    private mapApiBookingResponse(apiBookedSpaces: ISpaceAvailablePriceModel[]) {
        console.info('apiBookedSpaces ||||| ', apiBookedSpaces);

        let unavailableGuids = [];

        apiBookedSpaces.map((apiSpace: ISpaceAvailablePriceModel) => {
            if (!apiSpace.isAvailable) {
                unavailableGuids.push(apiSpace.bookedGuid);
            }
        });

        this.bookingList.forEach( listing => {
            listing.bookedSpaces.map((bookedSpace) => {
                if (unavailableGuids.includes(bookedSpace.bookedGuid)) {
                    bookedSpace.isAvailable = false;
                }
            });

            this.deleteLocalBooking(listing.id);
            this.addBookingToIndexedDb(listing);
        });

        /* this.bookingList.map((listing) => {
            listing.bookedSpaces.map((bookedSpace) => {
                if (unavailableGuids.includes(bookedSpace.bookedGuid)) {
                    bookedSpace.isAvailable = false;
                }
            });
        }); */
    }

    private handleBookError(errorRes: HttpErrorResponse) {
        let errorCode = errorRes.status;
        return throwError(errorCode);
      }

    private handleError(response: any) {
        let errorMessage = 'An error occured.';

        console.info('response ', response);

        let composedErrorMessage = response.messages.join('<br/>')

        if (!response) {
            return throwError(errorMessage);
        } else {
            return throwError(composedErrorMessage);
        }
    }

}
