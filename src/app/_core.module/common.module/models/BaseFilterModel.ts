import { BaseModel } from './BaseModel';
import { appInjector } from '../../bootstrap-components.module';
import { StorageService } from '../services/storage.service';

export abstract class BaseFilterModel extends BaseModel {
    constructor(cacheFilterKey?: string) {
        super();
        this.storageService = appInjector.instanceOf(StorageService);
        this.cacheFilterKey = cacheFilterKey;
    }
    private callBacks = [];
    protected cacheFilterKey = null;
    protected storageService: StorageService;
    public filterName: string = 'Toate';
    private propertiesChangedObj = {};
    private timeoutObj = null;

    private isBaseClassProp(prop: string) {
        return 'callBacks, cacheFilterKey, storageService, filterName, filterPropsToSave,propertiesChangedObj,timeoutObj'.indexOf(prop) >= 0;
    }

    public abstract reactify();

    public onChange(cb) {
        this.applyReactivity(this);
        this.callBacks.push(cb);
    }

    public get filterData() {
        const self = this;
        return Object.keys(self).reduce((acc, val) => {
            if (!this.isBaseClassProp(val)) {
                acc = { ...acc, [val]: self[val] };
            }
            return acc;
        }, {});
    }

    protected setFilterPropToCache(propName, propValue) {
        const obj = {};
        obj[propName] = propValue;
        this.setFilterPropObjToCache(obj);
    }

    protected setFilterPropObjToCache(obj) {
        if (this.cacheFilterKey) {
            let lastFilter = this.cacheFilterObj || {};
            // lastFilter[propName] = propValue;
            // if property starts with underscore means is a property and needs to be deleted
            const updatedObject = Object.keys(obj).reduce((acc, i) => {
                let key = i;
                if (i.startsWith('_')) {
                    key = i.replace('_', '');
                }

                return { ...acc, [key]: obj[i] };
            }, {});

            lastFilter = { ...lastFilter, ...obj, ...updatedObject };
            this.storageService.save(this.cacheFilterKey, lastFilter);
        }
    }

    private get cacheFilterObj() {
        const cacheObj = this.storageService.getAsObject(this.cacheFilterKey);
        return cacheObj;
    }

    public get lastFilter() {
        const self = this;
        if (this.cacheFilterKey && this.cacheFilterObj) {
            return this.cacheFilterObj;
        }
        return self;
    }

    private applyReactivity(self) {
        console.log('self', self);
        if (Object.keys(self).length <= 0) {
            throw new Error('All class members from filter must be initialized');
        }
        // console.log('Fields', Object.keys(self), Object.keys(this));

        Object.keys(self).forEach((val, index) => {
            if (!this.isBaseClassProp(val)) {
                this.defineProperty(this, val);
            }
        });
    }

    private defineProperty(target: object, key: string) {
        let val = target[key];

        const getter = () => {
            return val;
        };
        const setter = (next) => {
            val = next;
            this.propertyChanged(key, next);
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });

    }

    private notifyObserversForPropertiesChanged() {
        this.setFilterPropObjToCache(this.propertiesChangedObj);
        this.callBacks.forEach((val) => {
            try {
                val(this.propertiesChangedObj);
            } catch (e) { console.log('Error on callback call', e); }
        });
        this.propertiesChangedObj = {};
    }


    private propertyChanged(propName, propValue) {
        // add modified property
        // this.propertiesChangedArray.push({ key: propName, value: propValue });
        this.propertiesChangedObj[propName] = propValue;
        clearTimeout(this.timeoutObj);

        this.timeoutObj = setTimeout(() => {
            this.notifyObserversForPropertiesChanged();
        }, 200);
    }
}
