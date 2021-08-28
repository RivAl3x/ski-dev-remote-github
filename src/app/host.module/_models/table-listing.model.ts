export class TabelListingModel {
    listingName?: string;
    location?: string;
    status?: string;
    modifiedDate?: string;

    public constructor(
        listingName: string = '',
        location: string = '',
        status: string = '',
        modifiedDate: string = '',
    ) {
        this.listingName = listingName;
        this.location = location;
        this.status = status;
        this.modifiedDate = modifiedDate;
    }
}