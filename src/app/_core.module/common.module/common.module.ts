import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SharedModule } from 'src/app/_shared/shared.module';
import { ButtonLoadingDirective } from './directives/buttonLoading.directive';
import { MatTableResponsiveDirective } from './directives/mat-table-responsive/mat-table-responsive.directive';
import { BaseService } from './services/baseService.service';
import { ConfigService } from './services/config.service';
import { CrudService } from './services/crud.service';
import { CurrentUser } from './services/currentuser.service';
import { AppHttpClient } from './services/httpClient.service';
import { LoadingService } from './services/loading.service';
import { StorageService } from './services/storage.service';
import { AppStore } from './services/store.service';

const components = [

  //directives
  ButtonLoadingDirective,
  MatTableResponsiveDirective
];

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [
    RouterModule, 
    BsDropdownModule,
    SharedModule
  ],
  providers: [
    
  ]
})
export class AppCommonModule {

}
