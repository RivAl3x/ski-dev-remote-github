import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef
} from '@angular/core';

import { CalendarOptions } from '@fullcalendar/angular';
import { environment } from 'src/environments/environment';
import * as request from 'superagent';

@Component({
  selector: 'app-bookings-calendar',
  templateUrl: './bookings-calendar.component.html',
  styleUrls: ['./bookings-calendar.component.scss']
})

export class BookingsCalendarComponent {
  constructor() { }

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
        .type('xml')
        .query({
          start: info.startStr,
          end: info.endStr
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

  handleDateClick(arg): void {
    console.log('date click! ' + arg.dateStr);
  }
  handleEventClick(arg): void {
    console.log('event click! ' + arg.dateStr);
  }

}
