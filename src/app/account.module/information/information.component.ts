import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { UserInfo } from '../_models/user-info.model';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  form: FormGroup;
  userInfo: UserInfo;

  countries = [];
  governmentIdTypes = [];
  genders = [];

  filteredCountries: Observable<ListOption[]>;

  constructor(
    public appService: AppService,
    public formBuilder: FormBuilder, 
    public snackBar: MatSnackBar,
    public currentUser: CurrentUser,
    public accountService: AccountService,
    public localDBService: LocalDBService
  ) { }

  ngOnInit() {
    //console.info(this.currentUser.user);
    this.countries = this.appService.getCountries();

    //this.loadCountries();
    this.loadGenders();
    this.loadGovernmentIdTypes();

    this.initForm();
    this.getUserInfo();
  }

  displayFn(country: ListOption): string {
    return country && country.name ? country.name : '';
  }

  private _filter(country: any): ListOption[] {
    console.info('_filter country; ', country);

    const countryName = country.name || country;

    let filteredValues = this.countries.filter(country => country.name.toLowerCase().indexOf(countryName.toLowerCase()) === 0);

    console.info('filteredValues: ', filteredValues);

    return filteredValues;
  }

  getUserInfo() {
    this.accountService.getUserInfo().subscribe((response) => {
      this.userInfo = response;
      this.initForm(this.userInfo);
    });
  }

  private initForm(info: UserInfo = new UserInfo()) {

    let emailMapped = info.email ? info.email : this.currentUser.user.email;

    let firstNameMapped = info.firstName ? info.firstName : '';
    let lastNameMapped = info.lastName ? info.lastName : '';
    let companyNameMapped = info.companyName ? info.companyName : '';

    let idGenderMapped = info.idGender ? info.idGender : '';

    let birthDateMapped = info.birthDate ? info.birthDate : '';

    let phoneNoMapped = info.phoneNo ? info.phoneNo : '';

    let idGovernmentTypeMapped = info.idGovernmentType ? info.idGovernmentType : '';


    let streetAddressMapped = info.streetAddress ? info.streetAddress : '';
    let apartmentSuiteMapped = info.apartmentSuite ? info.apartmentSuite : '';
    let localityMapped = info.locality ? info.locality : '';
    let stateMapped = info.state ? info.state : '';
    let zipCodeMapped = info.zipCode ? info.zipCode : '';
    let idCountryMapped = info.idCountry ? info.idCountry : '';

    console.info('user info -- ', info);


    this.form = new FormGroup({
      id: new FormControl(1), //needed for api
      email: new FormControl({value: emailMapped, disabled: true}),

      firstName: new FormControl(firstNameMapped, Validators.required),
      lastName: new FormControl(lastNameMapped, Validators.required),
      companyName: new FormControl(companyNameMapped, Validators.required),

      idGender: new FormControl(idGenderMapped, Validators.required),

      birthDate: new FormControl(birthDateMapped, Validators.required),

      phoneNo: new FormControl(phoneNoMapped, Validators.required),

      idGovernmentType: new FormControl(idGovernmentTypeMapped, Validators.required),
      
      streetAddress: new FormControl(streetAddressMapped, Validators.required),
      apartmentSuite: new FormControl(apartmentSuiteMapped),
      locality: new FormControl(localityMapped, Validators.required),
      state: new FormControl(stateMapped, Validators.required),
      zipCode: new FormControl(zipCodeMapped, Validators.required),
      idCountry: new FormControl(idCountryMapped, Validators.required)
    });

    this.filteredCountries = this.form.get('idCountry').valueChanges
      .pipe(
        startWith(''),
        map(country => country ? this._filter(country) : this.countries.slice())
      );

    console.info('form -- ', this.form);
  }

  onSubmit(values: UserInfo):void {
    let countryObj = this.form.get('idCountry').value;

    values.idCountry = countryObj.id;

    console.info('values mod: ', values);

    if (!this.form.valid) {
      return;
    }

    this.accountService.updateUserInfo(values)
      .subscribe((user) => {
        this.snackBar.open('Personal info updated successfully', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      },(error) => {
        this.snackBar.open(error, '×', { panelClass: 'error', verticalPosition: 'top', duration: 3000 });
      });
  }

  loadCountries() {
    return this.localDBService.getCountries().subscribe((response) => {
      this.countries = response;
    });
  }

  loadGovernmentIdTypes() {
    return this.localDBService.getGovernmentIdTypes().subscribe((response) => {
      this.governmentIdTypes = response;
    });
  }

  loadGenders() {
    return this.localDBService.getGenders().subscribe((response) => {
      this.genders = response;
    });
  }

}
