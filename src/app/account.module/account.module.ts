import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InformationComponent } from './information/information.component';
import { AddressesComponent } from './addresses/addresses.component';
import { AddressDialogComponent } from './addresses/address-dialog/address-dialog.component';
import { BookingsComponent } from './bookings/bookings.component';
import { BookingMessageComponent } from './bookings/booking-message/booking-message.component';
import { PaymentsComponent } from './payments/payments.component';
import { PaymentInfoComponent } from './payments/payment-info/payment-info.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap'; // a plugin
import { BookingsCalendarComponent } from './bookings/bookings-calendar/bookings-calendar.component';
import { SecurityComponent } from './security/security.component';
import { CancelBookingComponent } from './bookings/cancel-booking/cancel-booking.component';
import { AffiliationComponent } from './affiliation/affiliation.component';
import { AffiliationDialogComponent } from './affiliation/affiliation-dialog/affiliation-dialog.component';
import { UserSettingsDialogComponent } from './affiliation/user-settings-dialog/user-settings-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HoursUsageComponent } from './_components/hours-usage/hours-usage.component';
import { AffiliationAnalyticsComponent } from './affiliation/analytics/analytics.component';
import { AnalyticsChartComponent } from './affiliation/analytics-chart/analytics-chart.component';
import { SettingsDialogComponent } from './affiliation/settings-dialog/settings-dialog.component';
import { EmailDialogComponent } from './affiliation/email-dialog/email-dialog.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

const routes = [
  { 
      path: '', 
      component: AccountComponent, children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: DashboardComponent},
          { path: 'info', component: InformationComponent },
          { path: 'security', component: SecurityComponent },
          { path: 'affiliation', component: AffiliationComponent },
          { path: 'affiliation/:id', component: AffiliationAnalyticsComponent },
          { path: 'affiliation-chart/:id', component: AnalyticsChartComponent },
          { path: 'addresses', component: AddressesComponent },
          { path: 'bookings', component: BookingsComponent },
          { path: 'bookings/:id', component: CancelBookingComponent },
          { path: 'bookings-calendar', component: BookingsCalendarComponent },
          { path: 'payments', component: PaymentsComponent },
          { path: 'payments/:id', component: PaymentInfoComponent },
      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    FullCalendarModule,
    NgxChartsModule
  ],
  declarations: [
    HoursUsageComponent,
    AccountComponent,
    DashboardComponent,
    InformationComponent,
    SecurityComponent,
    AffiliationComponent,
    SettingsDialogComponent,
    EmailDialogComponent,
    AffiliationDialogComponent,
    UserSettingsDialogComponent,
    AffiliationAnalyticsComponent,
    AnalyticsChartComponent,
    AddressesComponent,
    AddressDialogComponent,
    BookingsComponent,
    CancelBookingComponent,
    BookingMessageComponent,
    PaymentsComponent,
    PaymentInfoComponent,
    BookingsCalendarComponent
  ],
  exports:[]
})
export class AccountModule { 
  static routes() {
    return routes;
  }
}
