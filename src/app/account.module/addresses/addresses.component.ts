import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../app.service';
import { MatDialog } from '@angular/material/dialog';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { AccountService } from '../_services/account.service';
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  public addresses = [];
  public affiliatedAddresses = [];
  public countries = [];

  constructor(
    public localDBService: LocalDBService, 
    public formBuilder: FormBuilder, 
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private accountService: AccountService, 
    public currentUser: CurrentUser 
  ) { }

  ngOnInit() {
    this.loadCountries();
    this.loadBillingAddresses();
    this.loadAffiliatedBillingAddresses();
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
        console.info('address afterClosed -- ', address);

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

  setAsDefault(address) {
    address.isDefault = true;

    this.accountService.saveBillingAddress(address).subscribe((response) => {
      this.snackBar.open('Address set as default!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
      setTimeout(() => this.loadBillingAddresses(), 300);
    },(error) => {
      this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
    });
  }

  public remove(address:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this address?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        this.accountService.deleteBillingAddress(address.id);
        setTimeout(() => this.loadBillingAddresses(), 300);
      } 
    }); 
  }

  loadBillingAddresses() {
    this.accountService.getBillingAddresses().subscribe((response) => {
      console.info('getBillingAddresses response -- ', response);
      
      this.addresses = response;
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
