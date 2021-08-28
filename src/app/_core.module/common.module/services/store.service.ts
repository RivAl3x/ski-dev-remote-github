import { Injectable } from "@angular/core";
import { DataStore } from "../models/DataStore";


@Injectable()
export class AppStore extends DataStore {
    constructor() {
        super();
    }

    public initializeStore() {
        this.clearAllData();
        this.add('ui', {
            loading: false,
        });

        this.add('account', {
            isAuthenticated: () => {
                const tokenExistance = localStorage.getItem('Token');
                return !!tokenExistance;
            },
        });
    }
}