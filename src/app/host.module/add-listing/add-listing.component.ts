import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { count, delay, last } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { ListingsService } from '../_services/listings.service';
import { ListingModel } from '../_models/listing.model';
import { Guid } from "guid-typescript";
import { Location } from '@angular/common';
import { ListingDocumentsModel } from '../_models/listing-documents.model';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { AppService } from 'src/app/app.service';


@Component({
  selector: 'app-add-listing',
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false, showError: true}
  }]
})
export class AddListingComponent implements OnInit {

  listingForm: FormGroup;
  listing: ListingModel = new ListingModel();
  //updatedListing: ListingModel;

  listingLocalId: string;
  listingId: any;

  listingTypes: ListOption[] = [];
  officeTypes: ListOption[] = [];
  amenities: ListOption[] = [];
  currencies: ListOption[] = [];
  countries: ListOption[] = [];
  //27.12.2021
  lessonTypes: ListOption[]=[];
  //29.12.2021
  skiAmenities: ListOption[]=[];
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private listingService: ListingsService,
    private localDBService: LocalDBService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.loadListingTypes();
    this.loadOfficeTypes();
    this.loadAmenities();
    this.loadCurrencies();
    this.loadCountries();
    //27.12.2021
    this.loadLessonTypes();
    this.loadSkiAmenities();




    this.listingLocalId = this.route.snapshot.queryParamMap.get('local_id'); // QueryParamMap is for eg. user/:id?tab=edit. Tab is a global query param, it can be read from the ActivatedRoute in the user route's component as well as any of its ancestors.
    this.listingId = this.route.snapshot.paramMap.get('id'); // ParamMap for routes like user/:id. Id param belongs only to this route.

    if(this.listingLocalId) {
      console.info('found local_id in url: ', this.listingLocalId);             // #1 daca fieldul "localId" exista, ia listarea din indexDB

      this.getListingFromLocalDB();
    } else if(this.listingId) {
      console.info('found id in url: ', this.listingId);                        // #2 daca id ul documentului exista in url, ia listarea din API

      this.getListingFromApi();
    } else {
      this.initForm();                                                          // daca niciuna din contidiile de mai sus nu sunt valabile, creaza formul apeland initForm()
    }

  }

  getListingFromLocalDB() {                                                     // #1 daca fieldul "localId" exista, ia listarea din indexDB
    this.listingService.getListingByLocalId(this.listingLocalId).subscribe((response) => {
      console.info('indexedDb listing response -- ', response);

      this.listing = response;
      this.initForm(this.listing);                                              // si afisaza formul cu valorile respective la care subscrii dupa ce primesti raspunsul
    });
  }

  getListingFromApi() {                                                         // #2 daca id ul documentului exista in url, ia listarea din API
    this.listingService.getListingById(this.listingId).subscribe((listingResponse) => {
      this.listing = listingResponse;
      //this.initForm(this.listing);

      this.listingService.getListingImagesById(this.listingId).subscribe((imagesResponse) => {   //  atasaza la this.listing si obiectul this.listing.description.images
        this.listing.description.images = imagesResponse;

        this.initForm(this.listing);                                             // si afisaza formul cu valorile respective la care subscrii dupa ce primesti raspunsul
      })
    });
  }

  loadListingTypes() {
    this.localDBService.getListingTypes().subscribe((response) => {
      this.listingTypes = response;
    });
  }


  loadOfficeTypes() {
    return this.localDBService.getOfficeTypes().subscribe((response) => {
      this.officeTypes = response;
      // console.log(this.officeTypes, "officetypes");

    });
  }
  //27.12.2021

  // loadLessonTypes() {
  //   return this.localDBService.getLessonTypes().subscribe((response) => {
  //     this.lessonTypes = response;
  //     console.log(this.lessonTypes, "lessonTypes");
  //   });
  // }

    loadLessonTypes() {
      var source = of([
      { 'id': '1', 'code': 'skiing', 'name':'Skiing' },
      { 'id': '2', 'code': 'snowboarding','name':'Snowboarding' },
      { 'id': '3', 'code': 'off-piste-skiing','name':'Off-piste-skiing' },
      { 'id': '4', 'code': 'off-piste-snowboarding','name':'Off-piste-snowboarding' },
      { 'id': '5', 'code': 'ski-touring','name':'Ski-touring'}
    ]);
      source.subscribe((val => this.lessonTypes=val));
      // console.log("LESSON TYPE:",this.lessonTypes);

    };

    loadSkiAmenities() {
      var source = of([
        {id: '1', 'code': 'amenities-skis-rental', 'name':'Skis rental'},
        {id: '2', 'code': 'amenities-snowboards-rental', 'name':'Snowboards rental'},
        {id: '3', 'code': 'amenities-sleds-rental', 'name':'Sleds rental'},
        {id: '4', 'code': 'amenities-mountain-access', 'name':'Mountain access'},
        {id: '5', 'code': 'amenities-parking', 'name':'Parking'},
        {id: '6', 'code': 'amenities-skis-sharpening', 'name':'Skis sharpening'},
        {id: '7', 'code': 'amenities-skis-waxing', 'name':'Skis waxing'}
      ]);
      source.subscribe((val => this.skiAmenities=val));
      // console.log("SKI AMENETIES:", this.skiAmenities);

    };



  loadAmenities() {
    return this.localDBService.getOfficeAmenities().subscribe((response) => {
      this.amenities = response;
    });
  }

  loadCurrencies() {
    return this.localDBService.getCurrencies().subscribe((response) => {
      this.currencies = response;
    });
  }

  loadCountries() {
    return this.localDBService.getCountries().subscribe((response) => {
      this.countries = response;
    });
  }

  getListingTypes() {
    this.listingTypes = [
      {id: '1', code: 'shared-office2'},
      {id: '2', code: 'private-house'},
      {id: '3', code: 'apartment'},
      {id: '4', code: 'coffee-place'},
      {id: '5', code: 'hotel-lounge'}
    ];
  }

  getOfficeTypes() {
    this.officeTypes = [
      {id: '1', code: 'hot-desk2'},
      {id: '2', code: 'private-office'},
      {id: '3', code: 'team-room'},
      {id: '4', code: 'meeting-room'},
      {id: '5', code: 'test'}
    ];
    console.log(this.officeTypes, "getOfficeTypes")
  }

  getAmenities() {
    this.amenities = [
      {id: '1', code: 'amenities-coffee'},
      {id: '2', code: 'amenities-printing'},
      {id: '3', code: 'amenities-meeting-rooms'},
      {id: '4', code: 'amenities-essentials'},
      {id: '5', code: 'amenities-wifi'},
      {id: '6', code: 'amenities-sport-room'},
      {id: '7', code: 'amenities-parking'}
    ];
  }

  getCurrencies() {
    this.currencies = [
      {id: '1', code: 'EUR'},
      {id: '2', code: 'USD'},
      {id: '3', code: 'RON'}
    ];
  }

  //27.12.2021

  // getLessonTypes(){
  //   this.lessonTypes = [
  //     {id: '1', code: 'ski'},
  //     {id: '2', code: 'snowboard'}
  //   ]
  //   console.log(this.lessonTypes);

  // }

  onStepChange(step) { //la schimbarea stepului
    this.listingForm.get('modifiedDate').patchValue(Date.now()); // se aplica Date.now() in campul modifiedDate

    //map country id and name from automcomplete obj value
    let countryObj = this.listingForm.get('location').get('country').value;//se defineste fieldul location.country
    if (countryObj) { //daca acesta exista,
      this.listingForm.get('location').get('idCountry').patchValue(countryObj.id); // pune valoare location.idCountry cu id ul aferent
      this.listingForm.get('location').get('countryName').patchValue(countryObj.name); // pune valoare location.countryName cu val  aferenta
    }

    this.listing = this.listingForm.value; //this.listing inializat sus, de forma ListingModel, are acum valoarea formularului actual, in functie de step-ul la care am dat next

    console.info('this.listing', this.listing);

    if (!this.listingLocalId) { //daca fieldul "localId" (logat si in consola), incrementalul stabilit in dexie.service.ts nu exista,
      this.listingService.addListingToIndexedDb(this.listing).then((localId) => { //mergi in metoda din serviciu si probabil trimiti tot obiectul si intorci localId generat acolo
        console.info('indexedDb listing id = ', localId);
        this.listingLocalId = localId.toLocaleString();
        const url = this.router.createUrlTree([], {relativeTo: this.route, queryParams: {local_id: this.listingLocalId}}).toString()
        this.location.go(url);
      });
    } else {
      this.listingService.saveListingToIndexedDb(this.listingLocalId, this.listing);//altfel, acum ca avem listingLocalId si obiectul listing, salveaza listarea in indexDB
    }

  }

  async onSaveListing(idStatus: number) {
    this.listing = this.listingForm.value;

    await this.listingService.saveListing(this.listing, this.listingLocalId, idStatus);
  }

  private initForm(listing: ListingModel = new ListingModel()) {
    console.info('listing: ListingModel -- ', listing);

    let mappedId = listing.id ? listing.id : null;
    let mappedLocalId = listing.localId ? listing.localId : null;
    let mappedIdStatus = 1;
    let mappedStatusCode = 'loc-local';

    // --- location step
    let nameMapped = listing.location.name ? listing.location.name : '';
    let streetAddressMapped = listing.location.streetAddress ? listing.location.streetAddress : '';
    let apartmentSuiteMapped = listing.location.apartmentSuite ? listing.location.apartmentSuite : '';
    let localityMapped = listing.location.locality ? listing.location.locality : '';
    let stateMapped = listing.location.state ? listing.location.state : '';
    let zipCodeMapped = listing.location.zipCode ? listing.location.zipCode : '';
    let idCountryMapped = listing.location.idCountry ? listing.location.idCountry : '';
    let countryNameMapped = listing.location.countryName ? listing.location.countryName : '';
    let countryMapped = listing.location.country ? listing.location.country : '';
    let latitudeMapped = listing.location.latitude ? listing.location.latitude : '';
    let longitudeMapped = listing.location.longitude ? listing.location.longitude : '';
    let listingTypeMapped = listing.location.listingType ? listing.location.listingType : '';

    // --- description  step
    let descriptionMapped = listing.description.description ? listing.description.description : '';
    let officeTypesMapped = listing.description.officeTypes;
    let availableSpacesMapped = listing.description.availableSpaces;
    let imageFilesMapped = '';
    let imagesMapped = [];
    let amenitiesMapped = listing.description.amenities;

    // --- price step
    let currencyMapped = listing.price.currency ? listing.price.currency : '';
    let availableSpacesPriceMapped = listing.price.availableSpacesPrice;

    // --- hours step
    let availableHoursMapped = listing.hours.availableHours ? listing.hours.availableHours : '';
    let fromHoursMapped = listing.hours.fromHours ? listing.hours.fromHours : '';
    let toHoursMapped = listing.hours.toHours ? listing.hours.toHours : '';
    let differentHoursMapped = listing.hours.differentHours;
    let satOpenMapped = listing.hours.satOpen;
    let sunOpenMapped = listing.hours.sunOpen;

    // --- payment step
    let idMapped = listing.payment.id ? listing.payment.id : '';
    let bankMapped = listing.payment.bank ? listing.payment.bank : '';
    let ibanMapped = listing.payment.iban ? listing.payment.iban : '';
    let swiftMapped = listing.payment.swift ? listing.payment.swift : '';
    let localityPaymentMapped = listing.payment.locality ? listing.payment.locality : '';
    let streetPaymentMapped = listing.payment.street ? listing.payment.street : '';
    let streetNoPaymentMapped = listing.payment.streetNo ? listing.payment.streetNo : '';
    let apartmentPaymentMapped = listing.payment.apartment ? listing.payment.apartment : '';
    let floorPaymentMapped = listing.payment.floor ? listing.payment.floor : '';
    let zipCodePaymentMapped = listing.payment.zipCode ? listing.payment.zipCode : '';

    this.listingForm = new FormGroup({
      id: new FormControl(mappedId),
      //localId: new FormControl(mappedLocalId),
      idStatus: new FormControl(mappedIdStatus),
      statusCode: new FormControl(mappedStatusCode),
      modifiedDate: new FormControl(''),
      location: new FormGroup({
        name: new FormControl(nameMapped, Validators.required),
        streetAddress: new FormControl(streetAddressMapped, Validators.required),
        apartmentSuite: new FormControl(apartmentSuiteMapped),
        locality: new FormControl(localityMapped, Validators.required),
        state: new FormControl(stateMapped, Validators.required),
        // zipCode: new FormControl(zipCodeMapped, Validators.required),
        idCountry: new FormControl(idCountryMapped, Validators.required),
        countryName: new FormControl(countryNameMapped),
        country: new FormControl(countryMapped, Validators.required),
        latitude: new FormControl(latitudeMapped, Validators.required),
        longitude: new FormControl(longitudeMapped, Validators.required),
        listingType: new FormControl(listingTypeMapped, Validators.required),
      }),

      description: new FormGroup({
        description: new FormControl(descriptionMapped, Validators.required),
        officeTypes: new FormArray([]),
        availableSpaces: new FormArray([]),
        imageFiles: new FormControl(imageFilesMapped),
        images: new FormControl(imagesMapped),
        amenities: new FormArray([]),
      }),

      price: new FormGroup({
        currency: new FormControl(currencyMapped, Validators.required),
        availableSpacesPrice: new FormArray([]),
      }),

      hours: new FormGroup({
        availableHours: new FormArray([]),
        fromHours: new FormControl(fromHoursMapped),
        toHours: new FormControl(toHoursMapped),
        differentHours: new FormControl(differentHoursMapped),
        satOpen: new FormControl(satOpenMapped),
        sunOpen: new FormControl(sunOpenMapped),

      }),

      payment: new FormGroup({
        id: new FormControl(idMapped, Validators.required),
      }),

      documents: new FormGroup({

      })
    });
  }

}
