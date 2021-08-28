import { BaseFilterModel } from './BaseFilterModel';

export abstract class UrlBaseFilterModel extends BaseFilterModel {
    constructor(cacheFilterKey?: string) {
        super(cacheFilterKey);
        // this.onChange((changes) => { this.addToQueryParams(changes); });
    }

    private addToQueryParams(obj: { key, value }) {
        // check obj for null
        console.log('add to query', obj);
        if (!obj || !obj.key) {
            return;
        }
        const locParts = location.toString().split('?');
        const search = locParts.slice(1).join('');
        let currentParams = this.deserializeQuery(decodeURIComponent(search));

        if (currentParams[obj.key] === obj.value) { return; }
        currentParams = { ...currentParams, [obj.key]: obj.value };
        location.href = `${locParts[0]}?${this.serializeIntoUrlQuery(currentParams)}`;
    }

    private deserializeQuery(search: string) {
        return search
            .split('&')
            .map(p => p.split('='))
            .reduce((obj, splits: string[]) => {
                console.log('splits!!!!!', splits);

                const parts = splits.map(decodeURIComponent);
                const key = parts[0].trim();
                const val = parts.length > 1 ? parts[1] : '';
                return key ? ({ ...obj, [key]: val }) : obj;
            }, {});
    }

    private serializeIntoUrlQuery(obj: object) {
        return Object.keys(obj).filter(k => !!k).map((key) => `${key}=${obj[key]}`).join('&');
    }
}
