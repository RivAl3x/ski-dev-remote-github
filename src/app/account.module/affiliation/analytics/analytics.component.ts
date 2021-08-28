import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AffiliationAnalyticsComponent implements OnInit {
  private sub: any;
  public affiliationId: number;

  public affiliationData = [
    {
      hoursUsageData: [
        {
          name: "Used Hours",
          value: "16"
        },
        {
          name: "Remaining Hours",
          value: "4"
        }
      ],
      month: "Aug 2021",
      allocatedHours: 20,
      usedHours: 16,
      bookings: [
        {
          checkin: "2021-06-17T05:00:00Z",
          checkout: "2021-06-19T05:00:00Z",
          hostContact: "-",
          id: 1,
          idUser: 17,
          latitude: "44.37982128456053",
          listingId: 1082,
          listingName: "last listing",
          longitude: "26.16943359375",
          officeName: "desk",
          officeTypeCode: "hot-desk",
          officeTypeId: 1,
          reservationNo: "-",
        },
        {
          checkin: "2021-06-21T05:00:00Z",
          checkout: "2021-06-25T05:00:00Z",
          hostContact: "-",
          id: 3,
          idUser: 17,
          latitude: "44.37982128456053",
          listingId: 1082,
          listingName: "last listing",
          longitude: "26.16943359375",
          officeName: "desk",
          officeTypeCode: "hot-desk",
          officeTypeId: 1,
          reservationNo: "-",
        }
      ]
    },
    {
      hoursUsageData: [
        {
          name: "Used Hours",
          value: "12"
        },
        {
          name: "Remaining Hours",
          value: "8"
        }
      ],
      month: "July 2021",
      allocatedHours: 20,
      usedHours: 12,
      bookings: [
        {
          checkin: "2021-06-17T05:00:00Z",
          checkout: "2021-06-19T05:00:00Z",
          hostContact: "-",
          id: 1,
          idUser: 17,
          latitude: "44.37982128456053",
          listingId: 1082,
          listingName: "last listing",
          longitude: "26.16943359375",
          officeName: "desk",
          officeTypeCode: "hot-desk",
          officeTypeId: 1,
          reservationNo: "-",
        },
        {
          checkin: "2021-06-21T05:00:00Z",
          checkout: "2021-06-25T05:00:00Z",
          hostContact: "-",
          id: 3,
          idUser: 17,
          latitude: "44.37982128456053",
          listingId: 1082,
          listingName: "last listing",
          longitude: "26.16943359375",
          officeName: "desk",
          officeTypeCode: "hot-desk",
          officeTypeId: 1,
          reservationNo: "-",
        }
      ]
    },
    {
      hoursUsageData: [
        {
          name: "Used Hours",
          value: "15"
        },
        {
          name: "Remaining Hours",
          value: "10"
        }
      ],
      month: "June 2021",
      allocatedHours: 25,
      usedHours: 15,
      bookings: [
        {
          checkin: "2021-06-17T05:00:00Z",
          checkout: "2021-06-19T05:00:00Z",
          hostContact: "-",
          id: 1,
          idUser: 17,
          latitude: "44.37982128456053",
          listingId: 1082,
          listingName: "last listing",
          longitude: "26.16943359375",
          officeName: "desk",
          officeTypeCode: "hot-desk",
          officeTypeId: 1,
          reservationNo: "-",
        },
        {
          checkin: "2021-06-21T05:00:00Z",
          checkout: "2021-06-25T05:00:00Z",
          hostContact: "-",
          id: 3,
          idUser: 17,
          latitude: "44.37982128456053",
          listingId: 1082,
          listingName: "last listing",
          longitude: "26.16943359375",
          officeName: "desk",
          officeTypeCode: "hot-desk",
          officeTypeId: 1,
          reservationNo: "-",
        }
      ]
    }
  ];

  constructor(
    public localDBService: LocalDBService, 
    public formBuilder: FormBuilder, 
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public currentUser: CurrentUser ,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => { 
      this.affiliationId = params['id']; 
    }); 

  }

  

}
