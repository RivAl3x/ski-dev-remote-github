export class ListingDocumentsModel {
    bank: string;
    iban: string;

    public constructor(init?: Partial<ListingDocumentsModel>) {
        Object.assign(this, init);
    }
}