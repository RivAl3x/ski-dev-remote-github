import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_core.module/auth.module/services/auth.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor( 
      private spinner: NgxSpinnerService,
      private authService: AuthenticationService,
    ) {}
  
    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      if (req.url.indexOf('Search/image') === -1 && req.url.indexOf('/availability') === -1) {
        //console.info('if show spinner req.url: ', req.url);

        this.spinner.show();

        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              this.spinner.hide();
            }
            return event;
          }),
          catchError((err: HttpErrorResponse) => {
            //const started = Date.now();            
            //const elapsed = Date.now() - started;
            //console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);

            this.spinner.hide();

            if (err.status === 401 && req.url.indexOf('Account/billing_address') === -1) {
              this.handle401();
            }
            return throwError(err.error || err.statusText);
          })
        );
      } else {
        //console.info('else no spinner req.url: ', req.url);
        
        return next.handle(req);
      }

    } 
    
    private handle401() {
      console.log('401 returned from api -> tbd');
      this.authService.logout(true);
  }
}