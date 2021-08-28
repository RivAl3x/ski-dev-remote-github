import { BaseService } from './baseService.service';
import { catchError, reduce, switchMap, filter, map, tap, mergeMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { ApiResponseModel } from '../models/ApiResponseModel';

@Injectable({ providedIn: 'root' })
export class CrudService<T> extends BaseService {
    constructor(
        @Inject('apiHost') protected apiHost: string, 
        @Inject('apiResource') protected apiResource: string, 
        @Inject('cachingKey') protected cachingKey: string = null
    ) {
        super(apiHost);
        this.apiResourceUrl = apiResource || '';
    }

    protected apiResourceUrl = '';

    private get _cachingKey() {
        return this.cachingKey || '';
    }

    protected get storeItems() {
        if (!this.appStore || !this._cachingKey) {
            return null;
        }
        return this.appStore._(this._cachingKey);
    }

    public getAll(urlAppend: string = '', forceApiCall: boolean = false): Observable<T[]> {
        if (this.cachingKey && !!this.appStore) {
            if (forceApiCall || !this.storeItems || this.storeItems.length <= 0) {
                this.appStore.set(this._cachingKey, []);
                this.apirequest('get', this.apiCallFor(this.apiResourceUrl, urlAppend)).pipe(map(r => r.data), tap(d => this.appStore.set(this._cachingKey, d))).subscribe();
            }
            return this.appStore.$(this._cachingKey);
        }
        return this.apirequest('get', this.apiCallFor(this.apiResourceUrl, urlAppend)).pipe(map(r => r.data));
    }

    public filterData(filter: object = {}, urlAppend: string = '') {
        return this.apirequest('get', this.apiCallFor(this.apiResourceUrl, urlAppend, '?' + this.urlSerialize(filter)))
            .pipe(map(r => r.data)
                // tap(d => this.appStore.set(this._cachingKey, d))
            );
    }

    public get(id): Observable<T> {
        if (!!this.appStore && !!this.appStore._(this._cachingKey)) {
            const foundItem = this.appStore._(this._cachingKey).find(e => e.id === id);
            if (foundItem) {
                return of(foundItem);
            }
        }
        return this.apirequest('get', this.apiCallFor(this.apiResourceUrl, id))
            .pipe(map(r => r.data));
    }

    public save(item, id = null, params: object = {}): Observable<ApiResponseModel> {
        // const fd = new FormData();
        // if (files){
        //     fd.append('files', files, files.name);
        // }
        if (!item) {
            of(null);
        }
        return (!item.id || item.id === 0) ? this.create(item, params) : this.update(item, id, params);
    }

    public delete(id): Observable<ApiResponseModel> {
        return this.apirequest('delete', this.apiCallFor(this.apiResourceUrl, id))
            .pipe(
                tap(response => {
                    try {
                        if (this.storeItems) {
                            this.appStore.set(this._cachingKey, this.storeItems.filter(i => i.id !== id));
                        }
                    } catch (e) {
                        throw new Error('Some error occured, but object was deleted with success. Please reload data!');
                    }
                })
            );
    }

    protected create(item, params: object = {}): Observable<ApiResponseModel> {
        item.id = item.id !== 0 ? null : item.id;
        return this.apirequest('post', this.apiCallFor(this.apiResourceUrl, '?' + this.urlSerialize(params)), null, JSON.stringify(item))
            .pipe(
                tap(response => {
                    if (this.storeItems) {
                        this.appStore.set(this._cachingKey, [...this.storeItems, response.data]);
                    }
                })
            );
    }

    update(object, id = null, params: object = {}): Observable<ApiResponseModel> {
        return this.apirequest('put', this.apiCallFor(this.apiResourceUrl, (id || ''), '?' + this.urlSerialize(params)), null, JSON.stringify(object))
            .pipe(
                tap(response => {
                    if (this.storeItems) {
                        this.appStore.set(this._cachingKey, [...this.storeItems.map(i => i.id === response.data.id ? response.data : i)]);
                    }
                })
            );
    }

    protected updateLocal(object) {
        const items = this.storeItems.filter(v => v.id !== object.id);
        this.appStore.set(this._cachingKey, [...items, object]);
    }

    protected resourceUrlFor(...args) {
        return this.apiCallFor(this.apiResourceUrl, ...args);
    }
}
