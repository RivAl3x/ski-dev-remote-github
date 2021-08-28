import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { User } from '../_models/user.model';
import { Router } from '@angular/router';
import { AppHttpClient } from '../../_core.module/common.module/services/httpClient.service';
import jwt_decode from "jwt-decode";
import { UserInfo } from '../_models/user-info.model';

declare const JSEncrypt;

@Injectable({ providedIn: 'root' })
export class AccountService {

    constructor(
        private http: HttpClient,
        private apiClient: AppHttpClient,
        private router: Router,
    ) { }

    updateUserInfo(userInfo: UserInfo) {
        console.info('called updateUserInfo with: ', userInfo);

        const url = environment.apiUrl + 'SP/gen.rider_info';
        
        return this.apiClient.post(url, userInfo)
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    getUserInfo() {
        const url = environment.apiUrl + 'SP/gen.rider_info/-1';

        return this.apiClient.get(url)
            .pipe(
                catchError(this.handleError),
                map((response: any) => {
                    return response.data[0];
                })
            );
    }

    changePassword(currentPassword, newPassword) {
        const url = environment.apiUrl + 'Users/change_password';
        

        return this.apiClient.post(url, { currentPassword, newPassword })
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    saveBillingAddress(address: any) {
        console.info('called saveBillingAddress with: ', address);

        const url = environment.apiUrl + 'Account/billing_address';

        const formData: any = new FormData();
        formData.append('json', JSON.stringify(address));
        
        return this.apiClient.post(url, formData, {}, true)
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    getBillingAddresses() {
        const url = environment.apiUrl + 'Account/billing_address';
    
        return this.apiClient.get(url).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    deleteBillingAddress(id: any) {
        const url = environment.apiUrl + 'Account/billing_address/' + id;
    
        return this.apiClient.delete(url)
          .subscribe((response) => {
            return response;
          });
    }

    saveAffiliation(affiliation: any, isCompany: boolean) {
        console.info('called saveAffiliation with: ', affiliation);

        const url = isCompany ? environment.apiUrl + 'Host/affiliation' : environment.apiUrl + 'Rider/affiliate';

        const formData: any = new FormData();
        formData.append('token', affiliation.token);
        if (isCompany) formData.append('validationType', affiliation.validationType);
        
        return this.apiClient.post(url, formData, {}, true)
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    approveAffiliation(id: any) {
        const url = environment.apiUrl + 'Host/affiliation/approve/' + id;
        
        return this.apiClient.post(url, {})
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    sendEmailToken(token: any, email: any, company: any) {
        const url =  environment.apiUrl + 'Host/affiliation/send_token';

        const formData: any = new FormData();
        formData.append('token', token);
        formData.append('email', email);
        formData.append('company', company);
        
        return this.apiClient.post(url, formData, {}, true)
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    manageAffiliationData(id: number, affiliationData: any) {

        const url = environment.apiUrl + 'Host/affiliation/billing/' + id;
        
        return this.apiClient.post(url, affiliationData)
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    getAffiliations(isCompany: boolean) {

        const url = isCompany ? environment.apiUrl + 'Host/affiliation' : environment.apiUrl + 'Rider/affiliation';
    
        return this.apiClient.get(url).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    deleteAffiliation(id: any) {
        const url = environment.apiUrl + 'Account/billing_address/' + id;
    
        return this.apiClient.delete(url)
          .subscribe((response) => {
            return response;
          });
    }

    getBookings(pageNumber: number = 1, pageSize: number = 10, type: number = null) {
        const url = environment.apiUrl + 'Book';

        let params = new HttpParams();
        params = params.append('pageNumber', pageNumber + '');
        params = params.append('pageSize', pageSize + '');
        params = params.append('type', type + '');
    
        return this.apiClient.get(url, {params}).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    getBookingById(id: number) {
        const url = environment.apiUrl + 'Book/' + id;
    
        return this.apiClient.get(url).pipe(
            map((response: any) => {
                return response.data;
            }),
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    cancelBooking(id: any) {
        const url = environment.apiUrl + 'Book/cancel/' + id;
        
        const formData: any = new FormData();
        formData.append('reasonId', 0);
        formData.append('details', '');

    return this.apiClient.post(url, formData, {}, true).pipe(
            map((response) => {
              return response;
            }),
            catchError(errorRes => {
                return throwError(errorRes);
            })
        );
    }

    private handleError(response: any) {
        let errorMessage = 'An error occured.';

        console.info('response ', response);

        let composedErrorMessage = response.error.messages.join('<br/>')

        if (!response) {
            return throwError(errorMessage);
        } else {
            return throwError(composedErrorMessage);
        }
    }
}