export class ListingPaymentModel {
    id: any;
    bank: string;
    iban: string;
    swift: string;
    locality?: string;
    street?: string;
    streetNo?: string;
    apartment?: string;
    floor?: string;
    zipCode?: string;
    listingType?: string;

    public constructor(
        id: any = '',
        bank: string = '',
        iban: string = '',
        swift: string = '',
        locality: string = '',
        street: string = '',
        streetNo: string = '',
        apartment: string = '',
        floor: string = '',
        zipCode: string = '',
        listingType: string = '',
    ) {
        this.id = id;
        this.bank = bank;
        this.iban = iban;
        this.swift = swift;
        this.locality = locality;
        this.street = street;
        this.streetNo = streetNo;
        this.apartment = apartment;
        this.floor = floor;
        this.zipCode = zipCode;
        this.listingType = listingType;
    }

}