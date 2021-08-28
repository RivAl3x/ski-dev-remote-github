import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { IAvailableHoursModel } from '../../_models/available-hours.model';
import { $animations } from 'src/app/_theme/utils/app-animations';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss'],
  animations: $animations
})
export class HoursComponent implements OnInit {

  constructor() { }

  @Input() listingForm: FormGroup;
  @Input() savedAvailableHours: Array<IAvailableHoursModel>;

  availableHours: Array<IAvailableHoursModel> = [];
  weekdays: Array<any> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  workdays: Array<any> = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  weekend: Array<any> = ['saturday', 'sunday'];
  showDifferentHours: boolean = false;
  showSaturdayHours: boolean = false;
  showSundayHours: boolean = false;

  ngOnInit() {
    this.setAvailableHours();
    this.onChanges();
  }

  onChanges(): void {
    this.listingForm.get('hours').get('fromHours').valueChanges.subscribe(val => {
      this.patchFromHoursValues(val);
    });

    this.listingForm.get('hours').get('toHours').valueChanges.subscribe(val => {
      this.patchToHoursValues(val);
    });
  }

  onDifferentHoursChange(e) {
    if (e.checked) {
      this.showDifferentHours = true;
    } else {
      this.showDifferentHours = false;
    }
  }

  onSatOpenChange(e) {
    if (e.checked) {
      this.addAvailableHours('saturday');
      this.showSaturdayHours = true;
    } else {
      this.deleteAvailableHours('saturday');
      this.showSaturdayHours = false;
    }
  }

  onSunOpenChange(e) {
    if (e.checked) {
      this.addAvailableHours('sunday');
      this.showSundayHours = true;
    } else {
      this.deleteAvailableHours('sunday');
      this.showSundayHours = false;
    }
  }

  get availableHoursControls() {
    return (this.listingForm.get('hours').get('availableHours') as FormArray).controls;
  }

  get differentHoursValue() {
    return this.listingForm.get('hours').get('differentHours').value;
  }

  patchFromHoursValues(fromHours = null) {
    this.availableHoursControls.map((hoursControl) => {
      hoursControl.patchValue({
        fromHours: fromHours,
      })
    });
  }

  patchToHoursValues(toHours = null) {
    this.availableHoursControls.map((hoursControl) => {
      hoursControl.patchValue({
        toHours: toHours,
      })
    });
  }

  setAvailableHours() {
    console.info('this.savedAvailableHours -- ', this.savedAvailableHours);

    if (this.savedAvailableHours.length > 0) {
      //console.info('has saved Hours !!!');

      this.savedAvailableHours.map((availableHour) => {
        (<FormArray>this.listingForm.get('hours').get('availableHours')).push(
          new FormGroup({
            id: new FormControl(null),
            weekday: new FormControl(availableHour.weekday),
            fromHours: new FormControl(availableHour.fromHours),
            toHours: new FormControl(availableHour.toHours)
          })
        );
      });
    } else {
      //console.info('NO saved Hours !!!');

      this.workdays.map((weekday) => {
        (<FormArray>this.listingForm.get('hours').get('availableHours')).push(
          new FormGroup({
            id: new FormControl(null),
            weekday: new FormControl(weekday),
            fromHours: new FormControl(null),
            toHours: new FormControl(null)
          })
        );
      });
    }

    //console.info('mapped available hours', this.availableHoursControls);
  }

  private getFromHoursByWeekday(weekday) {
    let availableHour = this.savedAvailableHours.find(availableHours => availableHours.weekday == weekday);

    let fromHours = '';

    if (availableHour) {
      fromHours = availableHour.fromHours;
    } 

    return fromHours;
  }

  private getToHoursByWeekday(weekday) {
    let availableHour = this.savedAvailableHours.find(availableHours => availableHours.weekday == weekday);

    let toHours = '';

    if (availableHour) {
      toHours = availableHour.toHours;
    } 

    return toHours;
  }

  deleteAvailableHours(selectedDay) {
    (<FormArray>this.listingForm.get('hours').get('availableHours')).removeAt(
      this.availableHoursControls.findIndex(
        day => day.get('weekday').value == selectedDay
      )
    );
  }

  addAvailableHours(selectedDay) {
    (<FormArray>this.listingForm.get('hours').get('availableHours')).push(
      new FormGroup({
        id: new FormControl(null),
        weekday: new FormControl(selectedDay),
        fromHours: new FormControl(null),
        toHours: new FormControl(null)
      })
    );

    //console.info('mapped available hours', this.availableHoursControls);
  }

  resetAvailableHours() {
    (<FormArray>this.listingForm.get('hours').get('availableHours')).clear();
  }

}
