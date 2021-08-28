import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpParams,
  HttpHeaders,
  HttpEvent
} from '@angular/common/http';
import { take, exhaustMap } from 'rxjs/operators'; 

import { StorageService } from 'src/app/_core.module/common.module/services/storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class CalendarInterceptor implements HttpInterceptor {
  constructor(
    private localStorage: StorageService,
  ) {}

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.info('CalendarInterceptor !!!!!!!!!!!!');

    const authorizationValue = 'Bearer ' + this.localStorage.get('Token');

    console.info('authorizationValue -- ', authorizationValue);
    
    const modifiedReq = req.clone({
      headers: new HttpHeaders().set('Authorization', authorizationValue)
    });

    return next.handle(modifiedReq);

   /*  if (req.url.indexOf('/calendar') === -1) {
      console.info('if req.url: ', req.url);
      
      return next.handle(req);
    } else {
      console.info('else req.url: ', req.url);

      const authorizationValue = 'Bearer ' + this.localStorage.get('Token');

      console.info('authorizationValue -- ', authorizationValue);

      const modifiedReq = req.clone({
        params: new HttpParams().set('Authorization', authorizationValue)
      });
      return next.handle(modifiedReq);
    } */

  }

}
