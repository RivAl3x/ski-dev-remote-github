import { Component, OnInit, ViewChild, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Product, Category } from "../../app.models";
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import { SearchResultsService } from '../_services/search-results.service';
import * as moment from 'moment';
import { FiltersDialogComponent } from '../_components/filters-dialog/filters-dialog.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  public sortings = ['Sort by Default', 'Best match', 'Lowest first', 'Highest first'];
  public sort:any;

  public filters: any;
  public extraFilters: any;

  public throttle = 0;
  public distance = 2;

  public pageNumber = 1;
  public pageSize = 2;
  public totalRecords = 0;

  public results: ListingModel[] = [];
  public imagesLoaded: boolean = true;
  
  public settings: Settings;

  constructor(
    public appSettings:AppSettings, 
    private activatedRoute: ActivatedRoute, 
    public appService:AppService, 
    public dialog: MatDialog, 
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchResultsService: SearchResultsService
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.extraFilters = {};
    
    this.imagesLoaded = true;
    
    console.info('history.state.data: ', history.state.data);

    this.filters = history.state.data || {};

    this.loadResults(); 
  }

  onScroll(): void {
    this.imagesLoaded = true;

    this.searchResultsService.getSearchResults(this.filters, this.extraFilters, ++this.pageNumber, this.pageSize).subscribe((response) => {
      this.results.push(...response);

      let count = this.results.length;

      this.results.map((listing) => {
        this.searchResultsService.getListingImageById(listing.id).subscribe((imageResponse) => {
          listing.description.images[0] = imageResponse;

          count--;
          this.imagesLoaded = count == 0 ? false : true;
        });
      });
    });
  }

  public openFiltersDialog(){
    const dialogRef = this.dialog.open(FiltersDialogComponent, {
      data: {
        filters: this.extraFilters,
      },
      panelClass: ['theme-dialog'],
      autoFocus: false,
      direction: 'ltr' 
    });

    dialogRef.afterClosed().subscribe(filters => { 
      if(filters) {     
        console.info('filters afterClosed -- ', filters);

        this.extraFilters = filters;
        this.loadResults();
      }
    });
  }

  loadResults() {
    this.imagesLoaded = true;

    this.searchResultsService.getSearchResults(this.filters, this.extraFilters, this.pageNumber, this.pageSize).subscribe((response) => {
      this.results = response;

      let count = this.results.length;

      this.results.map((listing) => {
        this.searchResultsService.getListingImageById(listing.id).subscribe((imageResponse) => {
          listing.description.images[0] = imageResponse;

          count--;
          this.imagesLoaded = count == 0 ? false : true;
        });
      });
    });

  }

}
