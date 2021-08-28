export class SearchData {
    officeTypes?: any;
    location?: any;
    startDate?: any;
    endDate?: any;
    participants?: any;

    public constructor(
        officeTypes: any = '',
        location: any = '',
        startDate: any = '',
        endDate: any = '',
        participants: any = '',
    ) {
        this.officeTypes = officeTypes;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.participants = participants;
    }
}