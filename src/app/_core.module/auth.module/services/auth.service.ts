import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { AppHttpClient } from '../../common.module/services/httpClient.service';
import { CurrentUser } from '../../common.module/services/currentuser.service';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject, throwError } from 'rxjs';
import { StorageService } from '../../common.module/services/storage.service';
import { Router } from '@angular/router';
import { ListingsService } from 'src/app/host.module/_services/listings.service';
import { SignalrService } from 'src/app/_shared/services/signalR.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const JSEncrypt;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    constructor(
        private router: Router,
        private apiClient: AppHttpClient,
        private currentUser: CurrentUser,
        private storage: StorageService,
        private listingService: ListingsService,
        private signalR: SignalrService,
        private snackBar: MatSnackBar
    ) {
       //this.chatUpdates = new BehaviorSubject<any>(null);
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
                map((r: any) => {
                    this.currentUser.setAuthData(r.data.accessToken);
                    //this.listingService.syncListOptions();\
                    this.subscribeToChatUpdates();
                })
            );
    }

    private subscribeToChatUpdates() {
        this.signalR.initiateSignalrConnection();
        this.signalR.messages.subscribe((conversationId: any) => {
            console.info('Signalr messages subscribe from auth service --- ', conversationId); 
        });
    }

    agreeHostTerms(agreeTerms = false) {
        const url = environment.apiUrl + 'Users/become_host';

        return this.apiClient.post(url, agreeTerms)
            .pipe(
                catchError(this.handleError),
                map((r: any) => {
                    this.currentUser.addRole('deskhub-host');
                    this.router.navigate(['/host/add-listing']);
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
                return this.registerUser(userType, email,  password, fullName, phone);
                //return this.registerUser(userType, email,  this.encryptWithRSA(password, key), fullName, phone);
            }));
    }

    registerUser(userType: string, email: string, password: string, fullName: string, phone: string) {
        const url = environment.apiUrl + 'Auth/create';
        

        return this.apiClient.anonymousPost(url, { userType, email, password, fullName, phone })
            .pipe(
                catchError(this.handleError),
                map((response: any)  => {
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
                   return response;
                })
            );
    }

    sendPasswordResetEmail(email: string) {
        const url = environment.apiUrl + 'Auth/reset-password';

        return this.apiClient.anonymousPost(url, {email})
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

    getUserProfile(userId) {
        const url = environment.apiUrl + 'Auth/users';

        let params = new HttpParams();
        params = params.append('userId', userId + '');

        return this.apiClient.get(url, {params})
            .pipe(
                catchError(this.handleError),
                tap((r: any) => {
                    this.currentUser.setUserData(r.data);
                })
            );
    }

    setUserData(data) {
        const profileRoles = data.roles ? data.roles.map(r => r.code.toLowerCase()) : [];
        // set roles and actions
        this.currentUser.setUserData({
            ...this.currentUser.user, ...data
        });
    }

    logout(autoLogout:boolean = false) {
        console.info('called auth.logout method');

        //let autoLogoutMessage = 'Session expired'
        //autoLogout ? this.router.navigateByUrl('/user', { state: { autoLogoutMessage } }) : this.router.navigate(['/user']);

        //this.logoutFromIS().subscribe((response) => {

            this.currentUser.setAuthData(null);

            //close signalR connection
            this.signalR.closeSignalRConnection();

            // clear cache
            this.storage.clearStorageForKeys();

            this.router.navigate(['/']);
            if (autoLogout) this.snackBar.open('Your session has expired. Please login again.', '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
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

    private encryptWithRSA(text, publicKey) {

        const pKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;

        // Create the encryption object and set the key.
        let crypt = new JSEncrypt();
        crypt.setKey(pKey); 

        //Encrypt the data with the public key.
        let encrypted = crypt.encrypt(text);
        return encrypted;

    }

    private handleError(response: any) {
        let errorMessage = 'general-error';

        let composedErrorMessage = response.messages.join('<br/>')

        if (!response) {
            return throwError(errorMessage);
        } else {
            return throwError(composedErrorMessage);
        }
    }
}
