import { LoginComponent } from './login/login.component';
import { Routes } from '@angular/router';
import { RedirectToDashboardGuard } from '../common.module/guards/redirectToDashboardGuard';

export const routes: Routes = [
    {
        path: 'auth',

        children: [
            // login path
            {
                path: 'login', component: LoginComponent,
            }
        ]
    }
];