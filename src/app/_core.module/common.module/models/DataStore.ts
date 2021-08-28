import { BehaviorSubject, Observable, Subject } from "rxjs";
import { AppAction } from "./AppAction";
import { filter } from "rxjs/operators";

// data can be anything : object, string, int, array, bool
export abstract class DataStore {

    private internalData = {};
    private subjects = {};

    constructor() {
        if (!!arguments && arguments.length > 0) {
            // means exist arguments
            // each arguments must be of this shape : {prop:..., value:...}
            for (let i = 0; i < arguments.length; i++) {
                const el = arguments[i];
                const prop = el.prop;
                const value = el.value;
                if (this.isStringStrict(prop)) {
                    this.add(prop, value);
                }
                else {
                    console.error(`Argument from position ${i + 1} has invalid format.`)
                }
            }
        }
        //console.log('Created Data store')
        this.initializeStore();
    }

    public clearAllData() {
        this.internalData = {};
        //this.subjects = {};
        // set default value for all subjects
        Object.keys(this.subjects).forEach(p => {
            this.subjects[p]._value = null;
        })
    }

    public abstract initializeStore();

    /** Get behavior subject for property. It will be created if not exist */
    private getEnsuredBehaviorSubject(property) {
        //console.info("---Get property as BehaviorSubject ", property);
        if (!this.subjects.hasOwnProperty(property)) {
            this.subjects[property] = new BehaviorSubject<any>(this._(property));
        }
        return this.subjects[property];
    }

    /** Get subject for property. It will be created if not exist */
    private getEnsuredSubject(property) {
        //console.info("---Get property as Subject ", property);
        if (!this.subjects.hasOwnProperty(property)) {
            this.subjects[property] = new Subject<any>();
        }
        return this.subjects[property];
    }

    /** Get value of property. */
    _(property: string) {
        //debugger;
        let nestedProps = property ? property.toString().split('.') : [];
        let value = this.getPropertyValueFromObject(this.internalData, nestedProps);
        return this.isFunctionStrict(value) ? value() : value;
    }

    /** Get value of property. */
    p(property: string) {
        return this._(property);
    }

    /** Get observable from value of property. */
    $(property): Observable<any> {
        return this.getEnsuredBehaviorSubject(property).asObservable();
    }

    /** Get observable from value of property. */
    $s(property): Observable<any> {
        return this.getEnsuredSubject(property).asObservable();
    }

    /** Get observable from value of property. */
    p$(property): Observable<any> {
        return this.$(property);
    }

    /** Add property with data value. */
    add(property: string, data: any) {
        // delete this.subjects[property];
        let properties = property.split('.');
        this.createProperty(properties, data);
    }

    /** Add property with data value. */
    set(property: string, data: any) {
        //debugger;
        ////console.log('Set property:', property)
        this.add(property, data);
        this.subjectsNotify(property.split('.'));
    }

    /** Loop between subjects and notify observers*/
    private subjectsNotify(properties: Array<string>) {
        const propertiesString = properties.join('.');
        let keys = [];
        let deepKeys = this.getDeepKeys(this._(propertiesString))
        // notify properties
        properties.forEach((v, i) => keys.push(properties.slice(0, (i + 1)).join('.')));
        deepKeys.forEach((v, i) => keys.push(propertiesString + "." + v));
        ////console.log("Deepkeys", keys)
        keys.forEach((v, i) => {
            if (!!this.subjects[v]) {
                ////console.log(`   Notify ${v} of changes`, );
                this.subjects[v].next(this._(v));
            }
        });
    }

    /** Get all properties of object as array of strings*/
    private getDeepKeys(obj) {
        if (!this.isObjectStrict(obj)) return [];
        let keys = [];
        for (let key in obj) {
            keys.push(key);
            if (this.isObjectStrict(obj[key])) {
                var subkeys = this.getDeepKeys(obj[key]);
                keys = keys.concat(subkeys.map(function (subkey) {
                    return key + "." + subkey;
                }));
            }
        }
        return keys;
    }

    /** Get property value from object. */
    private getPropertyValueFromObject(obj, properties) {
        if (!obj) return null;
        if (!!properties && properties.length > 0) {
            let propValue = obj[properties[0]];
            if (!!propValue && properties.length > 1) {
                return this.getPropertyValueFromObject(propValue, properties.slice(1))
            }
            return propValue;
        }
    }

    /** Create property with value from array of strings. */
    private createProperty(keysArray, value) {
        this.assignPropertiesToObject(this.internalData, keysArray, value);
    }

    /** Assign recursively properties to object*/
    private assignPropertiesToObject(obj, properties, value) {
        if (!!properties && properties.length > 0) {
            const prop = properties[0];
            if (properties.length == 1) {
                // means is last property then assign value
                ////console.log(`--      Property:${prop}, value:${value}`)
                obj[prop] = value;
            } else {
                // go forward and recursively attach properties
                obj[prop] = obj[prop] || {};
                this.assignPropertiesToObject(obj[prop], properties.slice(1), value)
            }
        }
    }

    private isObjectStrict(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }

    private isStringStrict(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }

    private isFunctionStrict(obj) {
        return Object.prototype.toString.call(obj) === '[object Function]';
    }

    extendWithStore(store: DataStore) {
        this.internalData = {
            ...this.internalData,
            ...store.getDataAsObject()
        }
        return this;
    }

    getDataAsObject() {
        return { ...this.internalData }
    }

    getObjectFromLocalStorage(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    dispatchAction(actionName: string, data: any = null) {
        setTimeout(() => {
            //console.log("general actions", actionName)
            this.set("general.actions", new AppAction(actionName, data));
        }, 100);
    }

    action$(type: string): Observable<AppAction> {
        const subject = new Subject<AppAction>();
        //console.log("general actions read", type)
        //return this.$("general.actions").pipe(filter(a => !!a && a.type === type));
        this.$s("general.actions").subscribe(act => {
            if (!!act && act.type === type) {
                subject.next(act);
                this.add('general.actions', null);
            }
        });
        return subject.asObservable();
    }
}

