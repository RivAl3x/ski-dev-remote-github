import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppCommonModule } from '../_core.module/common.module/common.module';
import { SharedModule } from '../_shared/shared.module';
import { HostComponent } from './host.component';
import { AddListingComponent } from './add-listing/add-listing.component';
import { LocationComponent } from './listing-steps/location/location.component';
import { DescriptionComponent } from './listing-steps/description/description.component';
import { PriceComponent } from './listing-steps/price/price.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { HoursComponent } from './listing-steps/hours/hours.component';
import { PaymentComponent } from './listing-steps/payment/payment.component';
import { DocumentsComponent } from './listing-steps/documents/documents.component';
import { InputFileConfig, InputFileModule } from 'ngx-input-file';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
const config: InputFileConfig = {
  fileAccept: '*'
};
import { SortablejsModule } from 'ngx-sortablejs';
import { ListingsComponent } from './listings/listings.component';
import { MenuComponent } from './_components/menu/menu.component';
import { UserMenuComponent } from './_components/user-menu/user-menu.component';
import { MessagesComponent } from './_components/messages/messages.component';
import { BreadcrumbComponent } from './_components/breadcrumb/breadcrumb.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PaymentOptionsComponent } from './payment-options/payment-options.component';
import { PaymentDialogComponent } from './payment-options/payment-dialog/payment-dialog.component';
import { RoleAuthorizeGuard } from '../_core.module/common.module/guards/roleAuthorizeGuard';
import { ButtonLoadingDirective } from '../_core.module/common.module/directives/buttonLoading.directive';
import { HostTermsComponent } from './host-terms/host-terms.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from './_components/map/map.component';
import { BookingsComponent } from './bookings/bookings.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import bootstrapPlugin from '@fullcalendar/bootstrap'; // a plugin
import { BookingsCalendarComponent } from './bookings/bookings-calendar/bookings-calendar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { InhouseBookingComponent } from './inhouse-bookings/inhouse-bookings.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { BookingDialogComponent } from './inhouse-bookings/booking-dialog/booking-dialog.component';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { CancelBookingComponent } from './bookings/cancel-booking/cancel-booking.component';
import { BookingMessageComponent } from '../host.module/bookings/booking-message/booking-message.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  bootstrapPlugin
]);

const routes = [
    {
        path: 'terms', component: HostTermsComponent
    },
    {
        path: '', component: HostComponent,
        canActivate: [RoleAuthorizeGuard],
        data: {
            roles: ['deskhub-host']
        },
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'dashboard' }, 
            { path: 'dashboard', component: DashboardComponent },           
            { path: 'add-listing', component: AddListingComponent },           
            { path: 'add-listing/:id', component: AddListingComponent },
            { path: 'listings', component: ListingsComponent },
            { path: 'bookings', component: BookingsComponent },
            { path: 'bookings/cancel/:id', component: CancelBookingComponent },
            { path: 'bookings-calendar', component: BookingsCalendarComponent },
            { path: 'inhouse-booking', component: InhouseBookingComponent },
            { path: 'payment-options', component: PaymentOptionsComponent },
            { path: 'chat', loadChildren: () => import('.././chat.module/chat.module').then(m => m.ChatModule) },
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AppCommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        //MatGoogleMapsAutocompleteModule,
        InputFileModule.forRoot(config),
        NgxImageGalleryModule,
        SortablejsModule,
        NgxMatTimepickerModule,
        NgxMatDatetimePickerModule,
        NgxMatMomentModule,
        LeafletModule,
        NgxPaginationModule,
        FullCalendarModule,
        NgxSkeletonLoaderModule
    ],
    declarations: [ HostComponent, 
        MenuComponent,
        UserMenuComponent,
        MessagesComponent,
        BreadcrumbComponent,
        HostTermsComponent,
        MapComponent,

        DashboardComponent,
        PaymentOptionsComponent,
        PaymentDialogComponent,
        AddListingComponent, 
        ListingsComponent,
        LocationComponent, DescriptionComponent, PriceComponent, HoursComponent, PaymentComponent, DocumentsComponent,
        BookingsComponent,
        BookingsCalendarComponent,
        CancelBookingComponent,
        BookingMessageComponent,
        InhouseBookingComponent,
        BookingDialogComponent
        
    ],
    exports:[ HostComponent ],
    providers: []
})
export class HostModule { 
    static routes() {
        return routes;
    }
 }
