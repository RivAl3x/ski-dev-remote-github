export class ListingSkiDescriptionModel {
  description?: string;
  officeTypes?: Array<any>;
  availableSpaces?: Array<any>;
  availableSpacesCount?: Array<any>;
  images?: Array<any>;
  amenities?: Array<any>;

  constructor(
      description: string = '',
      officeTypes: Array<any> = [],
      availableSpaces: Array<any> = [],
      availableSpacesCount: Array<any> = [],
      images: Array<any> = [],
      amenities: Array<any> = [],
  ) {
      this.description = description;
      this.officeTypes = officeTypes;
      this.availableSpaces = availableSpaces;
      this.availableSpacesCount = availableSpacesCount;
      this.images = images;
      this.amenities = amenities;
  }
}
