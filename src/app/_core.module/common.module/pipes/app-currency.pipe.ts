import { Pipe, PipeTransform } from "@angular/core";
import { AppStore } from "../services/store.service";
import { StorageService } from "../services/storage.service";

@Pipe({
    name: 'appCurrency'
})
export class AppCurrencyPipe implements PipeTransform {

    constructor(private appStore: AppStore, private storageService: StorageService) {
    }

    transform(value: string, currency: string = null, display: 's' | 'l' | string = 's', side: 'l' | 'r' = 'r'): any {
        const companyCurrency = this.preferedCurrency;
        const toCurrency = currency || companyCurrency;
        value = value ? value.toString().trim() : '';

        const currencyDisplay = display === 'l' ? toCurrency : this.currencySymbol(toCurrency);
        return side === 'l' ? currencyDisplay + " " + value : value + " " + currencyDisplay;
    }

    currencySymbol(currency: string) {
        return AppCurrencyPipe.currencySymbolFor(currency);
    }

    get preferedCurrency() {
        let preferences = this.storageService.getAsObject(this.storageService.Keys.UserPreferences);
        preferences = preferences || { currency: this.CompanyCurrency };
        return preferences.currency.toLowerCase();
    }

    get CompanyCurrency() {
        const companyCurrency = this.appStore._("crm.selectedCompany.country") || "RO";
        const countryCurrencies = {
            "RO": "RON",
            "BG": "Leva",
            "GE": "EURO",
            "US": "USD"
        };

        return countryCurrencies[companyCurrency];
    }

    isEmpty(value: any): boolean {
        return value == null || value === '' || value !== value;
    }

    public static currencySymbolFor(currency: string) {
        currency = currency || "";
        switch (currency.toLowerCase()) {
            case "eur":
            case "euro": return "€";
            case "ron": return "lei";
            case "usd":
            case "dollar": return "$";
            case "leva": return "лв";
            default: return currency;
        }
    }
}