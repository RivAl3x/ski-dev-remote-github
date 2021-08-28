import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppCommonModule } from '../_core.module/common.module/common.module';
import { SharedModule } from '../_shared/shared.module';
import { ChatComponent } from './chat.component';
import { FormsModule } from '@angular/forms';

const routes = [{
    path: '', component: ChatComponent
}];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AppCommonModule,
        SharedModule,
        FormsModule
    ],
    declarations: [ ChatComponent ],
    exports:[ ChatComponent ],
    providers: []
})
export class ChatModule { 
    /* static routes() {
        return routes;
    } */
 }
