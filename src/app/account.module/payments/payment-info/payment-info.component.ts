import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  public payment = { 
    id: 1, 
    number: '#3258', 
    date: 'March 29, 2021', 
    status: 'Completed', 
    total: '140', 
    itemsCount: '2',
    items: [
      {
        id: 1076,
        name: 'Listing name',
        listingTypeName: 'apartment',
        countryName: 'Romania',
        locality: 'Bucharest',
        bookedSpaces:[
          {
            id: 2192,
            idAvailableSpace: 2068,
            availableSpaceName: "desk1",
            bookedPrice: 40,
            bookedUnitsNo: 1,
            checkin: '10.06.2021, 08:00',
            checkout: '12.06.2021, 08:00',
            idOfficeType: 1,
            officeTypeCode: "hot-desk"
          }
        ]
      }
    ] 
  };

  public address = {
    partmentSuite: "5",
    bankAccount: null,
    bankName: null,
    billingAddressType: "PF",
    companyName: null,
    countryName: "Romania",
    firstName: "Daniel",
    floor: "2",
    id: 1,
    idCountry: 1,
    isDefault: false,
    lastName: "Chis",
    locality: "Bucharest1",
    regCom: null,
    state: "Bucharest1",
    streetAddress: "Alunisului",
    vatId: null,
    zipCode: "077015"
  }
  
  constructor() { }

  ngOnInit() { }

  public cancel(listingId, bookedSpace) {
    console.info('cancel bookedSpace: ', bookedSpace);
  }

}
