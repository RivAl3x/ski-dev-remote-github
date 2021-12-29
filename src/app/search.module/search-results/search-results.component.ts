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
  selectedGroupType: ListOption[] = [];
  selectedFiltersActivity: ListOption[] = [];
  selectedFiltersAge: ListOption[] = [];
  selectedFiltersLanguage: ListOption[] = [];
  selectedFiltersAbility: ListOption[] = [];

  groupType = [
    {
      id: 1,
      name: 'Group',
      code: 'group',
    },
    {
      id: 2,
      name: 'Private',
      code: 'private',
    },
  ];

  participantsAge = [
    {
      id: 1,
      name: 'Adults',
      code: 'adults',
    },
    {
      id: 2,
      name: 'Teens',
      code: 'teens',
    },
    {
      id: 3,
      name: 'Children',
      code: 'children',
    },
  ];

  spokenLanguage = [
    {
      id: 1,
      name: 'English',
      code: 'english',
    },
    {
      id: 2,
      name: 'Romana',
      code: 'romana',
    },
  ];

  ability = [
    {
      id: 1,
      name: 'Beginner',
      value: 'beginner',
    },
    {
      id: 2,
      name: 'Intermediate',
      value: 'intermediate',
    },
    {
      id: 3,
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
  public documente: SkiSchoolModel[];
  filteredListings: SkiSchoolModel[];
  constructor(
    public appSettings: AppSettings,
    private activatedRoute: ActivatedRoute,
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
    this.extraFilters = { typeOfLessons: 'private' };

    this.imagesLoaded = true;

    console.log('Extra-filters=>', this.extraFilters);

    this.getSkiSchools();

    this.filterForm = this.fb.group({
      groupType: new FormArray([]),
      participantsAge: new FormArray([]),

      slideFiltersLanguage: new FormArray([]),
      ability: new FormArray([]),
    });
    this.filters = history.state.data || {};
    // console.info('history.state.data: ', history.state.data);
  }

  onLessonTypeChange(e, filterItemId) {
    // console.info('mat slide event -- ', e);
    const selectedGroupType: FormArray = this.filterForm.get(
      'groupType'
    ) as FormArray;

    if (e.checked) {
      selectedGroupType.push(new FormControl(filterItemId));
    } else {
      let i: number = 0;
      selectedGroupType.controls.forEach((item: FormControl) => {
        if (item.value == filterItemId) {
          selectedGroupType.removeAt(i);
          return;
        }
        i++;
      });
    }
    console.info('selected filter const:', selectedGroupType);
    this.onFormSubmit();
    console.info('Filter form values from first array:', this.filterForm.value);
  }
  onActivityChange(e, filterItemId) {
    console.info('mat slide event -- ', e);
    const selectedFiltersActivity: FormArray = this.filterForm.get(
      'participantsAge'
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
      'ability'
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
    this.getSkiSchools();
  }

  ngOnDestroy() {}

  onScroll(): void {
    this.imagesLoaded = true;

    this.searchResultsService
      .getSkiSchools(
        this.filters,
        this.extraFilters,
        ++this.pageNumber,
        this.pageSize
      )
      .subscribe((response) => {
        this.resultsSki.push(...response);
      });
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

  @HostListener('window:resize')
  public onWindowResize(): void {
    window.innerWidth < 575 ? (this.mode = 'over') : (this.mode = 'side');
  }

  deleteFilters() {
    this.filterForm.reset();
    this.extraFilters = {};
    // this.loadResults();
    this.getSkiSchools();
  }
  //start decembrie
  public getSkiSchools() {
    this.searchResultsService
      .getSkiSchools(
        this.filters,
        this.extraFilters,
        ++this.pageNumber,
        this.pageSize
      )
      .subscribe((data) => {
        this.documente = data;
        console.log('getSkiSchools =>', this.documente);
        console.log('Extra-filters=>', this.extraFilters);
      });
  }

  applyKeywordFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    console.info('filterValue', filterValue);

    this.filteredListings = this.documente.filter((listing) => {
      return (
        listing.skiSchoolName
          .toLowerCase()
          .search(filterValue.trim().toLowerCase()) !== -1
      );
    });
  }
}
