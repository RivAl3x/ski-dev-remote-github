import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../_services/listings.service';
import { ListingModel } from '../_models/listing.model';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { MatSelectChange } from '@angular/material/select';
import { IBookedSpaceModel } from 'src/app/account.module/_models/booked-space.model';
import { BookingsService } from '../_services/bookings.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import { FilterBookingsModel } from '../_models/filter-bookings.model';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { BookingMessageComponent } from './booking-message/booking-message.component';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class BookingsComponent implements OnInit {

  public bookings: IBookedSpaceModel[] = [];
  public form: FormGroup;
  public filters: FilterBookingsModel = new FilterBookingsModel();

  pageNumber = 1;
  pageSize = 2;
  totalRecords = 0;

  officeTypes: ListOption[] = [];

  constructor(
    public _bottomSheet: MatBottomSheet,
    private bookingsService: BookingsService,
    public dialog: MatDialog, 
    private localDBService: LocalDBService
  ) { }

  ngOnInit() {
    setTimeout(() => this.loadOfficeTypes(), 500);

    this.initForm();

    console.info('init form', this.form);

    this.loadBookings();
  }

  loadBookings() {

    this.bookingsService.getBookings(this.pageNumber, this.pageSize, this.filters).subscribe((response) => {
      console.info('getBookings response -- ', response);
      
      this.bookings = response.bookings;
      this.totalRecords = response.total;
    });
  }

  public filterSubmit() {

    console.info('this.form.value -- ', this.form.value);

    let startDate = moment(this.form.get('startDate').value).format();
    this.form.get('startDate').patchValue(startDate);

    let endDate = moment(this.form.get('endDate').value).format();
    this.form.get('endDate').patchValue(endDate);

    this.filters = this.form.value;

    this.loadBookings();

  }

  public onPageChanged(event){
    this.pageNumber = event;
    this.loadBookings(); 
  }

  private initForm() {

    let buildingNameMapped = this.filters.buildingName ? this.filters.buildingName : '';
    let officeTypesMapped = this.filters.officeTypes ? this.filters.officeTypes : [];
    let officeNameMapped = this.filters.officeName ? this.filters.officeName : '';
    let startDateMapped = this.filters.startDate ? this.filters.startDate : '';
    let endDateMapped = this.filters.endDate ? this.filters.endDate : '';


    this.form = new FormGroup({
      buildingName: new FormControl(),
      officeTypes: new FormControl(officeTypesMapped),
      officeName: new FormControl(officeNameMapped),
      startDate: new FormControl(startDateMapped),
      endDate: new FormControl(endDateMapped)
    });
  }

  loadOfficeTypes() {
    return this.localDBService.getOfficeTypes().subscribe((response) => {
      this.officeTypes = response;
    });
  }

  openBottomSheet(bookingId): void {
    this._bottomSheet.open(BookingMessageComponent, {
      data: bookingId
    });
  }


}
