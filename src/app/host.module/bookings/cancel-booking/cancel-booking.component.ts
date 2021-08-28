import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookedSpaceModel } from 'src/app/account.module/_models/booked-space.model';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { FilterBookingsModel } from '../../_models/filter-bookings.model';
import { BookingsService } from '../../_services/bookings.service';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.scss'],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
    }
  ],
})
export class CancelBookingComponent implements OnInit {
  private sub: any;
  public booking: IBookedSpaceModel;
  public cancelReasons: ListOption[] = [];
  public form: FormGroup;

  public filters: FilterBookingsModel = new FilterBookingsModel();
  
  constructor(
    private bookingsService: BookingsService,
    private localDBService: LocalDBService,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.loadCancelReasons();

    this.sub = this.activatedRoute.params.subscribe(params => { 
      this.loadBooking(params['id']); 
    }); 

    this.initForm();
  }

  public cancelBooking(bookedSpace) {
    let message = 'Reservation cancelled!';

    this.bookingsService.cancelBooking(bookedSpace.id, this.form.get('cancelReason').value, this.form.get('details').value).subscribe((response) => {
      this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
      this.router.navigate(['/host/bookings']);
    },(error) => {
      this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
    });
  }

  private loadBooking(id) {
    this.bookingsService.getBookingById(id).subscribe((response) => {
      console.info('getBookings response -- ', response);
      
      this.booking = response.bookings[0];
    });
  }

  private initForm() {
    this.form = new FormGroup({
      cancelReason: new FormControl(null, Validators.required),
      details: new FormControl('')
    });
  }

  loadCancelReasons() {
    return this.localDBService.getCancelReasons().subscribe((response) => {
      this.cancelReasons = response;
    });
  }


}
