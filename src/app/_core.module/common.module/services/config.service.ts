import { Injectable, Inject, Optional } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
    constructor(@Optional() @Inject('baseApiUrl') baseApiUrl?: string) {
        this.BASE_API_URL = baseApiUrl || 'https://localhost:44326/api/';
    }

    public BASE_API_URL: string;
}
