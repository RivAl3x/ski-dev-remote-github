import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from "../../auth.module/services/auth.service";
import { env } from 'process';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthenticationService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        //if (request.url.indexOf('Account/billing_address') === -1) {
            return next.handle(request).pipe(catchError(err => {
                if (err.status === 401 && request.url.indexOf('Account/billing_address') === -1) {
                    this.handle401();
                }
                return throwError(err.error || err.statusText);
            }));
        //}
    }

    private handle401() {
        console.log('401 returned from api -> tbd');
        this.authService.logout(true);
    }

}