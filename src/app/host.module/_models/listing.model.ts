import { ListingDescriptionModel } from "./listing-description.model";
import { ListingDocumentsModel } from "./listing-documents.model";
import { ListingHoursModel } from "./listing-hours.model";
import { ListingLocationModel } from "./listing-location.model";
import { ListingPaymentModel } from "./listing-payment.model";
import { ListingPriceModel } from "./listing-price.model";
import { ISpaceAvailablePriceModel } from "./space-available-price.model";

export class ListingModel {
    id?: any;
    localId?: any;
    idStatus?: any;
    statusCode?: string;
    modifiedDate: any;
    location?: ListingLocationModel;
    description?: ListingDescriptionModel;
    price?: ListingPriceModel;
    hours?: ListingHoursModel;
    payment?: ListingPaymentModel;
    documents?: ListingDocumentsModel;
    bookedSpaces?: ISpaceAvailablePriceModel[];

    /* public constructor(init?: Partial<ListingModel>) {
        Object.assign(this, init);
    } */

    public constructor(
        id: any = null,
        localId: any = null,
        idStatus: any = null,
        statusCode: string = '',
        modifiedDate: any = null,
        location: ListingLocationModel = new ListingLocationModel(),
        description: ListingDescriptionModel = new ListingDescriptionModel,
        price: ListingPriceModel = new ListingPriceModel,
        hours: ListingHoursModel = new ListingHoursModel,
        payment: ListingPaymentModel= new ListingPaymentModel,
        documents: ListingDocumentsModel = new ListingDocumentsModel,
        bookedSpaces: ISpaceAvailablePriceModel[] = []
    ) {
        this.id = id;
        this.localId = localId;
        this.idStatus = idStatus;
        this.statusCode = statusCode;
        this.modifiedDate = modifiedDate;
        this.location = location;
        this.description = description;
        this.price = price;
        this.hours = hours;
        this.payment = payment;
        this.documents = documents;
        this.bookedSpaces = bookedSpaces;
    }
}
