import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CurrentUser } from '../services/currentuser.service';

@Injectable()
export class RedirectToDashboardGuard implements CanActivate {
    constructor(private router: Router, private currentUser: CurrentUser) { }

    canActivate() {
        if (this.currentUser.isAuthenticated) {
            // if user is authenticated redirect to dashboard
            this.router.navigate(['/dashboard']);
            return false;
        }
        return true;
    }
}