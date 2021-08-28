import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingComponent } from './booking.component';
import { SharedModule } from '../_shared/shared.module';
import { SuccessComponent } from './success/success.component';

export const routes = [
  { path: '', component: BookingComponent, pathMatch: 'full' },
  { path: 'success', component: SuccessComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
    BookingComponent,
    SuccessComponent
  ]
})
export class BookingModule { }
