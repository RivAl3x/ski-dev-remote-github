import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingsService } from '../_services/listings.service';
import { ListingModel } from '../_models/listing.model';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { MatSelectChange } from '@angular/material/select';

import { SkiSchoolModel } from '../_models/ski-schools.model';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
})
export class ListingsComponent implements OnInit {
  // localListings: ListingModel[] = [];
  // localListingsApiIds = [];
  // apiListings: ListingModel[] = [];
  // listings: ListingModel[] = [];
  // filteredListings: ListingModel[] = [];
  // listing: ListingModel;
  //1
  officeTypes: ListOption[] = [];
  statuses: ListOption[] = [];

  //16.12.2021
  localListingsSki: SkiSchoolModel[] = [];
  localListingsApiIdsSki = [];
  apiListingsSki: SkiSchoolModel[] = [];
  listingsSki: SkiSchoolModel[]= [];
  listingSki: SkiSchoolModel[]= [];
  filteredListingsSki: SkiSchoolModel[] = [];

  //

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private listingService: ListingsService,
    public dialog: MatDialog,
    private localDBService: LocalDBService
  ) {}

  ngOnInit() {
    this.getStatuses();
    // setTimeout(() => this.loadOfficeTypes(), 500);

    // this.loadAllListings();
    // this.getSkiSchools2();
    this.loadAllListingsSki();

  }

  ////16.12.2021 start
  // public getSkiSchools2() {
  //   this.listingService.getSkiSchools2().subscribe((response) => {
  //     this.listingsSki = response;
  //     console.log('getSkiSchools2 =>', this.listingsSki);
  //   });
  // }
  loadAllListingsSki() {
    console.log("apelare metoda loadAllListingsSki (#1)");

    this.localListingsSki = [];
    this.localListingsApiIdsSki = [];

    // this.apiListingsSki = [];

    this.listingService.getHardCodedListings().subscribe((response) => {
      console.info('loadLocalListings response -- ', response);
      this.localListingsSki = response;
      this.listingsSki = response;

      this.localListingsApiIdsSki = response.map((a) => a.id);

      this.loadApiListingsSki();
    });
  }

  loadApiListingsSki() {
    console.log("apelare metoda loadApiListingsSki (#2)");
    console.info('this.localListingsApiIds -- ', this.localListingsApiIdsSki);

    this.listingService.getHardCodedListings().subscribe((response) => {
      console.info('loadApiListings response -- ', response);
      response.map((apiListing) => {

   //verificare sa nu afiseze si din db local si din db api mai multe documente la fel
        if (!this.localListingsApiIdsSki.includes(apiListing.id)) {
          // this.apiListingsSki.push(apiListing);
          this.listingsSki.push(apiListing);
          console.log(this.listingSki, "LISTINGS SKI");

        }
        this.filteredListingsSki = this.listingsSki;
      });
    });
  }

  applyKeywordFilterSki(event: Event) {
    console.log("apelare metoda applyKeywordFilterSki (#3)");
    const filterValue = (event.target as HTMLInputElement).value;
    // console.info('filterValue', filterValue);
    this.filteredListingsSki = this.listingsSki.filter((listing) => {
      if (listing.description) {
        return listing.description.toLowerCase().search(filterValue.trim().toLowerCase()) !== -1;
      }
    });
    console.log("filteredListingsSki",this.filteredListingsSki);
    // this.getFilteredListingsSki()

  }
  // getFilteredListingsSki(){
  //   return this.listingsSki =this.filteredListingsSki;
  // }



  //end 16.12.2021

  //2
  // loadOfficeTypes() {
  //   return this.localDBService.getOfficeTypes().subscribe((response) => {
  //     this.officeTypes = response;
  //   });
  // }

  // loadAllListings() {
  //   this.localListings = [];
  //   this.apiListings = [];
  //   this.localListingsApiIds = [];

  //   this.listingService.getLocalListings().subscribe((response) => {
  //     console.info('loadLocalListings response -- ', response);
  //     this.localListings = response;
  //     this.listings = response;

  //     this.localListingsApiIds = response.map((a) => a.id);

  //     this.loadApiListings();
  //   });
  // }

  // loadApiListings() {
  //   console.info('this.localListingsApiIds -- ', this.localListingsApiIds);

  //   this.listingService.getApiListings().subscribe((response) => {
  //     console.info('loadApiListings response -- ', response);
  //     response.map((apiListing) => {
  //       if (!this.localListingsApiIds.includes(apiListing.id)) {
  //         this.apiListings.push(apiListing);
  //         this.listings.push(apiListing);
  //       }
  //       this.filteredListings = this.listings;
  //     });
  //   });
  // }

  // applyKeywordFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;

  //   console.info('filterValue', filterValue);

  //   this.filteredListings = this.listings.filter((listing) => {
  //     if (listing.location.name) {
  //       return (
  //         listing.location.name
  //           .toLowerCase()
  //           .search(filterValue.trim().toLowerCase()) !== -1
  //       );
  //     }
  //   });
  // }

  // applyOfficeTypeFilter(event: MatSelectChange) {
  //   const filterValues = event.value;

  //   console.info('filterValues', filterValues);

  //   this.filteredListings = this.listings.filter((listing) => {
  //     if (listing.description.officeTypes) {
  //       return listing.description.officeTypes.some((v) =>
  //         filterValues.includes(v)
  //       );
  //     }
  //   });
  // }

  // applyStatusFilter(event: MatSelectChange) {
  //   const filterValues = event.value;

  //   console.info('filterValues', filterValues);
  //   console.info('filterValues.length', filterValues.length);

  //   this.filteredListings = this.listings.filter((listing) => {
  //     if (listing.idStatus) {
  //       return filterValues.includes(listing.idStatus);
  //     }
  //   });
  // }

  saveDraft(localId) {
    this.listingService
      .getListingByLocalId(localId)
      .subscribe(async (response) => {
        console.info('indexedDb listing response -- ', response);

        this.listingSki = response;

        this.listingService.saveListing(this.listingSki, localId, 5);

        // this.loadAllListingsSki();
      });
  }

  public removeListing(id: any, idStatus: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this listing?',
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (idStatus == 1) {
          //delete local listing
          this.listingService.deleteLocalListing(id);
          // setTimeout(() => this.loadAllListingsSki(), 300);
        } else {
          //delete api listing
          this.listingService.deleteApiListing(id);
          // setTimeout(() => this.loadAllListingsSki(), 300);
        }
      }
    });
  }

  getStatuses() {
    this.statuses = [
      { id: 1, code: 'loc-local' },
      { id: 4, code: 'loc-publish' },
      { id: 5, code: 'loc-draft' },
    ];
  }

  ngOnDestroy() {}
}
