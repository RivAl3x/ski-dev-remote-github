export class ListingHoursModel {
    availableHours?: Array<any>;
    fromHours?: string;
    toHours?: string;
    differentHours?: boolean;
    satOpen?: boolean;
    sunOpen?: boolean;

    constructor(
        availableHours: Array<any> = [],
        fromHours: string = '',
        toHours: string = '',
        differentHours: boolean = false,
        satOpen: boolean = false,
        sunOpen: boolean = false,
    ) {
        this.availableHours = availableHours;
        this.fromHours = fromHours;
        this.toHours = toHours;
        this.differentHours = differentHours;
        this.satOpen = satOpen;
        this.sunOpen = sunOpen;
    }
}