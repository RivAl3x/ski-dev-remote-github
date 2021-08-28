import { Injectable } from '@angular/core';


export const LocalStorageKeys = {
    Token: 'Token',
    RefreshToken: 'RefreshToken',
    UserProfile: 'UserProfile',
    UserAccess: 'UserAccess'
}

@Injectable({ providedIn: 'root' })
export class StorageService {

    private localStorage: any;
    public Keys = LocalStorageKeys;

    static get LKeys() {
        return LocalStorageKeys;
    }

    clearStorageForKeys() {
        Object.keys(this.Keys).forEach(v => this.delete(this.Keys[v]));
    }

    constructor() {
        this.localStorage = window.localStorage;
    }

    save(key, object) {
        // console.log(`save in storage key:${key} and object:`, object)
        let stringToSaveToStorage = '';
        if (!object || typeof (object) === 'string') {
            stringToSaveToStorage = object ? object : '';
        } else {
            stringToSaveToStorage = JSON.stringify(object);
        }
        this.localStorage.setItem(key, stringToSaveToStorage);
        let result = null;
        try {
            result = this.getAsObject(key);
        } catch (ex) {
            result = this.get(key);
        }
        return result;
    }

    getAsObject(key) {
        const item = this.get(key);

        if (item && item != '') {
            let parsedItem = item;
            try {
                parsedItem = JSON.parse(item);
            } catch (e) {
            }
            return parsedItem;
        }

        return item;
    }

    get(key) {
        return this.localStorage.getItem(key);
    }

    delete(key) {
        this.localStorage.removeItem(key);
    }

    deleteIfContains(text: string) {
        Object.keys(localStorage).forEach(k => {
            if (k.includes(text)) {
                this.delete(k);
            }
        })
    }

    public get value(): { token, user } {
        return {
            token: this.get(this.Keys.Token),
            user: this.getAsObject(this.Keys.UserProfile)
        };
    }
}
