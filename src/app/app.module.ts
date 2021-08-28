import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AgmCoreModule } from '@agm/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
export function HttpLoaderFactory(httpClient: HttpClient) { 
  return new TranslateHttpLoader(httpClient, environment.url +'/assets/i18n/', '.json');
}

import { OverlayContainer, Overlay } from '@angular/cdk/overlay';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';

import { CustomOverlayContainer } from './_theme/utils/custom-overlay-container';
import { menuScrollStrategy } from './_theme/utils/scroll-strategy';

import { AppInterceptor } from './_theme/utils/app-interceptor';
import { AppSettings } from './app.settings';
import { AppService } from './app.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home.module/home.module';
import { AccountModule } from './account.module/account.module';
import { SharedModule } from './_shared/shared.module';

import { AppComponent } from './app.component';
import { MainComponent } from './_theme/components/main/main.component';
import { TopMenuComponent } from './_theme/components/top-menu/top-menu.component';
import { MenuComponent } from './_theme/components/menu/menu.component';
import { SidenavMenuComponent } from './_theme/components/sidenav-menu/sidenav-menu.component';
import { BreadcrumbComponent } from './_theme/components/breadcrumb/breadcrumb.component';
import { OptionsComponent } from './_theme/components/options/options.component';
import { FooterComponent } from './_theme/components/footer/footer.component';

import { environment } from '../environments/environment';
import { AppCommonModule } from './_core.module/common.module/common.module';
import { CommonModule } from '@angular/common';
import { AuthModule } from './_core.module/auth.module/auth.module';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
//import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import { InputFileConfig, InputFileModule } from 'ngx-input-file';
import { NgxImageGalleryModule } from 'ngx-image-gallery';
const config: InputFileConfig = {
  fileAccept: '*'
};
import { SortablejsModule } from 'ngx-sortablejs';
import { AuthInterceptor } from './_core.module/common.module/interceptors/auth.interceptor';
import { SearchModule } from './search.module/search.module';
import { SearchHeaderComponent } from './search.module/_components/search-header/search-header.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import {
  NgxMatDatetimePickerModule, 
  NgxMatTimepickerModule 
} from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NgxPaginationModule } from 'ngx-pagination';
import { CalendarInterceptor } from './account.module/_helpers/calendar-sources.inteceptor';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ChatModule } from './chat.module/chat.module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    //NotFoundComponent,
    TopMenuComponent,
    MenuComponent,
    SidenavMenuComponent,
    BreadcrumbComponent,
    OptionsComponent,
    FooterComponent,
    SearchHeaderComponent
  ],
  imports: [
    //BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule,
    NgxPaginationModule,
    InfiniteScrollModule,
    
    /* AgmCoreModule.forRoot({
      apiKey: ''
    }),
    MatGoogleMapsAutocompleteModule, */
    LeafletModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatMomentModule,
    MatMomentDateModule,
    SortablejsModule.forRoot({ animation: 150 }),
    NgxImageGalleryModule,
    InputFileModule.forRoot(config),
    MatPasswordStrengthModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,

    //App Modules
    AuthModule,
    SharedModule,
    AppCommonModule,
    HomeModule,
    AccountModule,
    SearchModule,
    ChatModule
  ],
  providers: [
    AppSettings,
    AppService,   
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    //{ provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay] },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    /* { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, */
    { provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true} }
    //{ provide: HTTP_INTERCEPTORS, useClass: CalendarInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
