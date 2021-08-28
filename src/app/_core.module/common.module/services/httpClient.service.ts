import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { appInjector } from '../utils/appInjector';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AppHttpClient {

    constructor(
        private http: HttpClient,
        private localStorage: StorageService,
        private config: ConfigService
    ) { }

    anonymousGet(url: string, options?: {}) {
        const requestOptions = this.addContentTypeHeader(options);
        return this.http.get(url, requestOptions);
    }

    get(url: string, options?) {
        let requestOptions = this.addContentTypeHeader(options);
        requestOptions = this.addRequiredDataToHeader(requestOptions);
        return this.http.get(url, requestOptions);
    }

    anonymousPost(url: string, body: any, options?) {

        const requestOptions = this.addContentTypeHeader(options);
        return this.http.post(url, body, requestOptions);
    }

    post(url: string, body: any, options?, hasFiles = false) {
        let requestOptions = this.addContentTypeHeader(options, hasFiles);
        requestOptions = this.addRequiredDataToHeader(requestOptions);
        return this.http.post(url, body, requestOptions);
    }

    put(url: string, body: any, options?, hasFiles = false) {
        let requestOptions = this.addContentTypeHeader(options, hasFiles);
        requestOptions = this.addRequiredDataToHeader(requestOptions);
        return this.http.put(url, body, requestOptions);
    }

    delete(url: string, options?) {
        let requestOptions = this.addContentTypeHeader(options);
        requestOptions = this.addRequiredDataToHeader(requestOptions);
        return this.http.delete(url, requestOptions);
    }

    private addContentTypeHeader(options?: { headers?}, hasFiles = false) {
        const result = this.getRequestOptions(options);
        if (!options) {
            if (!hasFiles) {
                result.headers = result.headers.set('Content-Type', 'application/json');
            }
            result.headers = result.headers.set('Accept', 'application/json');
            result.headers = result.headers.set('Access-Control-Allow-Origin', this.config.BASE_API_URL);
            result.headers = result.headers.set('Access-Control-Allow-Origin', '*');
        }
        // //console.log(result);
        return result;
    }

    private addRequiredDataToHeader(options?: { headers?}): { headers?: HttpHeaders } {
        const result = this.getRequestOptions(options);
        const authorizationValue = 'Bearer ' + this.localStorage.get('Token');
        result.headers = result.headers.set('Authorization', authorizationValue);
        return result;
    }

    private getRequestOptions(options?: { headers?: HttpHeaders }): { headers?: HttpHeaders } {
        let result = { headers: new HttpHeaders(), ...options };
        if (!options || !options.headers) {
            result = {
                ...options,
                headers: new HttpHeaders()
            };
        }
        return result;
    }
}
