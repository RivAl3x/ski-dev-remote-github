import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { ISpaceAvailableModel } from '../../_models/space-available.model';
import { ISpaceAvailablePriceModel } from '../../_models/space-available-price.model';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  constructor() { }

  @Input() listingForm: FormGroup;

  @Input() currencies: FormGroup;

  @Input() officeTypes: ListOption[];
  @Input() savedAvailableSpaces: Array<ISpaceAvailableModel> = [];
  @Input() savedAvailableSpacesPrice: Array<ISpaceAvailablePriceModel>;

  ngOnInit() {
    this.mapSavedAvailableSpacesAndPrices();

    this.onChanges();
  }

  onChanges(): void {
    this.listingForm.get('description').get('availableSpaces').valueChanges.subscribe(availableSpaces => {
      console.info('description -> availableSpaces subscribe value: ', availableSpaces);

      (<FormArray>this.listingForm.get('price').get('availableSpacesPrice')).clear();
      
      availableSpaces.map((availableSpace) => {
        (<FormArray>this.listingForm.get('price').get('availableSpacesPrice')).push(
          new FormGroup({
            id: new FormControl(this.getSavedPriceIdBySpaceGuid(availableSpace.guid)),
            idOfficeType: new FormControl(availableSpace.idOfficeType),
            availableSpaceName: new FormControl(availableSpace.name),
            idAvailableSpace: new FormControl(availableSpace.id),
            guidAvailableSpace: new FormControl(availableSpace.guid),
            hourlyPrice: new FormControl(this.getHourlySpacePriceByGuid(availableSpace.guid)),
            minHourly: new FormControl(1),
            dayPrice: new FormControl(this.getDaySpacePriceByGuid(availableSpace.guid)),
            minDay: new FormControl(1),
            monthlyPrice: new FormControl(this.getMonthlySpacePriceByGuid(availableSpace.guid)),
            minMonth: new FormControl(1)
          })
        );
      });
    });
  }

  get availableSpacesControls() {
    return (this.listingForm.get('description').get('availableSpaces') as FormArray).controls;
  }

  get availableSpacesPriceControls() {
    return (this.listingForm.get('price').get('availableSpacesPrice') as FormArray).controls;
  }

  mapSavedAvailableSpacesAndPrices() {
    console.info('this.availableSpaces -- ', this.savedAvailableSpaces);

    this.savedAvailableSpaces.map((availableSpace) => {
      (<FormArray>this.listingForm.get('price').get('availableSpacesPrice')).push(
        new FormGroup({
          id: new FormControl(this.getSavedPriceIdBySpaceGuid(availableSpace.guid)),
          idOfficeType: new FormControl(availableSpace.idOfficeType),
          availableSpaceName: new FormControl(availableSpace.name),
          idAvailableSpace: new FormControl(availableSpace.id),
          guidAvailableSpace: new FormControl(availableSpace.guid),
          hourlyPrice: new FormControl(this.getHourlySpacePriceByGuid(availableSpace.guid)),
          minHourly: new FormControl(2),
          dayPrice: new FormControl(this.getDaySpacePriceByGuid(availableSpace.guid)),
          minDay: new FormControl(1),
          monthlyPrice: new FormControl(this.getMonthlySpacePriceByGuid(availableSpace.guid)),
          minMonth: new FormControl(1)
        })
      );
    });
  }

  private getSavedPriceIdBySpaceGuid(spaceGuid) {
    let spacePrice = this.savedAvailableSpacesPrice.find(spacePrice => spacePrice.guidAvailableSpace == spaceGuid);

    if (spacePrice) {
      return spacePrice.id;
    } else {
      return null;
    }

  }

  private getHourlySpacePriceByGuid(spaceGuid) {
    let spacePrice = this.savedAvailableSpacesPrice.find(spacePrice => spacePrice.guidAvailableSpace == spaceGuid);

    let price: number = null;

    if (spacePrice) {
      price = spacePrice.hourlyPrice;
    } 

    return price;
  }

  private getDaySpacePriceByGuid(spaceGuid) {
    let spacePrice = this.savedAvailableSpacesPrice.find(spacePrice => spacePrice.guidAvailableSpace == spaceGuid);

    let price: number = null;

    if (spacePrice) {
      price = spacePrice.dayPrice;
    } 

    return price;
  }

  private getMonthlySpacePriceByGuid(spaceGuid) {
    let spacePrice = this.savedAvailableSpacesPrice.find(spacePrice => spacePrice.guidAvailableSpace == spaceGuid);

    let price: number = null;

    if (spacePrice) {
      price = spacePrice.monthlyPrice;
    } 

    return price;
  }


}
