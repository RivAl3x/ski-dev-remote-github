export interface IBookedSpaceModel {
    id: number;
    officeTypeId: number;
    officeTypeCode: string;
    officeName: string;
    checkin: string;
    checkout: string;
    reservationNo: string;
    listingId: number;
    listingName: string;
    latitude: string;
    longitude: string;
    hostContact: {};
}