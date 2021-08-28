import { Pipe, PipeTransform } from '@angular/core';
import { AppStore } from '../services/store.service';
import { StorageService } from '../services/storage.service';
import { CurrencyConvertorService } from '../services/currencyConvertor.service';

@Pipe({
    name: 'appCCV'
})
export class AppCurrencyConverValuePipe implements PipeTransform {

    constructor(private appStore: AppStore, private storageService: StorageService, private currencyConvertor: CurrencyConvertorService) {
    }

    transform(value: number | string, fromCurrency: string = null, toCurrency: string = null): any {
        toCurrency = toCurrency || this.preferedCurrency;
        value = value || 0;
        value = Number.parseFloat(value.toString());
        //const returnValue = this.currencyConverter.value(value,from,to);
        //return  side === 'l' ? currencyDisplay + ' ' + value : value + ' ' + currencyDisplay;
        return this.currencyConvertor.value(value, fromCurrency, toCurrency);
    }

    get preferedCurrency() {
        let preferences = this.storageService.getAsObject(this.storageService.Keys.UserPreferences);
        preferences = preferences || { currency: this.CompanyCurrency };
        return preferences.currency.toLowerCase();
    }

    get CompanyCurrency() {
        const companyCurrency = this.appStore._('crm.selectedCompany.country') || 'RO';
        const countryCurrencies = {
            'RO': 'RON',
            'BG': 'Leva',
            'GE': 'EUR',
            'US': 'USD'
        };

        return countryCurrencies[companyCurrency];
    }

    isEmpty(value: any): boolean {
        return value == null || value === '' || value !== value;
    }
}
