import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Calendar, CalendarApi, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { FiltersDialogComponent } from 'src/app/search.module/_components/filters-dialog/filters-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { environment } from 'src/environments/environment';
import * as request from 'superagent';
import { FilterBookingsModel } from '../../_models/filter-bookings.model';

@Component({
  selector: 'app-bookings-calendar',
  templateUrl: './bookings-calendar.component.html',
  styleUrls: ['./bookings-calendar.component.scss']
})

export class BookingsCalendarComponent {
  constructor(private localDBService: LocalDBService) { }

  public form: FormGroup;
  public filters: FilterBookingsModel = new FilterBookingsModel();

  officeTypes: ListOption[] = [];

  @ViewChild('calendar') calendar: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    //themeSystem: 'bootstrap',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this), // bind is important!
    //events: 'https://fullcalendar.io/demo-events.json',
    //events: environment.apiUrl + 'Book/calendar',
    events: function(info, successCallback, failureCallback) {
      //console.info('info object -- ', info);

      request.get(environment.apiUrl + 'Book/calendar')
        .type('json')
        .query({
          start: info.startStr,
          end: info.endStr,
          buildingName: localStorage.getItem('buildingNameFilter'),
          officeTypes: localStorage.getItem('officeTypesFilter'),
          officeName: localStorage.getItem('officeNameFilter')
        })
        .set('Authorization', 'Bearer ' + localStorage.getItem('Token'))
        .end(function(err, res) {
  
          if (err) {
            failureCallback(err);
          } else {
            //console.info('res object - body: ', res.body)
            //return res.body;
  
            successCallback(
              Array.prototype.slice.call( // convert to array
                res.body
              ).map(function(eventEl) {
                return {
                  title: eventEl.title,
                  start: eventEl.start,
                  end: eventEl.end
                }
              })
            )
          }
        })
    }
  };

  ngOnInit() {
    setTimeout(() => this.loadOfficeTypes(), 500);

    this.initForm();

    console.info('init form', this.form);
  }

  public filterSubmit() {
    console.info('this.form.value -- ', this.form.value);

    localStorage.setItem('buildingNameFilter', this.form.get('buildingName').value);
    localStorage.setItem('officeTypesFilter', this.form.get('officeTypes').value);
    localStorage.setItem('officeNameFilter', this.form.get('officeName').value);

    let calendarApi = this.calendar.getApi();
    calendarApi.refetchEvents();

  }

  private initForm() {

    let buildingNameMapped = localStorage.getItem('buildingNameFilter');
    let officeTypesMapped = localStorage.getItem('officeTypesFilter');
    let officeNameMapped = localStorage.getItem('officeNameFilter');


    this.form = new FormGroup({
      buildingName: new FormControl(buildingNameMapped),
      officeTypes: new FormControl(officeTypesMapped),
      officeName: new FormControl(officeNameMapped),
    });
  }

  loadOfficeTypes() {
    return this.localDBService.getOfficeTypes().subscribe((response) => {
      this.officeTypes = response;
    });
  }

  handleDateClick(arg): void {
    console.log('date click! ' + arg.dateStr);
  }
  handleEventClick(arg): void {
    console.log('event click! ' + arg.dateStr);
  }

}
