import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { PaymentDialogComponent } from '../../payment-options/payment-dialog/payment-dialog.component';
import { payments } from '../../payment-options/payments';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
  }]
})
export class PaymentComponent implements OnInit {

  @Input() listingForm: FormGroup;

  public payments = [];

  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.payments = payments; 
  }

  public openPaymentDialog(data:any){
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      data: {
        payment: data,
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
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


}
