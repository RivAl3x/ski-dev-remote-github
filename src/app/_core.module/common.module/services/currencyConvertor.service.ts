import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BaseService } from './baseService.service';

@Injectable()
export class CurrencyConvertorService extends BaseService {
    constructor() {
        super();
        this.getLatestRates();
    }

    private apiEndpoint = 'api/';
    private defaultCurrencyRatesForOneEuro = {
        'USD': 0.8847,
        'EUR': 1.0000,
        'RON': 0.2108,
        'BGN': 0.5113,
        'GDP': 1.2312
    };



    private _currencyRatesForOneEuro: object = null;
    public get currencyRatesForOneEuro(): object {
        return this._currencyRatesForOneEuro || this.defaultCurrencyRatesForOneEuro;
    }
    public set currencyRatesForOneEuro(v: object) {
        this._currencyRatesForOneEuro = v;
    }

    getLatestRates() {
        // make api call
        this.anonymousrequest('get', this.apiCallTo('api/public/currencyRates'))
            .pipe(
                map(r => JSON.parse(r.toString())),
                map(r => r.rates || this.defaultCurrencyRatesForOneEuro),
                tap(r => console.log('currency rates:', r)),
                tap(r => this.currencyRatesForOneEuro = { ...r, 'EUR': 1 })
            ).subscribe();
    }

    exchangeRate(fromCurrency: string, toCurrency: string) { // lei->eur
        const fromCurrencyInEruro = this.currencyRatesForOneEuro[this.currency3Letters(fromCurrency).toUpperCase()]; // 0.2108
        const toCurrencyInEruro = this.currencyRatesForOneEuro[this.currency3Letters(toCurrency).toUpperCase()]; // 1.0000
        const rate = (1 / fromCurrencyInEruro) / (1 / toCurrencyInEruro);
        //const rate = (1 / toCurrencyInEruro) / (1 / fromCurrencyInEruro);
        return parseFloat(rate.toFixed(4));
    }

    exchangeRateAsText(fromCurrency: string, toCurrency: string) {
        return `1 ${this.currency3Letters(fromCurrency)} = ${this.exchangeRate(fromCurrency, toCurrency)} ${this.currency3Letters(toCurrency)}`;
    }

    // 100, USD, RON
    value(value: number, fromCurrency: string, toCurrency: string) {
        const returnValue = value * this.exchangeRate(fromCurrency, toCurrency);
        return parseFloat(returnValue.toFixed(4));
    }

    text(value: number, fromCurrency: string, toCurrency: string) {

        return this.value(value, fromCurrency, toCurrency) + ' ' + this.currencySymbol(this.currency3Letters(toCurrency));
    }

    currency3Letters(currency: string) {
        currency = currency || '';
        switch (currency.toLowerCase()) {
            case 'eur':
            case 'euro': return 'EUR';
            case 'lei':
            case 'ron': return 'RON';
            case 'usd':
            case 'dollar': return 'USD';
            case 'lev':
            case 'leva': return 'BGN';
            default: return 'EUR';
        }
    }

    currencySymbol(currency: string) {
        currency = currency || '';
        switch (currency.toLowerCase()) {
            case 'eur':
            case 'euro': return '€';
            case 'ron': return 'lei';
            case 'usd':
            case 'dollar': return '$';
            case 'leva': return 'лв';
            default: return '';
        }
    }

    // private getExchangeRate(fromCurrency: string, toCurrency: string) {
    //     const fromCurrencyInEruro = this.currencyRatesForEuro[fromCurrency.toUpperCase()];
    //     const toCurrencyInEruro = this.currencyRatesForEuro[toCurrency.toUpperCase()];


    //     return this.exchangeRates[fromCurrency + ':' + toCurrency];
    // }

    // private get exchangeRates() {
    //     Object.keys(this.currencyRatesForEuro).reduce((res, i) => {

    //     }, {});

    //     return {};
    // }
}