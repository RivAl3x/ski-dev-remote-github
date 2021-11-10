export class BookingData {
  startDate?: any;
  endDate?: any;
  participants?: any;
  locationMapped: any;

  public constructor(
    startDate: any = '',
    endDate: any = '',
    participants: any = '',
    locationMapped: any = ''

  ) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.participants = participants;
    this.locationMapped = locationMapped;
  }
}
