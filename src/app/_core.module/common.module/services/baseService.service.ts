import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { ApiResponseModel } from '../models/ApiResponseModel';
//import { Response, URLSearchParams } from '@angular/http';

import { Observable, of, throwError } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { AppStore } from './store.service';
//import { ModalsService} from '../../bootstrap-components.module';
import { AppHttpClient } from './httpClient.service';
import { ConfigService } from './config.service';
import { CurrentUser } from './currentuser.service';
import { Inject, Injectable } from '@angular/core';
import { appInjector } from '../utils/appInjector';

const modals: any = {};

@Injectable()
export class BaseService { // base service can do following:
    protected apiHostUrl;
    private httpClient: AppHttpClient; // make requests to server
    public storage: StorageService; // store data in storage
    protected router: Router; // redirect to routes
    //private modalsService: ModalsService; // issue modals
    protected loading: LoadingService; // show loading spinner while waiting for response from server (neccessay or not???)
    protected appStore: AppStore; // have access to AppStore for saving data, dispatching events, etc

    constructor(@Inject('hostUrl') hostUrl?: string) {
        this.httpClient = this.httpClient;
        this.storage = this.storage;
        this.router = this.router;
        //this.modalsService = //this.modalsService;
        this.loading = this.loading;
        this.appStore = this.appStore;

        this.apiHostUrl = this.apiHostUrl;
    }


    private _currentUser: CurrentUser;
    public get currentUser(): CurrentUser {
        if (!this._currentUser) {
            this._currentUser = CurrentUser.instance;
        }
        return this._currentUser;
    }

    public anonymousrequest(method: string, url: string, options?, body?, errorHandler?) {
        this.loading.startLoading();
        let request = new Observable<Response | ApiResponseModel | any>();
        switch (method.toLowerCase()) {
            case 'get': {
                request = this.httpClient.anonymousGet(url, options);
                break;
            }
            case 'post': {
                request = this.httpClient.anonymousPost(url, body, options);
                break;
            }
            default: break;
        }

        return request.pipe(
            map(response => {
                return this.getApiResponseModel(response);
            }),
            tap(data => {
                this.loading.stopLoading();
            }),
            catchError((error) => {
                console.log('Base Service Error', error);
                if (errorHandler) {
                    errorHandler(error);
                } else {
                    this.handleError(error);
                }
                return Observable.throw(error);
            }),
            finalize(() => {
                this.loading.stopLoading();
            }));
    }

    private handleError(error) {
        const apiResponse = this.getErrorApiResponseModel(error.error);
        if (error) {
            switch (error.status) {
                case 401: {
                    //this.showModal401();
                    break;
                }
                case 403: {
                    //this.showModal403();
                    break;
                }
                case 404: {
                    apiResponse.messages = ['The resource was not found.', ...apiResponse.messages];
                    //this.alertsService.showError(apiResponse.messages.join(' '));
                    //this.alertsService.showFromApiResponse(apiResponse);
                    break;
                }
                default: {
                    //const apiResponse = this.getErrorApiResponseModel(error);
                    // if don't have rights to access this resource navigate to  dashboard
                    if (apiResponse.appErrorCode === 9002) {
                        //this.alertsService.showWarning(apiResponse.messages.join(' '));
                        this.router.navigateByUrl('/dashboard');
                    } else
                        if (apiResponse.appErrorCode === 9001) {
                            //this.alertsService.showInfo('You don\'t have any company selected.< br /> You can select one by pressing on button on top right corner!')
                        } else {
                            //this.alertsService.showFromApiResponse(apiResponse);
                        }
                    break;
                }
            }
        }
    }

    /* private showModal403() {
        if (modals['403']) return;

        modals['403'] = 'on';
        this.modalsService.confirm('Access Forbiden',
            'Your are not authorized to view this resource. Do you want to login with other credentials!')
            .option.subscribe(option => {
                if (option == true) {
                    this.router.navigateByUrl('/auth/logout');
                }
                delete modals['403'];
            });

    }

    private showModal401() {
        if (modals['401']) return;
        modals['401'] = true;
        // user is unauthorized
        if (this.storage.get(this.storage.Keys.RememberMe) == 'true') {
            // add login to renew token
            this.alertsService.showInfo('Token was renewed');
        } else {
            this.modalsService.confirm('Not Authorized',
                'Your session is no longer available. Do you want to login again!')
                .option.subscribe(option => {
                    if (option == true) {
                        this.router.navigateByUrl('/auth/logout');
                    }
                    delete modals['401'];
                });
        }
    } */

    public apirequest(method: string, url: string, options?, body?, hasFiles = false, handleError = true): Observable<any> {
        this.loading.startLoading();
        let request = new Observable<Response | any>();
        switch (method.toLowerCase()) {
            case 'get': {
                request = this.httpClient.get(url, options);
                break;
            }
            case 'post': {
                request = this.httpClient.post(url, body, options, hasFiles);
                break;
            }
            case 'put': {
                request = this.httpClient.put(url, body, options, hasFiles);
                break;
            }
            case 'delete': {
                request = this.httpClient.delete(url, options);
                break;
            }
            default:
                Observable.throw(new Error('Http method not allowed!'));
                break;
        }

        return request.pipe(
            map(response => {
                tap(d => this.loading.stopLoading());
                return this.getApiResponseModel(response);
            }),
            catchError((error) => {
                this.loading.stopLoading();
                if (handleError) {
                    this.handleError(error);
                }
                return throwError(error);
            }),
            finalize(() => {
                this.loading.stopLoading();
            }));
    }

    protected createErrorResponse(messages: Array<any>) {
        const response = new ApiResponseModel();
        response.messages = messages;
        return of(response);
    }

    protected createSuccessResponse(messages: Array<any>) {
        const response = new ApiResponseModel();
        response.messages = messages;
        return Observable.create(response);
    }

    protected createSuccessDataResponse(data: any) {
        const response = new ApiResponseModel();
        response.messages = [];
        response.data = data;
        return of(response);
    }

    protected createSuccessObservable(obj: any) {
        return of(obj);
    }

    public getErrorApiResponseModel(errorResponse): ApiResponseModel {
        return ApiResponseModel.fromResponse(errorResponse);
    }

    public getApiResponseModel(response): ApiResponseModel {
        // let responseResult = new ApiResponseModel();
        // return responseResult.create(response);
        return ApiResponseModel.fromResponse(response);
    }

    public apiCallFor(...args: string[]) {
        return `${this.createUrl(this.apiHostUrl, ...args)}`;
    }

    public apiCallTo(url: string) {
        // if (url.startsWith('/')) {
        //     url = url.slice(1, url.length);
        // }
        return this.createUrl(this.apiHostUrl, url);
    }

    createUrl(...args: string[]) {
        const fragments = args.map((a: string) => {
            if (!a) { return ''; }
            let param = `${a}`;
            if (param.startsWith('/')) {
                param = param.slice(1, param.length);
            }
            if (param.endsWith('/')) {
                param = param.slice(0, param.length - 1);
            }
            return param;
        });
        //console.log('Fragments', fragments);
        const url = fragments.filter(f => f).join('/');
        return url;
    }

    urlSerialize(obj: object): string {
        const urlSearchParams = new URLSearchParams();
        for (let key in obj) {
            urlSearchParams.append(key, obj[key]);
        }
        return urlSearchParams.toString();
    }

    toUrlQuery(obj: object): string {
        return `?${this.urlSerialize(obj)}`;
    }

    public getApiResponse(method: string, url: string, options?, body?): Observable<any> {
        this.loading.startLoading();
        let request = new Observable<Response | any>();
        switch (method.toLowerCase()) {
            case 'get': {
                request = this.httpClient.get(url, options);
                break;
            }
            case 'post': {
                request = this.httpClient.post(url, body, options);
                break;
            }
            default:
                Observable.throw(new Error('Http method not allowed!'));
                break;
        }

        return request.pipe(
            map(response => {
                this.loading.stopLoading();
                return this.getApiResponseModel(response);
            }),
            catchError(error => {
                this.loading.stopLoading();
                return Observable.throw(error);
            }
            )
        );
    }

    public arrayDistinctBy(source: any[], propName: string) {
        const arrAsObject = source.reduce((acc, i) => {
            return { ...acc, [i[propName]]: i }
        }, {});
        return Object.keys(arrAsObject).reduce((acc, i) => {
            return [...acc, arrAsObject[i]];
        }, []);
    }
}
