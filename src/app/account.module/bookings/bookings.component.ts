import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatBottomSheet, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { IBookedSpaceModel } from '../_models/booked-space.model';
import { AccountService } from '../_services/account.service';
import { BookingMessageComponent } from './booking-message/booking-message.component';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  public bookings: IBookedSpaceModel[] = [];
  public filters: Array<any> = [];

  pageNumber = 1;
  pageSize = 2;
  totalRecords = 0;
  typeId: number = 0;
  
  constructor(
    private accountService: AccountService, 
    private localDBService: LocalDBService,
    public dialog: MatDialog,
    public _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit() {
    this.loadBookings(this.pageNumber, this.pageSize, this.typeId);
    this.loadBookingFilters();

  }

  loadBookings(pageNumber: number = 1, pageSize: number = 10, type: number = null) {
    this.accountService.getBookings(pageNumber, pageSize, type).subscribe((response) => {
      console.info('getBookings response -- ', response);
      
      this.bookings = response.bookings;
      this.totalRecords = response.total;
    });
  }

  loadBookingFilters() {
    return this.localDBService.getBookingFilters().subscribe((response) => {
      this.filters = response;
      console.info('loadBookingFilters response -- ', response);
    });
  }

  public onPageChanged(event){
    this.pageNumber = event;
    this.loadBookings(this.pageNumber, this.pageSize, this.typeId); 
  }

  public onChangeType(event){
    console.info('onChangeType: ', event);
    this.typeId = event;
    this.pageNumber = 1;
    this.loadBookings(this.pageNumber, this.pageSize, this.typeId);
    console.info('type= ', this.typeId);
  }

  openBottomSheet(bookingId): void {
    this._bottomSheet.open(BookingMessageComponent, {
      data: bookingId
    });
  }

}
