import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  Inject,
  PLATFORM_ID,
  Input,
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
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent,
  PerfectScrollbarDirective,
} from 'ngx-perfect-scrollbar';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { ListOption } from 'src/app/_shared/models/list-option.model';
import { SkiSchoolModel } from 'src/app/host.module/_models/ski-schools.model';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  filterForm: FormGroup;
  submittedValue: any;


  // @Input() officeTypes: ListOption[] = [];
  @Input() selectedSlideFiltersLessonType: Array<any>;
  @Input() selectedFiltersActivity: Array<any>;
  @Input() selectedFiltersAge: Array<any>;
  @Input() selectedFiltersLanguage: Array<any>;
  @Input() selectedFiltersAbility: Array<any>;


  slideFiltersLessonType = [
    {
      id: 1,
      name: 'Group',
      value: 'group',
    },
    {
      id: 2,
      name: 'Private',
      value: 'Private',
    }];

    slideFiltersActivity = [
    {
      id: 3,
      name: 'Skiing',
      value: 'skiing',
    },
    {
      id: 4,
      name: 'Snowboarding',
      value: 'snowboarding',
    }];

    slideFiltersAge = [
    {
      id: 5,
      name: 'Adults',
      value: 'adults',
    },
    {
      id: 6,
      name: 'Teens',
      value: 'teens',
    },
  ];

  slideFiltersLanguage = [
    {
      id: 5,
      name: 'Adults',
      value: 'adults',
    },
    {
      id: 6,
      name: 'Teens',
      value: 'teens',
    },
  ];

  slideFiltersAbility = [
    {
      id: 7,
      name: 'Beginner',
      value: 'beginner',
    },
    {
      id: 8,
      name: 'Intermediate',
      value: 'intermediate',
    },
    {
      id: 9,
      name: 'Advanced',
      value: 'advanced',
    },
  ];

  public sortings = [
    'Sort by Default',
    'Best match',
    'Lowest first',
    'Highest first',
  ];
  public config: PerfectScrollbarConfigInterface = {};

  @ViewChild(PerfectScrollbarComponent)
  componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveRef?: PerfectScrollbarDirective;

  public mode = 'side';

  public sort: any;

  public filters: any;
  public extraFilters: any;

  public throttle = 0;
  public distance = 2;

  public pageNumber = 1;
  public pageSize = 2;
  public totalRecords = 0;

  public results: ListingModel[] = [];
  //start
  public resultsSki: SkiSchoolModel[] = [];
  //end
  public imagesLoaded: boolean = true;

  public settings: Settings;
  public localResults: any[];
  avg: number;
  ratingsValue: any;
  ratingsCount: any;
  stars: string[];
  type: string;
  public documente: any[];;

  constructor(
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
    public appService: AppService,
    public dialog: MatDialog,
    public matCardModule: MatCardModule,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private searchResultsService: SearchResultsService,
    public fb: FormBuilder
  ) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.extraFilters = {};

    this.imagesLoaded = true;

    console.info('history.state.data: ', history.state.data);


    this.filters = history.state.data || {};

    // this.loadResults();
    // this.loadLocalResults();
    //start
    this.loadResultsDocumente();

    console.info(this.resultsSki)

    // this.onFetchData()
    //end

    this.filterForm = this.fb.group({
      slideFiltersLessonType: new FormArray([]),
      slideFiltersActivity: new FormArray([]),
      slideFiltersAge: new FormArray([]),
      slideFiltersLanguage: new FormArray([]),
      slideFiltersAbility: new FormArray([]),

    });
  }



  onLessonTypeChange(e, filterItemId) {
    // console.info('mat slide event -- ', e);
    const selectedSlideFiltersLessonType: FormArray = this.filterForm.get(
      'slideFiltersLessonType'
    ) as FormArray;

    if (e.checked) {
      selectedSlideFiltersLessonType.push(new FormControl(filterItemId));
    } else {
      let i: number = 0;
      selectedSlideFiltersLessonType.controls.forEach((item: FormControl) => {
        if (item.value == filterItemId) {
          selectedSlideFiltersLessonType.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.info('selected filter const:', selectedSlideFiltersLessonType);
    this.onFormSubmit();
    console.info('Filter form values from first array:', this.filterForm.value);

  }
  onActivityChange(e, filterItemId) {
    console.info('mat slide event -- ', e);
    const selectedFiltersActivity: FormArray = this.filterForm.get(
      'slideFiltersActivity'
    ) as FormArray;

    if (e.checked) {
      selectedFiltersActivity.push(new FormControl(filterItemId));
    } else {
      let i: number = 0;
      selectedFiltersActivity.controls.forEach((item: FormControl) => {
        if (item.value == filterItemId) {
          selectedFiltersActivity.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.info('selected filter const:', selectedFiltersActivity);
    this.onFormSubmit();
  }
  onAgeChange(e, filterItemId) {
    console.info('mat slide event -- ', e);
    const selectedFiltersAge: FormArray = this.filterForm.get(
      'slideFiltersLanguage'
    ) as FormArray;

    if (e.checked) {
      selectedFiltersAge.push(new FormControl(filterItemId));
    } else {
      let i: number = 0;
      selectedFiltersAge.controls.forEach((item: FormControl) => {
        if (item.value == filterItemId) {
          selectedFiltersAge.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.info('selected filter const:', selectedFiltersAge);
    this.onFormSubmit();
  }
  onLanguageChange(e, filterItemId) {
    console.info('mat slide event -- ', e);
    const selectedFiltersLanguage: FormArray = this.filterForm.get(
      'slideFiltersLanguage'
    ) as FormArray;

    if (e.checked) {
      selectedFiltersLanguage.push(new FormControl(filterItemId));
    } else {
      let i: number = 0;
      selectedFiltersLanguage.controls.forEach((item: FormControl) => {
        if (item.value == filterItemId) {
          selectedFiltersLanguage.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.info('selected filter const:', selectedFiltersLanguage);
    this.onFormSubmit();
  }
  onAbilityChange(e, filterItemId) {
    console.info('mat slide event -- ', e);
    const selectedFiltersAbility: FormArray = this.filterForm.get(
      'slideFiltersAbility'
    ) as FormArray;

    if (e.checked) {
      selectedFiltersAbility.push(new FormControl(filterItemId));
    } else {
      let i: number = 0;
      selectedFiltersAbility.controls.forEach((item: FormControl) => {
        if (item.value == filterItemId) {
          selectedFiltersAbility.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.info('selected filter const:', selectedFiltersAbility);
    this.onFormSubmit();
  }

  onFormSubmit() {
    this.extraFilters = this.filterForm.value;
    // this.loadResults();
    // this.loadLocalResults();
    this.loadResultsDocumente();
  }

  ngOnDestroy() {

  }

  onScroll(): void {
    this.imagesLoaded = true;

    this.searchResultsService
      .getSki(
        // this.filters,
        // this.extraFilters,
        // ++this.pageNumber,
        // this.pageSize
      )
      // .subscribe((response) => {
      //   this.results.push(...response);
      // });
  }
  public scrollToTop(): void {
    if (this.type === 'directive' && this.directiveRef) {
      this.directiveRef.scrollToTop();
    } else if (
      this.type === 'component' &&
      this.componentRef &&
      this.componentRef.directiveRef
    ) {
      this.componentRef.directiveRef.scrollToTop();
    }
  }


  ////Start
  // loadResultsSki() {
  //   this.imagesLoaded = true;
  //   this.searchResultsService
  //     .getSearchResultsSki(
  //       this.filters,
  //       this.extraFilters,
  //       this.pageNumber,
  //       this.pageSize
  //     )
  //     .subscribe((response:any[]) => {
  //       this.resultsSki = response;
  //       console.log("RESPONSE SEARCH",response);
  //     });
  // }
    loadResultsDocumente(){
     this.documente= this.searchResultsService
      .getSki();
    }


  @HostListener('window:resize')
  public onWindowResize(): void {
    window.innerWidth < 575 ? (this.mode = 'over') : (this.mode = 'side');
  }

  deleteFilters() {
    this.filterForm.reset();
    this.extraFilters = {};
    // this.loadResults();
    this.loadResultsDocumente();
  }
  //start decembrie
  public getSki(){
    this.documente = this.searchResultsService.getSki();
    console.info(this.documente, "documentele")
  }
}
