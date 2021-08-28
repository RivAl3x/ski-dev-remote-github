import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CurrentUser } from '../services/currentuser.service';

@Injectable()
export class RedirectToLoginGuard implements CanActivate {

    constructor(private router: Router, private currentUser: CurrentUser) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // do not redirect to login if no token saved in local browser storage, but query params request automatic report generation (autoGenerate, autoToken). See src\app\fis.summary.module\list\list.component.ts for implementation details
        const value = route.queryParams.autoGenerate;
        if (this.currentUser.isAuthenticated || (value && value === 'true' && route.queryParams.autoToken)) {
            return true;
        }
        // if user is not authenticated redirect to login
        // console.log('RedirectToLoginGuard - Not activate route',  this.sharedStore)
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
