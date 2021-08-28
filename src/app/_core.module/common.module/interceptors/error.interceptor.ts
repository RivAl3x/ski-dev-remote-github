import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppStore } from '../services/store.service';
import { ModalsService } from '../../bootstrap-components.module';
import { StorageService } from '../services/storage.service';
import { AlertsService } from '../services/alerts.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private store: AppStore, private modalService: ModalsService,
        private storage: StorageService, private alertsService: AlertsService) { }

    private modals = {};
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.handle401();
            }
            if (err.status === 403) {
                this.handle401();
            }
            return throwError(err.error.message || err.statusText);
        }));
    }

    private handle401() {
        // auto logout if 401 response returned from api
        console.log('show modal 401');
        if (this.modals['401']) { return; }
        this.modals['401'] = true;
        // user is unauthorized
        if (this.storage.get(this.storage.Keys.RememberMe) === 'true') {
            // add login to renew token
            this.alertsService.showInfo('Token was renewed');
        } else {
            this.modalService.confirm('Not Authorized',
                'Your session is no longer available. Do you want to login again!')
                .option.subscribe(option => {
                    if (option === true) {
                        // this.router.navigateByUrl('/auth/logout');
                        this.store.dispatchAction('logout', {});
                    }
                    // apiHttpCodeResponse['401'] = false;
                    delete this.modals['401'];
                });
        }
    }

    private handle403() {
        if (this.modals['403']) {
            return;
        }

        this.modals['403'] = 'on';
        this.modalService.confirm('Access Forbiden',
            'Your are not authorized to view this resource. Do you want to login with other credentials!')
            .option.subscribe(option => {
                if (option == true) {
                    this.store.dispatchAction('logout', {});
                }
                // apiHttpCodeResponse['403'] = false;
                delete this.modals['403'];
            });
    }
}