import { Component, OnInit } from '@angular/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IBookedSpaceModel } from 'src/app/account.module/_models/booked-space.model';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { AccountService } from '../../_services/account.service';


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
  
  constructor(
    private accountService: AccountService,
    private activatedRoute: ActivatedRoute,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => { 
      this.loadBooking(params['id']); 
    }); 
  }

  public cancelBooking(bookedSpace) {
    let message = 'Reservation cancelled!';

    this.accountService.cancelBooking(bookedSpace.id).subscribe((response) => {
      this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'bottom', duration: 5000 });
      this.router.navigate(['/account/bookings']);
    },(error) => {
      this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'bottom', duration: 5000 });
    });
  }

  private loadBooking(id) {
    this.accountService.getBookingById(id).subscribe((response) => {
      console.info('getBookings response -- ', response);
      
      this.booking = response.bookings[0];
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  } 
}
