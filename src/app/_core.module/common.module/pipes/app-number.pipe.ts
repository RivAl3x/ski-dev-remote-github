
import { Pipe, PipeTransform } from '@angular/core';
import { AppStore } from '../services/store.service';
import { DecimalPipe } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { appInjector } from '../../bootstrap-components.module';

@Pipe({
    name: 'appNumber',
})
export class AppNumberPipe implements PipeTransform {

    constructor(private numberPipe: DecimalPipe, private appStore: AppStore, private storageService: StorageService) {
    }

    transform(value: any, args?: any): any {
        value = value || 0;
        const companyNumberFormat = this.companyNumberFormat;
        let format: string = args && args[0] ? args[0] : companyNumberFormat;
        let thousandSeparator = '_';
        if (format.length > 5) {
            thousandSeparator = format.slice(0, 1);
            format = format.slice(1);
        }

        let formattedNo = this.numberPipe.transform(value, format, 'en-us');
        if (thousandSeparator) {
            thousandSeparator = thousandSeparator.replace('_', '');
            thousandSeparator = thousandSeparator.replace('-', ' ');
            formattedNo = formattedNo.replace(/ /g, thousandSeparator);
            formattedNo = formattedNo.replace(/,/g, thousandSeparator);
        }

        if (thousandSeparator === '.') {
            const formattedNoReversed = formattedNo.split('').reverse().join('').replace(thousandSeparator, ',');
            formattedNo = formattedNoReversed.split('').reverse().join('');
        }

        return formattedNo;
    }

    get companyNumberFormat() {
        let preferences = this.storageService.getAsObject(this.storageService.Keys.UserPreferences);
        preferences = preferences || { numberFormat: '-2.2-2' };
        return preferences.numberFormat;
    }

    get companyNumberFormat1() {
        const companyNumberFormat = this.appStore._('crm.selectedCompany.country') || 'RO';
        switch (companyNumberFormat.toLowerCase()) {
            case 'ro':
            case 'bg':
            case 'ge':
            case 'eu': return '.2.2-2';
            case 'us': return ',2.2-2';

            default: return '-2.2-2'
        }
    }

    public static value(value: any, args?: any) {
        return new AppNumberPipe(appInjector.instanceOf(DecimalPipe),
            appInjector.instanceOf(AppStore),
            appInjector.instanceOf(StorageService)).transform(value, args);
    }
}
