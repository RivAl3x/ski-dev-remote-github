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


@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
})
export class ListingsComponent implements OnInit {

  localListings: ListingModel[] = [];
  localListingsApiIds = [];
  apiListings: ListingModel[] = [];
  listings: ListingModel[] = [];
  filteredListings: ListingModel[] = [];

  listing: ListingModel;

  officeTypes: ListOption[] = [];
  statuses: ListOption[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private listingService: ListingsService,
    public dialog: MatDialog, 
    private localDBService: LocalDBService
  ) { }

  ngOnInit() {
    this.getStatuses();
    setTimeout(() => this.loadOfficeTypes(), 500);

    this.loadAllListings();
  }

  loadOfficeTypes() {
    return this.localDBService.getOfficeTypes().subscribe((response) => {
      this.officeTypes = response;
    });
  }

  loadAllListings() {
    this.localListings = [];
    this.apiListings = [];
    this.localListingsApiIds = [];

    this.listingService.getLocalListings().subscribe((response) => {
      console.info('loadLocalListings response -- ', response);
      this.localListings = response;
      this.listings = response;
      this.localListingsApiIds = response.map(a => a.id);

      this.loadApiListings();
    });
  }

  loadApiListings() {
    console.info('this.localListingsApiIds -- ', this.localListingsApiIds);

    this.listingService.getApiListings().subscribe((response) => {
      console.info('loadApiListings response -- ', response);
      response.map((apiListing) => {
        if (!this.localListingsApiIds.includes(apiListing.id)) {
          this.apiListings.push(apiListing);
          this.listings.push(apiListing);
        }
        this.filteredListings = this.listings;
      })
    });
  }

  applyKeywordFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    console.info('filterValue', filterValue);
    
    this.filteredListings = this.listings.filter(listing => {
      if (listing.location.name) {
        return listing.location.name.toLowerCase().search(filterValue.trim().toLowerCase()) !== -1;
      }
    });
  }

  applyOfficeTypeFilter(event: MatSelectChange) {
    const filterValues = event.value;

    console.info('filterValues', filterValues);
    
    this.filteredListings = this.listings.filter(listing => {
      if (listing.description.officeTypes) {
        return listing.description.officeTypes.some(v => filterValues.includes(v));
      }
    });
  }

  applyStatusFilter(event: MatSelectChange) {
    const filterValues = event.value;

    console.info('filterValues', filterValues);
    console.info('filterValues.length', filterValues.length);
    
    this.filteredListings = this.listings.filter(listing => {
      if (listing.idStatus) {
        return filterValues.includes(listing.idStatus);
      }
    });
  }

  saveDraft(localId) {
    this.listingService.getListingByLocalId(localId).subscribe(async response => {
      console.info('indexedDb listing response -- ', response);

      this.listing = response;

      this.listingService.saveListing(this.listing, localId, 5);

      this.loadAllListings();
    });

  }

  public removeListing(id: any, idStatus: any){  
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        message: "Are you sure you want remove this listing?"
      }
    }); 
    dialogRef.afterClosed().subscribe(dialogResult => { 
      if(dialogResult){

        if (idStatus == 1) {
          //delete local listing
          this.listingService.deleteLocalListing(id);
          setTimeout(() => this.loadAllListings(), 300);

        } else {
          //delete api listing
          this.listingService.deleteApiListing(id);
          setTimeout(() => this.loadAllListings(), 300);
        }
      } 
    }); 
  }

  getStatuses() {
    this.statuses = [
      {id: 1, code: 'loc-local'},
      {id: 4, code: 'loc-publish'},
      {id: 5, code: 'loc-draft'}
    ];
  }

  ngOnDestroy() {
    
  }

}
