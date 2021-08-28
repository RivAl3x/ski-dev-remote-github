import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { SearchData } from '../../_models/search-data.model';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import { startWith } from 'rxjs/operators';


@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class SearchHeaderComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  officeTypes: ListOption[] = [];

  constructor(
    public router:Router,
    private route: ActivatedRoute,
    private location: Location,
    private localDBService: LocalDBService
  ) { }

  ngOnInit() {
    setTimeout(() =>  this.loadOfficeTypes(), 500);
    this.initForm();

  }

  ngAfterViewInit() {
    
  }

  loadOfficeTypes() {
    return this.localDBService.getOfficeTypes().subscribe((response) => {
      this.officeTypes = response;
    });
  }

  public searchSubmit() {

    /* let listingLocalId = localId.toLocaleString();
    const url = this.router.createUrlTree([], { relativeTo: this.route, queryParams: { local_id: listingLocalId }}).toString()
    this.location.go(url); */

    console.info('this.form.value -- ', this.form.value);

    let startDate = moment(this.form.get('range').get('startDate').value).format();
    this.form.get('range').get('startDate').patchValue(startDate);

    let endDate = moment(this.form.get('range').get('endDate').value).format();
    this.form.get('range').get('endDate').patchValue(endDate);

    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(() => this.router.navigate(['/search/results'], { state: { data: this.form.value }}));

  }

  private initForm(searchData: SearchData = new SearchData()) {

    //let officeTypesMapped = searchData.officeTypes ? searchData.officeTypes : [];
    let locationMapped = searchData.location ? searchData.location : '';
    let startDateMapped = searchData.startDate ? searchData.startDate : '';
    let endDateMapped = searchData.endDate ? searchData.endDate : '';
    let participantsMapped = searchData.participants ? searchData.participants : '';

    this.form = new FormGroup({
      //officeTypes: new FormControl(officeTypesMapped),
      location: new FormControl(locationMapped, Validators.required),
      range: new FormGroup({
        startDate: new FormControl(startDateMapped),
        endDate: new FormControl(endDateMapped),
      }),
      participants: new FormControl(participantsMapped)
    });
  }

}
