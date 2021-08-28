import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { CurrentUser } from '../services/currentuser.service';

@Injectable({
    providedIn: 'root'
})
export class RoleAuthorizeGuard implements CanActivate {

    constructor(
        private router: Router, 
        private currentUser: CurrentUser
    ) { }
    
    get host() { 
        return this.currentUser.isHost; 
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log('RoleAuthorizeGuard');
        const userRolesExist = this.currentUser && this.currentUser.user && this.currentUser.user.role && this.currentUser.user.role.length > 0;
        const routeRoles = this.getRolesFromRoute(route).map(r => r.toLocaleLowerCase());

        console.info('AUTHORIZE routeRoles -- ', routeRoles);

        const isAuthorized = userRolesExist && this.currentUser.hasAnyRole(routeRoles);

        if (!isAuthorized) {
            this.router.navigate(['/host/terms']);
            return false;
        }
        return true;
    }

    getRolesFromRoute(route: ActivatedRouteSnapshot): Array<string> {
        if (route && route.data && route.data.roles) {
            if (Array.isArray(route.data.roles)) {
                return route.data.roles || [];
            }
            console.error(`Object 'data.roles' set on route is invalid. Array expected!`);
        } else {
            console.error(`No 'data.roles' object has been set on route!`);
        }
        return null;
    }
}
