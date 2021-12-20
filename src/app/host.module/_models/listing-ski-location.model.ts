export class ListingSkiLocationModel {
  name?: string;
  streetAddress?: string;
  apartmentSuite?: string;
  locality?: string;
  state?: string;
  zipCode?: any;
  idCountry?: any;
  countryName?: string;
  country?: any;
  latitude?: any;
  longitude?: any;
  listingType?: string;
  listingTypeName?: string;

  public constructor(
      name: string = '',
      streetAddress: string = '',
      apartmentSuite: string = '',
      locality: string = '',
      state: string = '',
      zipCode: any = '',
      idCountry: any = '',
      countryName: string = '',
      country: any = '',
      latitude: any = '',
      longitude: any = '',
      listingType: string = '',
      listingTypeName: string = ''
  ) {
      this.name = name;
      this.streetAddress = streetAddress;
      this.apartmentSuite = apartmentSuite;
      this.locality = locality;
      this.state = state;
      this.zipCode = zipCode;
      this.idCountry = idCountry;
      this.countryName = countryName;
      this.country = country;
      this.latitude = latitude;
      this.longitude = longitude;
      this.listingType = listingType;
      this.listingTypeName = listingTypeName;
  }
}
