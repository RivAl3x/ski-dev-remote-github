import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PaymentOptionsComponent } from './payment-options.component';
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { SharedModule } from 'src/app/_shared/shared.module';

export const routes = [
  { path: '', component: PaymentOptionsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    PaymentOptionsComponent,
    PaymentDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class PaymentOptionsModule { }
