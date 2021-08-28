import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AppCommonModule } from '../_core.module/common.module/common.module';
import { SharedModule } from '../_shared/shared.module';

const routes = [{
    path: '', component: HomeComponent
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AppCommonModule,
        SharedModule
    ],
    declarations: [ HomeComponent ],
    exports:[ HomeComponent ],
    providers: []
})
export class HomeModule { 
    static routes() {
        return routes;
    }
 }
