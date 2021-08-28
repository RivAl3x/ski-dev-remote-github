import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { appInjector } from '../utils/appInjector';
import { KeyValuePair } from '../models/keyValuePairModel';
import jwt_decode from "jwt-decode";

class Role {
    code: string;
    name: string;
    active: boolean;
    id: number;
}

export class User {
    name: string;
    given_name: string;
    family_name: string;
    email: string;
    role: Array<string> = [];

    active: boolean;
    id: number;
}

@Injectable({ providedIn: 'root' })
export class CurrentUser {
    constructor(private storage: StorageService) { }

    private userDataChanged = new Subject();

    public get userDataChanged$() {
        return this.userDataChanged.asObservable();
    }

    /** Observable of the currently signed-in user (or null) */
    public get user$(): Observable<any> { 
        return this.userSubject.asObservable(); 
    }

    public get isAuthenticated(): boolean {
        return !!this.token && !!this.user;
    }

    public get isHost(): boolean {
        return this.hasRole('deskhub-host');
    }

    public get isCompany(): boolean {
        return this.hasRole('deskhub-host');
    }

    public get userSubject(): BehaviorSubject<any> {
        return new BehaviorSubject<any>(this.storage.getAsObject(this.storage.Keys.UserProfile));
    }

    public get user(): User {
        return this.storage.getAsObject(this.storage.Keys.UserProfile) || new User();
    }
    public get token(): string {
        return this.storage.get(this.storage.Keys.Token);
    }

    setTokenData(token = null) {
        this.storage.save(this.storage.Keys.Token, token);
    }

    setUserData(user = null) {
        console.info('set user data -- ', user);

        if (user && !Array.isArray(user.role)) {
            user.role = [user.role];
        }
        
        this.storage.save(this.storage.Keys.UserProfile, user);
        this.userDataChanged.next(this.user);
    }

    setAuthData(accessToken) {
        let decodedToken: any = accessToken ? jwt_decode(accessToken) : null;

        this.setTokenData(accessToken);
        this.setUserData(decodedToken);
    }

    containsTextInRoles(text: string) {
        text = text || '';
        return (this.user.role || []).map(r => (r || '').toLowerCase()).join(',').indexOf(text.toLowerCase()) >= 0;
    }

    hasRole(role: string) {
        return this.hasAnyRole([role]);
    }

    hasAnyRole(roles: string[]) {

        const storageUser = this.user;
        return roles && roles.length && storageUser && storageUser.role &&
            storageUser.role.filter(r1 => roles.map(r2 => r2.toLocaleLowerCase()).includes(r1.toLocaleLowerCase())).length > 0;
    }

    hasAllRoles(roles: string[]) {
        const storageUser = this.user;
        return roles && roles.length && storageUser && storageUser.role &&
            storageUser.role.filter(r1 => roles.map(r2 => r2.toLocaleLowerCase()).includes(r1.toLocaleLowerCase())).length === roles.length;
    }

    addRole(role: string) {
        if (!this.hasRole('deskhub-host')) {
            const storageUser = this.user;
            storageUser && storageUser.role && storageUser.role.push(role);

            this.setUserData(storageUser);
        }
    }

    static get instance() {
        return appInjector.instanceOf(CurrentUser);
    }
}
