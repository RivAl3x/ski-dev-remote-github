export class KeyValuePair {

    constructor(_key: string | number, _value: any, _extraData: any = {}) {
        this.id = _key;
        this.key = _key;
        this.value = _value;
        this.extraData = _extraData;
    }

    id: string | number;
    key: string | number;
    value: any;
    extraData: any;

    static fromObject(obj: Object) {
        obj = obj || {};
        return Object.keys(obj).map(k => new KeyValuePair(k, obj[k]));
    }
}