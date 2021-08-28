import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from 'src/app/booking.module/_services/booking.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISpaceAvailablePriceModel } from 'src/app/host.module/_models/space-available-price.model';
import * as moment from 'moment';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-booking-dialog',
  templateUrl: './booking-dialog.component.html',
  styleUrls: ['./booking-dialog.component.scss']
})
export class BookingDialogComponent implements OnInit {
  
  public listing: ListingModel;
  public spacesForm: FormGroup;

  minDateCheckin = moment();
  minDateCheckout = moment();

  defaultTimeCheckin = [];
  defaultTimeCheckout = [];
  
  constructor( 
    public bookingService: BookingService, 
    public dialog: MatDialog, 
    public dialogRef: MatDialogRef<BookingDialogComponent>, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar,
  ) {}

  ngOnInit() { 
    this.spacesForm = new FormGroup({
      availableSpacesPrice: new FormArray([])
    });

    console.info('this.data -- ', this.data);

    this.listing = this.data.listing;

    //this.onChanges();
    this.mapSpacesForm();
    this.setHoursConstraints();
  }

  get availableSpacesPriceControls() {
    return (this.spacesForm.get('availableSpacesPrice') as FormArray).controls;
  }

  private setHoursConstraints() {
    let workingHoursArr = this.listing.hours.availableHours;
    let currentWeekday = moment().format('dddd');
    let currentMinTimestamp = moment();

    //console.info('workingHoursArr ', workingHoursArr);
    //console.info('currentWeekday ', currentWeekday);
    //console.info('currentMinTimestamp ', currentMinTimestamp);
 

    let weekdayWorkingHours = workingHoursArr.filter(item=>item.weekday == currentWeekday.toLowerCase())[0];

    if (weekdayWorkingHours) {
      let weekdayFromHours = weekdayWorkingHours.fromHours;
      let weekdayFromHoursTimestamp = moment().set('hour', parseFloat(weekdayFromHours)).set('minute', 0);

      if(currentMinTimestamp < weekdayFromHoursTimestamp) {
        this.minDateCheckin = weekdayFromHoursTimestamp;
        this.defaultTimeCheckin = weekdayFromHoursTimestamp.format('HH:mm').split(':'); 
      } else {
        let currentMinTimestampPlusOneHour = currentMinTimestamp.add(1, 'hours').set('minute', 0).set('second', 0);
        let minutesDiff = moment.duration(currentMinTimestampPlusOneHour.diff(moment())).abs().minutes();

        console.info('minutesDiff   ', minutesDiff);
        console.info('currentMinTimestampPlusOneHour   ', currentMinTimestampPlusOneHour);
        
        if (minutesDiff >= 30) {
          this.minDateCheckin = currentMinTimestampPlusOneHour;
          this.defaultTimeCheckin = this.minDateCheckin.format('HH:mm').split(':');
        } else {
          this.minDateCheckin = currentMinTimestampPlusOneHour.set('minute', 30);
          this.defaultTimeCheckin = this.minDateCheckin.format('HH:mm').split(':');
        }
      }

      this.minDateCheckout = moment(this.minDateCheckin).add(1, 'hours');
      this.defaultTimeCheckout = this.minDateCheckout.format('HH:mm').split(':');

    }

  }

  private mapSpacesForm() {
    this.listing.price.availableSpacesPrice.map((spacePrice) => {
      (<FormArray>this.spacesForm.get('availableSpacesPrice')).push(
        new FormGroup({
          id: new FormControl(spacePrice.id),
          idOfficeType: new FormControl(spacePrice.idOfficeType),
          officeTypeCode: new FormControl(spacePrice.officeTypeCode),
          availableSpaceName: new FormControl(spacePrice.availableSpaceName),
          idAvailableSpace: new FormControl(spacePrice.idAvailableSpace),
          hourlyPrice: new FormControl(spacePrice.hourlyPrice),
          minHourly: new FormControl(spacePrice.minHourly),
          dayPrice: new FormControl(spacePrice.dayPrice),
          minDay: new FormControl(spacePrice.minDay),
          monthlyPrice: new FormControl(spacePrice.monthlyPrice),
          minMonth: new FormControl(spacePrice.minMonth),
          bookedUnitsNo: new FormControl(1, [Validators.required, Validators.min(1)]),
          checkin: new FormControl('', Validators.required),
          checkout: new FormControl('', Validators.required),
          bookedPrice: new FormControl(null),
          isAvailable: new FormControl(false)
        })
      );
    });
  }

  public directBooking(bookedSpacePrice: ISpaceAvailablePriceModel){
    //console.log(bookedSpacePrice);

    let message, status;

    bookedSpacePrice.bookedGuid = Guid.raw();

    let bookedListing = this.listing;
    bookedListing.bookedSpaces.push(bookedSpacePrice);

    let bookings: ListingModel[] = [];

    bookings.push(bookedListing);

    this.bookingService.bookListings(1, bookings).subscribe((response) => {
      //console.info('book response --- ', response);

      this.spacesForm.reset();

      message = 'Booking success'; 
      status = 'success';          
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });

      this.dialogRef.close();
    },(errorMessage) => {
      console.info('book response --- ', errorMessage);

      message = 'Booking error'; 
      status = 'error';          
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });
    });
  }

  ngOnDestroy() { } 

}
