import { Injectable } from "@angular/core";
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import { LoadingService } from "./loading.service";
import { Observable } from "rxjs";
import { map, catchError, finalize } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class HTTPListener implements HttpInterceptor {
    constructor(private loadingService: LoadingService) { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        //console.log("###$$$$$$####Http intercepted", req);
        this.loadingService.startLoading();
        return next.handle(req).pipe(
            map(event => {
                return event;
            }),
            catchError(error => {
                this.loadingService.stopLoading();
                return Observable.throw(error);
            }),
            finalize(() => {
                this.loadingService.stopLoading();
            })
        )
    }
}