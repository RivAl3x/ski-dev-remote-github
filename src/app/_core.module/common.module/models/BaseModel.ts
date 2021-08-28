import { AppNumberPipe } from '../pipes/app-number.pipe';
import { isObject } from 'util';

export abstract class BaseModel {
    // abstract errors(): Array<string>;
    // abstract IsValid(): Boolean;

    public fix2(n) {
        return Number.parseFloat(n.toFixed(2));
    }

    public fix2String(n) {
        return AppNumberPipe.value((Math.trunc(this.fix2(n) * 100) / 100).toFixed(2));
    }

    public fromObject(obj) {

        if (obj) {
            for (const propName of Object.keys(obj)) {
                try {
                    if (this[propName] !== null && this[propName] instanceof BaseModel) {
                        this[propName].fromObject(obj[propName]);
                    } else if (this[propName] !== null && this[propName] instanceof Array) {
                        this[propName] = JSON.parse(JSON.stringify(obj[propName]));
                    } else {
                        this[propName] = obj[propName];
                    }
                } catch (e) {
                    // console.log(`Cannot set property ${propName}`, e)
                }
            }
        }
        return this;
    }

    public fromJson(json: string) {
        if (json) {
            this.fromObject(JSON.parse(json));
        }
        return this;
    }

    public getGetters(obj = null): string[] {
        obj = obj || this;
        const proto = Object.getPrototypeOf(obj);
        let result = [];
        if (proto) {
            result = Object.keys(proto).filter(name => {
                return typeof Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), name).get === 'function';
            });
            result = [...result, ...this.getGetters(proto)];
        }
        return result;
    }

    public getSetters(obj = null): string[] {
        obj = obj || this;
        return Object.keys(Object.getPrototypeOf(obj)).filter(name => {
            return typeof Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), name).set === 'function';
        });
    }

    toJsonString(): string {
        // let objectToStringify = {};
        // Object.keys(this).concat(this.getGetters()).forEach(k => {
        //     objectToStringify[k] = this[k];
        // })

        // let json = JSON.stringify(objectToStringify);
        // //let json = JSON.stringify(this);
        // Object.keys(this).filter(key => key[0] === "_").forEach(key => {
        //     json = json.replace(key, key.substring(1));
        // });

        // this.getAllProperties(this);
        const objectToStringify = this.clone(this);
        return JSON.stringify(objectToStringify);
    }

    public clone(obj) {
        // obj = obj || this;
        let copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' !== typeof obj) { return obj; }

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (let i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            const getters = this.getGetters(obj);
            Object.keys(obj).concat(getters).forEach(k => {
                copy[k] = this.clone(obj[k]);
            });
            return copy;
        }

        throw new Error('Unable to copy obj! Its type isn\'t supported.');
    }
}
