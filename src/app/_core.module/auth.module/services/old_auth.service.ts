import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppHttpClient } from '../../common.module/services/httpClient.service';
import jwt_decode from "jwt-decode";
import { ListingsService } from 'src/app/host.module/_services/listings.service';

declare const JSEncrypt;

@Injectable({ providedIn: 'root' })
export class OldAuthenticationService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(
        private http: HttpClient,
        private apiClient: AppHttpClient,
        private router: Router,
        private listingsService: ListingsService
    ) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    /** Observable of the currently signed-in user (or null) */
    public get user$(): Observable<any> { return this.currentUser; }

    /** Current user object snapshot */
    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        const getAuthPublicKey$ = this.getAuthPublicKey();
        return getAuthPublicKey$.pipe(
            tap(r => console.log('public key response', r)),
            map(r => {
                if (!r) { return '' }
                const messages = r.data && r.data.messages ? r.data.messages : r.messages;
                return messages ? messages[0] : '';
            }),
            switchMap(key => {
                //return this.loginUser(username, this.encryptWithRSA(password, key));
                return this.loginUser(username, password);
            }));
    }

    loginUser(username: string, password: string) {
        const url = environment.apiUrl + 'Auth/login';
        

        return this.apiClient.anonymousPost(url, { username, password })
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                    let decodedToken: any = jwt_decode(response.data.accessToken);
                    console.info('decodedToken ---- - --- ', decodedToken);
                    localStorage.setItem('currentUser', JSON.stringify(response.data));
                    localStorage.setItem('currentUserId', decodedToken.sub);
                    localStorage.setItem('token', response.data.accessToken);
                    this.listingsService.syncListOptions();

                    this.currentUserSubject.next(response.data);
                    return response.data.user;
                })
            );
    }

    logout(autoLogout:boolean = false) {
        console.info('called auth.logout method');

        //let autoLogoutMessage = 'Sesiunea dvs. a expirat. Va rugam sa va logati din nou.'

        //autoLogout ? this.router.navigateByUrl('/user', { state: { autoLogoutMessage } }) : this.router.navigate(['/user']);

        //this.logoutFromIS().subscribe((response) => {

            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('token');
            this.currentUserSubject.next(null);
            this.router.navigate(['/']);
        //});
    }

    logoutFromIS() {
        const url = environment.apiUrl + 'Users/logout';

        return this.apiClient.post(url, {})
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                    return response;
                })
            );
    }

    resetPassword(email: string) {
        const url = environment.apiUrl + 'Users/reset';

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8').set('Access-Control-Allow-Origin', '*').set('Accept', 'application/json');

        let params = new HttpParams();
        params = params.append("email", email);

        return this.http.post<any>(url, {}, {headers: headers, params: params})
            .pipe(
                catchError(this.handleError),
                map(response => {
                    return response;
                })
            );
    }

    register(userType: string, email: string, password: string, fullName: string, phone: string) {
        const getAuthPublicKey$ = this.getAuthPublicKey();
        return getAuthPublicKey$.pipe(
            tap(r => console.log('public key response', r)),
            map(r => {
                if (!r) { return '' }
                const messages = r.data && r.data.messages ? r.data.messages : r.messages;
                return messages ? messages[0] : '';
            }),
            switchMap(key => {
                //console.info('switchMap -> key: ', key);
                return this.registerUser(userType, email,  this.encryptWithRSA(password, key), fullName, phone);
            }));
    }

    registerUser(userType: string, email: string, password: string, fullName: string, phone: string) {
        const url = environment.apiUrl + 'Auth/create';
        

        return this.apiClient.anonymousPost(url, { userType, email, password, fullName, phone })
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                    console.info(response);
                    return response;
                })
            );
    }

    confirmAccount(code: string) {
        const url = environment.apiUrl + 'Auth/confirm';
        

        return this.apiClient.anonymousPost(url, { code })
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
                   console.info(response);
                })
            );
    }

    sendPasswordResetEmail(email: string) {
        const url = environment.apiUrl + 'Users/reset';

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', 'application/json; charset=utf-8').set('Access-Control-Allow-Origin', '*').set('Accept', 'application/json');

        let params = new HttpParams();
        params = params.append("email", email);

        return this.http.post<any>(url, {}, {headers: headers, params: params})
            .pipe(
                catchError(this.handleError),
                map(response => {
                    return response;
                })
            );
    }

    getAuthPublicKey() {
        const url = environment.apiUrl + 'Auth/publickey';

        return this.apiClient.anonymousGet(url)
            .pipe(
                catchError(this.handleError),
                map((res: any) => {
                    return res;
                })
            );
    }

    private encryptWithRSA(text, publicKey) {

        const pKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

        // Create the encryption object and set the key.
        let crypt = new JSEncrypt();
        crypt.setKey(pKey); //You can use also setPrivateKey and setPublicKey, they are both alias to setKey

        // var text = 'test';
        // // Encrypt the data with the public key.
        let encrypted = crypt.encrypt(text);
        return encrypted;

        // Now decrypt the crypted text with the private key.
        // var dec = crypt.decrypt(enc);

        // // Now a simple check to see if the round-trip worked.
        // if (dec === text) {
        //     alert('It works!!!');
        // } else {
        //     alert('Something went wrong....');
        // }
    }

    private handleError(response: any) {
        let errorMessage = 'A aparut o eroare!';

        console.info('response ', response);

        let composedErrorMessage = response.error.messages.join('<br/>')

        if (!response) {
            return throwError(errorMessage);
        } else {
            return throwError(composedErrorMessage);
        }
    }
}