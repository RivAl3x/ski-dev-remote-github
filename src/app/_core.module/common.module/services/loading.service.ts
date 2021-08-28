import { Injectable } from '@angular/core';
import { AppStore } from './store.service';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    constructor(private appStore: AppStore) {
    }

    public startLoading() {
        this.setLoading(true)
        setTimeout(() => {
            this.setLoading(false);
        }, 30000);
    }

    public stopLoading() {
        this.setLoading(false)
    }

    private setLoading(value) {
        this.appStore.set('ui.loading', value);
    }
}
