import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingModel } from '../_models/listing.model';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/_shared/components/confirm-dialog/confirm-dialog.component';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { MatSelectChange } from '@angular/material/select';
import { ListingsService } from '../_services/listings.service';
import { BookingDialogComponent } from './booking-dialog/booking-dialog.component';
import { SearchResultsService } from 'src/app/search.module/_services/search-results.service';


@Component({
  selector: 'app-inhouse-bookings',
  templateUrl: './inhouse-bookings.component.html',
  styleUrls: ['./inhouse-bookings.component.scss'],
})
export class InhouseBookingComponent implements OnInit {

  listings: ListingModel[] = [];
  filteredListings: ListingModel[] = [];

  officeTypes: ListOption[] = [];
  statuses: ListOption[] = [];

  public imagesLoaded: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private listingsService: ListingsService,
    public dialog: MatDialog, 
    private localDBService: LocalDBService,
    private searchResultsService: SearchResultsService
  ) { }

  ngOnInit() {
    this.imagesLoaded = true;
    
    setTimeout(() => this.loadOfficeTypes(), 300);

    this.loadApiListings();
  }

  loadOfficeTypes() {
    return this.localDBService.getOfficeTypes().subscribe((response) => {
      this.officeTypes = response;
    });
  }

  loadApiListings() {
    this.imagesLoaded = true;

    this.listingsService.getApiListings().subscribe((response) => {
      console.info('loadApiListings response -- ', response);

      this.listings = response;
      this.filteredListings = this.listings;

      let count = this.listings.length;

      this.listings.map((listing) => {
        this.searchResultsService.getListingImageById(listing.id).subscribe((imageResponse) => {
          listing.description.images[0] = imageResponse;

          count--;
          this.imagesLoaded = count == 0 ? false : true;
        });
      });
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

  public openBookingDialog(data:any){
    const dialogRef = this.dialog.open(BookingDialogComponent, {
      data: {
        listing: data,
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    /* dialogRef.afterClosed().subscribe(address => { 
      if(address) {     
        console.info('address afterClosed -- ', address);

        const index: number = this.addresses.findIndex(x => x.id == address.id);
        let message = index !== -1 ? 'Billind address added.' : 'Billing address updated.'
        
        this.accountService.saveBillingAddress(address)
          .subscribe((response) => {
            this.snackBar.open(message, '×', { panelClass: 'success', verticalPosition: 'top', duration: 5000 });
            setTimeout(() => this.loadBillingAddresses(), 300);
          },(error) => {
            this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 5000 });
          });
      }
    }); */
  }
  

  ngOnDestroy() {
    
  }

}
