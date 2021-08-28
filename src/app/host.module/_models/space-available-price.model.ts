export interface ISpaceAvailablePriceModel {
    id: number;
    idOfficeType: number;
    idAvailableSpace: number;
    guidAvailableSpace: any;
    availableSpaceName: string;
    hourlyPrice: number;
    dayPrice: number;
    monthlyPrice: number;
    minHourly: number;
    minDay: number;
    minMonth: number;
    bookedUnitsNo: number;
    bookedPrice: number;
    checkin: any;
    checkout: any;
    isAvailable: boolean;
    bookedGuid: any;
}