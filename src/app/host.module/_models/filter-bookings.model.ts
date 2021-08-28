export class FilterBookingsModel {
    buildingName?: any;
    officeTypes?: any;
    officeName?: any;
    startDate?: any;
    endDate?: any;

    public constructor(
        buildingName: any = '',
        officeTypes: any = '',
        officeName: any = '',
        startDate: any = '',
        endDate: any = '',
    ) {
        this.officeTypes = officeTypes;
        this.officeName = officeName;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}