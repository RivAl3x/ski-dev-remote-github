import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CurrentUser } from '../services/currentuser.service';
import { AuthenticationService } from "../../auth.module/services/auth.service";
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take, switchMap } from 'rxjs/operators';
import { LoginComponent, loginAction } from '../../auth.module/login/login.component';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
    constructor(
        readonly auth: AuthenticationService, 
        private router: Router, 
        private currentUser: CurrentUser,
        private dialog: MatDialog
    ) {}
  
    get authenticated() { 
        return this.currentUser.isAuthenticated; 
    }
  
    public prompt(data: loginAction = 'signIn', returnUrl = '/'): Promise<any> {
  
      return this.dialog.open<LoginComponent, any, any>(LoginComponent, { data: {data, returnUrl} })
        .afterClosed().toPromise();
    }
  
    public authenticate(action: loginAction = 'signIn', returnUrl = '/'): Promise<any> {
  
      return this.currentUser.userSubject.pipe(
        
        take(1),
  
        switchMap( user => !user ? this.prompt(action, returnUrl) : of(user) )
  
      ).toPromise();
    }
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const mode = route.queryParamMap.get('authMode') || 'signIn';

      return this.authenticate(mode as loginAction, state.url)
        .then( user => !!user );
    }
  }