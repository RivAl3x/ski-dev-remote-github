import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Product, Category } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import { SearchResultsService } from '../_services/search-results.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from 'src/app/booking.module/_services/booking.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISpaceAvailablePriceModel } from 'src/app/host.module/_models/space-available-price.model';
import { Moment, now } from 'moment';
import * as moment from 'moment';
import { merge, Observable } from 'rxjs';
import { AuthGuard } from 'src/app/_core.module/common.module/guards/authGuard';
import { AccountService } from 'src/app/account.module/_services/account.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.scss']
})
export class SearchDetailsComponent implements OnInit {
  private sub: any;
  public settings: Settings;
  public listing: ListingModel;
  public spacesForm: FormGroup;

  addresses = [];
  billingAddressId = null;

  images = [];
  loadingImages: boolean;

  minDateCheckin = moment();
  minDateCheckout = moment();

  defaultTimeCheckin = [];
  defaultTimeCheckout = [];
  
  constructor(
    public appSettings:AppSettings, 
    private activatedRoute: ActivatedRoute, 
    public bookingService: BookingService, 
    public dialog: MatDialog, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchResultsService: SearchResultsService,
    public snackBar: MatSnackBar,
    readonly guard: AuthGuard,
    private accountService: AccountService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() { 
  
    if (this.guard.authenticated) {
      this.loadBillingAddresses();
    }

    this.loadingImages = true;

    this.spacesForm = new FormGroup({
      availableSpacesPrice: new FormArray([])
    });
    
    this.sub = this.activatedRoute.params.subscribe(params => { 
      this.getListingById(params['id']); 
    }); 

    this.onChanges();
  }

  public getListingById(id){
    this.searchResultsService.getListingById(id).subscribe((listingResponse) => {
      this.listing = listingResponse;
      this.mapSpacesForm();
      this.setHoursConstraints();
      
      this.searchResultsService.getListingImagesById(id).subscribe((imagesResponse) => {
        imagesResponse.map((apiImage) => {
            this.images.push(apiImage);
        });

        this.loadingImages = false;
      });
     
    });
  }

  get availableSpacesPriceControls() {
    return (this.spacesForm.get('availableSpacesPrice') as FormArray).controls;
  }

  onChanges(): void {
    this.spacesForm.get('availableSpacesPrice').valueChanges.subscribe(values => {
      this.availableSpacesPriceControls.map((availableSpacePrice) => {

        /* let checkin = availableSpacePrice.get('checkin').value;

        if (checkin) {
          this.minDateCheckout = moment(checkin).add(1, 'hours');
          this.defaultTimeCheckout = checkin.format('HH:mm').split(':');
        } */
      
        if (availableSpacePrice.valid) {

          /* let hourlyPrice = availableSpacePrice.get('hourlyPrice').value;
          let dayPrice = availableSpacePrice.get('dayPrice').value;
          let bookedUnitsNo = availableSpacePrice.get('bookedUnitsNo').value;
          let checkin = availableSpacePrice.get('checkin').value;
          let checkout = availableSpacePrice.get('checkout').value;

          let duration = moment.duration(checkout.diff(checkin)).abs();
          let bookedDays = duration.days();
          let bookedHours = duration.hours();

          let bookedPrice = bookedUnitsNo*(bookedDays*dayPrice+bookedHours*hourlyPrice);

          availableSpacePrice.get('bookedPrice').patchValue(bookedPrice, { emitEvent: false }); */

          console.info('onChanges from value: ', availableSpacePrice.value);

          this.checkAvailability(availableSpacePrice.value);
        }
      });
      
    });
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

  mapSpacesForm() {
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

  public checkAvailability(bookedSpacePrice: ISpaceAvailablePriceModel){
    console.log('checkAvailability called with bookedSpacePrice: ', bookedSpacePrice);

    /* this.availableSpacesPriceControls.map((spacePrice) => {
      spacePrice.get('isAvailable').patchValue(true, { emitEvent: false });
    }); */

    this.bookingService.checkAvailability(this.listing, bookedSpacePrice).subscribe((response) => {
      console.info('checkAvailability response: ', response);

      this.availableSpacesPriceControls.map((spacePrice) => {
        if (spacePrice.get('id').value == bookedSpacePrice.id) {
          console.info('found spacePrice id: ', spacePrice.get('id').value);
          
          spacePrice.get('isAvailable').patchValue(response.available, { emitEvent: false });
          spacePrice.get('bookedPrice').patchValue(response.price, { emitEvent: false });
        }
      });
    });
  }

  public addToBookingList(bookedSpacePrice: ISpaceAvailablePriceModel){
    //console.log(bookedSpacePrice);
    this.bookingService.addToBookingList(this.listing, bookedSpacePrice);
  }

  public directBooking(bookedSpacePrice: ISpaceAvailablePriceModel){
    //console.log(bookedSpacePrice);

    let message, status;

    bookedSpacePrice.bookedGuid = Guid.raw();

    let bookedListing = this.listing;
    bookedListing.bookedSpaces.push(bookedSpacePrice);

    let bookings: ListingModel[] = [];

    bookings.push(bookedListing);

    this.bookingService.bookListings(this.billingAddressId, bookings).subscribe((response) => {
      //console.info('book response --- ', response);

      this.spacesForm.reset();

      message = 'Booking success'; 
      status = 'success';          
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });

      this.router.navigate(['/booking/success']);
    },(errorMessage) => {
      console.info('book response --- ', errorMessage);

      message = 'Booking error'; 
      status = 'error';          
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });
    });
  }

  loadBillingAddresses() {
    this.accountService.getBillingAddresses().subscribe((response) => {
      //console.info('getBillingAddresses response -- ', response);
      
      this.addresses = response;
      this.billingAddressId = this.getDefaultAddress(response);
    });
  }

  getDefaultAddress(addresses) {
    let address = addresses.filter(item=>item.isDefault == true)[0];

    return address.id;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 

}
