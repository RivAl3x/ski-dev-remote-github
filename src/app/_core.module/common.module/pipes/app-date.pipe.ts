
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { StorageService } from '../services/storage.service';
import localesEn from '@angular/common/locales/en';
import { appInjector } from '../utils/appInjector';
import * as moment from 'moment';
import { AppDateTimeUtils } from '../utils/AppDateTimeUtils';

registerLocaleData(localesEn);

@Pipe({
    name: 'appDate'
})
export class AppDatePipe implements PipeTransform {

    constructor(private storageService: StorageService = null) {
        this.storageService = storageService || new StorageService();
    }

    // dateDefaultFormat = 'dd/MM/yyyy';
    dateDefaultFormat = 'dd/mm/yy';
    timeShortDefaultFormat = 'HH:mm';
    secondsFormat = 'ss';

    transform(value: string | Date, args?: any): any {
        if (!value) { return '-'; }
        value = AppDateTimeUtils.ensureDateAsString(value);
        value = value.toString().toLocaleLowerCase().replace('t', ' ').replace('z', '');
        value = AppDateTimeUtils.toDate(value);
        // console.log('app-date pipe', value);
        // value = AppDateTimeUtils.toStringShortDateTime(new Date());
        // let convertValue = moment(value);
        // convertValue = convertValue.isValid ? convertValue : moment();
        // // convertValue = convertValue.isUTC() ? convertValue.utc(false) : convertValue;
        // // convertValue = value.toString().toLocaleLowerCase().endsWith('z') ? convertValue.utc(false) : convertValue;

        // value = convertValue.format(`YYYY-MM-DD HH:mm:ss`);

        // return super.transform(value, this.userPreferedDateFormat(args));
        return this.selectedDateFormat(value, args);
    }

    selectedDateFormat(val: Date, args: string) {
        let d = '';
        let t = '';
        let s = '';
        if (!args || args.indexOf('d') >= 0) {
            // defaultFormat = this.dateDefaultFormat;
            d = AppDateTimeUtils.formatDate(val, this.dateDefaultFormat);
        }
        if (args && args.indexOf('t') >= 0) {
            // defaultFormat = `${defaultFormat} ${this.timeShortDefaultFormat}`;
            t = ` ${AppDateTimeUtils.toStringShortTime(val)}`;
        }
        if (args && args.indexOf('s') >= 0) {
            // defaultFormat = `${defaultFormat}:${this.secondsFormat}`;
            s = AppDateTimeUtils.toStringTime(val);
        }

        return `${d} ${s ? s : t}`;
    }

    userPreferedDateFormat(args: string) {
        let defaultFormat = '';
        if (!args || args.indexOf('d') >= 0) {
            defaultFormat = this.dateDefaultFormat;
        }
        if (args && args.indexOf('t') >= 0) {
            defaultFormat = `${defaultFormat} ${this.timeShortDefaultFormat}`;
        }
        if (args && args.indexOf('s') >= 0) {
            defaultFormat = `${defaultFormat}:${this.secondsFormat}`;
        }

        let preferences = this.storageService.getAsObject(this.storageService.Keys.UserPreferences);
        preferences = preferences || { dateFormat: defaultFormat };
        return preferences.dateFormat || defaultFormat;
    }

    public static value(value: string | Date) {
        value = value || '';
        const appDatePipeInstance = <AppDatePipe>appInjector.instanceOf(AppDatePipe);
        return appDatePipeInstance.transform(value.toString())
    }
}
