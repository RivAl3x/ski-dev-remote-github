import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../app.service';
import { Product, Category } from '../../app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { isPlatformBrowser } from '@angular/common';
import { ListingModel } from 'src/app/host.module/_models/listing.model';
import { SearchResultsService } from '../_services/search-results.service';
import * as moment from 'moment';
import { FiltersDialogComponent } from '../_components/filters-dialog/filters-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { NgxStarRatingModule } from 'ngx-star-rating';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  public sortings = [
    'Sort by Default',
    'Best match',
    'Lowest first',
    'Highest first',
  ];
  public sort: any;

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
  public localResults: any[];
  avg: number;
  ratingsValue: any;
  ratingsCount: any;
  stars: string[];

  constructor(
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
    public matCardModule: MatCardModule,
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
    this.loadLocalResults();
  }

  onScroll(): void {
    this.imagesLoaded = true;

    this.searchResultsService
      .getSearchResults(
        this.filters,
        this.extraFilters,
        ++this.pageNumber,
        this.pageSize
      )
      .subscribe((response) => {
        this.results.push(...response);

        let count = this.results.length;

        this.results.map((listing) => {
          this.searchResultsService
            .getListingImageById(listing.id)
            .subscribe((imageResponse) => {
              listing.description.images[0] = imageResponse;

              count--;
              this.imagesLoaded = count == 0 ? false : true;
            });
        });
      });
  }

  //dialog replaced with filters-sidenav

  // public openFiltersDialog(){
  //   const dialogRef = this.dialog.open(FiltersDialogComponent, {
  //     data: {
  //       filters: this.extraFilters,
  //     },
  //     panelClass: ['theme-dialog'],
  //     autoFocus: false,
  //     direction: 'ltr'
  //   });

  //   dialogRef.afterClosed().subscribe(filters => {
  //     if(filters) {
  //       console.info('filters afterClosed -- ', filters);

  //       this.extraFilters = filters;
  //       this.loadResults();
  //     }
  //   });
  // }

  loadResults() {
    this.imagesLoaded = true;

    this.searchResultsService
      .getSearchResults(
        this.filters,
        this.extraFilters,
        this.pageNumber,
        this.pageSize
      )
      .subscribe((response) => {
        this.results = response;

        let count = this.results.length;

        this.results.map((listing) => {
          this.searchResultsService
            .getListingImageById(listing.id)
            .subscribe((imageResponse) => {
              listing.description.images[0] = imageResponse;

              count--;
              this.imagesLoaded = count == 0 ? false : true;
            });
        });
      });
  }

  loadLocalResults() {
    this.localResults = [
      {
        id: 1,
        skiSchoolId: '65435634',
        description: 'Private Ski Lesson (All Levels)',
        skiSchoolName: 'Ski School Predeal',
        typeOfLessons: 'private',
        maximumParticipants: 4,
        minimumAge: 5,
        price: '55 €',
        ratingStars: '200', //*20
        ratingsCount: '3',
        about:
          "Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recentl",
        image:
          'https://www.ischgl.com/media/2015/002_winter/wintersport/ischgl/skischule/image-thumb__134725__lightbox/gruppenfoto-2016.webp',
        particularities: {
          lessonType: {
            group: true,
            private: true,
          },
          activity: {
            skiing: true,
            snowboarding: false,
            offPisteSkiing: true,
          },
          ability: {
            begginer: true,
            intermediate: true,
            advanced: true,
          },
          age: {
            adults: true,
            teens: true,
            children: true,
          },
          language: ['romanian', 'english', 'french'],
        },
      },
      {
        id: 2,
        skiSchoolId: '4324325',
        description: 'Adult Group Ski Lessons (All Levels)',
        skiSchoolName: 'Ski School Brasov',
        typeOfLessons: 'group',
        maximumParticipants: 2,
        minimumAge: 18,
        price: '35 €',
        ratingStars: '320', //*20
        ratingsCount: '4',
        about:
          "Randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem",
        image: 'https://www.instructor-ski.ro/en/database/site_01.jpg',
        particularities: {
          lessonType: {
            group: true,
            private: false,
          },
          activity: {
            skiing: true,
            snowboarding: false,
            offPisteSkiing: false,
          },
          ability: {
            begginer: true,
            intermediate: true,
            advanced: true,
          },
          age: {
            adults: true,
            teens: false,
            children: false,
          },
          language: ['romanian', 'english'],
        },
      },
      {
        id: 3,
        skiSchoolId: '8766966',
        description: 'Private Off Piste Guiding',
        skiSchoolName: 'Ski School Sinaia',
        typeOfLessons: 'private',
        maximumParticipants: 8,
        minimumAge: 16,
        price: '62 €',
        ratingStars: '1900', //*20
        ratingsCount: '10',
        about:
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit',
        image:
          'https://www.galtuer.com/media/galtuer/WINTER/FAMILIEN_KINDER/image-thumb__105539__hero-slide-small_auto_de5e1d4f98150146b7bce6c5a5a5729b/silvapark-galtuer-2016%20%2830%29.jpg',
        particularities: {
          lessonType: {
            group: true,
            private: true,
          },
          activity: {
            skiing: true,
            snowboarding: true,
            offPisteSkiing: false,
          },
          ability: {
            begginer: true,
            intermediate: true,
            advanced: true,
          },
          age: {
            adults: true,
            teens: true,
            children: true,
          },
          language: ['romanian', 'english'],
        },
      },
    ];
  }
}
