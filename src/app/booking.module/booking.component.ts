import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AddressDialogComponent } from '../account.module/addresses/address-dialog/address-dialog.component';
import { AccountService } from '../account.module/_services/account.service';
import { ISpaceAvailablePriceModel } from '../host.module/_models/space-available-price.model';
import { AuthenticationService } from '../_core.module/auth.module/services/auth.service';
import { AuthGuard } from '../_core.module/common.module/guards/authGuard';
import { CurrentUser } from '../_core.module/common.module/services/currentuser.service';
import { LocalDBService } from '../_core.module/common.module/services/localDb.service';
import { BookingService } from './_services/booking.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
  }]
})
export class BookingComponent implements OnInit {
  public addresses = [];
  public affiliatedAddresses = [];
  public countries = [];
  public billingAddressId = null;

  constructor(
    public bookingService: BookingService,
    public accountService: AccountService,
    public dialog: MatDialog,
    private localDBService: LocalDBService,
    public snackBar: MatSnackBar,
    public router: Router,
    public authGuard: AuthGuard,
    public currentUser: CurrentUser
  ) { }

  ngOnInit() {
    this.loadCountries();

    if (this.authGuard.authenticated) {
      this.loadBillingAddresses();
      this.loadAffiliatedBillingAddresses();
    }
  }

  getDefaultAddress(addresses) {
    let address = addresses.filter(item=>item.isDefault == true)[0];

    return address.id;
  }

  public confirmBooking() {
    let message, status;

    this.bookingService.bookListings(this.billingAddressId).subscribe((response) => {
      console.info('booking response --- ', response);

      if (response.length) {
        message = 'Booking unavailable'; 
        status = 'warning';          
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });

      } else {
        message = 'Booking success'; 
        status = 'success';          
        this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });

        this.router.navigate(['/booking/success']);
        this.bookingService.clearBookingList(false);
      }

    },(errorMessage) => {
      console.info('booking error response --- ', errorMessage);

      message = 'Booking error'; 
      status = 'error';          
      this.snackBar.open(message, '×', { panelClass: [status], verticalPosition: 'bottom', duration: 5000 });
    });
  }

  public openAddressDialog(data:any){
    const dialogRef = this.dialog.open(AddressDialogComponent, {
      data: {
        address: data,
        countries: this.countries
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    dialogRef.afterClosed().subscribe(address => { 
      if(address) {    
        const index: number = this.addresses.findIndex(x => x.id == address.id);
        let message = index !== -1 ? 'Billind address added.' : 'Billing address updated.'
        
        this.accountService.saveBillingAddress(address)
          .subscribe((response) => {
            this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            setTimeout(() => this.loadBillingAddresses(), 300);
          },(error) => {
            this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          });        
      }
    });
  }

  public remove(listingId, bookedSpace: ISpaceAvailablePriceModel) {
    this.bookingService.removeBookedSpace(listingId, bookedSpace);   
  }

  public clear(){
    this.bookingService.clearBookingList();  
  }

  loadBillingAddresses() {
    this.accountService.getBillingAddresses().subscribe((response) => {
      console.info('getBillingAddresses response -- ', response);
      
      this.addresses = response;
      this.billingAddressId = this.getDefaultAddress(response);
    });
  }

  loadAffiliatedBillingAddresses() {
    this.accountService.getBillingAddresses().subscribe((response) => {
      console.info('getBillingAddresses response -- ', response);
      
      this.affiliatedAddresses = response;
    });
  }

  loadCountries() {
    return this.localDBService.getCountries().subscribe((response) => {
      this.countries = response;
      console.info('loadCountries response -- ', response);
    });
  }

}
