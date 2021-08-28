export class ListingPriceModel {
    currency?: string;
    listPrice?: number;
    availableSpacesPrice?: Array<any>

    constructor(
        currency: string = '',
        listPrice: number = 0,
        availableSpacesPrice: Array<any> = [],
    ) {
        this.currency = currency;
        this.listPrice = listPrice;
        this.availableSpacesPrice = availableSpacesPrice;
    }
}