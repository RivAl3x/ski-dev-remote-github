import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../_shared/shared.module';
import { SearchComponent } from './search.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { SearchDetailsComponent } from './search-details/search-details.component';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
import { ImagesComponent } from './_components/images/images.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AppCommonModule } from '../_core.module/common.module/common.module';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { ImagesLoaderComponent } from './_components/images-loader/images-loader.component';
import { ImagesSliderComponent } from './_components/images-slider/images-slider.component';
import { ResultsMapComponent } from './_components/results-map/results-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FiltersDialogComponent } from './_components/filters-dialog/filters-dialog.component';
//import { InformationComponent } from './information/information.component';
//import { AddressesComponent } from './addresses/addresses.component';
//import { OrdersComponent } from './orders/orders.component';

const routes = [
  { 
      path: '', 
      component: SearchComponent, children: [
          { path: '', redirectTo: 'results', pathMatch: 'full' },
          { path: 'results', component: SearchResultsComponent, data: {  breadcrumb: 'Dashboard' } },
          { path: 'results/:id', component: SearchDetailsComponent, data: {  breadcrumb: 'Dashboard' } }
      ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppCommonModule,
    SharedModule,
    ReactiveFormsModule,
    NgxImageGalleryModule,
    NgxSkeletonLoaderModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    LeafletModule,
    InfiniteScrollModule
  ],
  declarations: [
    SearchComponent,
    SearchResultsComponent,
    SearchDetailsComponent,
    ImagesComponent,
    ImagesLoaderComponent,
    ImagesSliderComponent, 
    ResultsMapComponent,
    FiltersDialogComponent
  ],
  providers: [
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  exports:[]
})
export class SearchModule { 
  static routes() {
    return routes;
  }
}
