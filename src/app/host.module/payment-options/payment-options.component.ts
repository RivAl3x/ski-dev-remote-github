import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service'; 
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { payments } from './payments';
import { AppSettings, Settings } from 'src/app/app.settings';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements OnInit {
  public payments = [];
  public stores = [
    { id: 1, name: 'Store 1' },
    { id: 2, name: 'Store 2' }
  ]
  public countries = [];
  public page: any;
  public count = 6;
  public settings:Settings;

  constructor(
    public appService:AppService, 
    public dialog: MatDialog, 
    public appSettings:AppSettings
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit(): void {
    this.countries = this.appService.getCountries();
    this.payments = payments; 
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }

  public openPaymentDialog(data:any){
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        payment: data,
        stores: this.stores,
        countries: this.countries
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: (this.settings.rtl) ? 'rtl' : 'ltr' 
    });

    dialogRef.afterClosed().subscribe(payment => { 
      if(payment){    
        const index: number = this.payments.findIndex(x => x.id == payment.id);
        if(index !== -1){
          this.payments[index] = payment;
        } 
        else{ 
          let last_payment= this.payments[this.payments.length - 1]; 
          payment.id = last_payment.id + 1;
          this.payments.push(payment);  
        }          
      }
    });
  }

  public remove(payment:any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this payment?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){
        const index: number = this.payments.indexOf(payment);
        if (index !== -1) {
          this.payments.splice(index, 1);  
        } 
      } 
    }); 
  }

}
