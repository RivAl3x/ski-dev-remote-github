import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { Observable } from 'rxjs';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { map, startWith } from 'rxjs/operators';
import { $animations } from 'src/app/_theme/utils/app-animations';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss'],
  providers: [
    {
      provide: MAT_RADIO_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
    },
    {
      provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
    }
  ],
  animations: $animations
})
export class AddressDialogComponent implements OnInit {
  public form: FormGroup;
  billingAddressTypes = ['PF', 'PJ'];
  filteredCountries: Observable<ListOption[]>;

  constructor(
    private localDBService: LocalDBService,
    public dialogRef: MatDialogRef<AddressDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {   

    this.form = this.fb.group({
      id: new FormControl(''), 
      billingAddressType: new FormControl('PF', Validators.required),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      companyName: new FormControl(''),
      vatId: new FormControl(''),
      regCom: new FormControl(''),
      bankName: new FormControl(''),
      bankAccount: new FormControl(''),
      streetAddress: new FormControl('', Validators.required),
      apartmentSuite: new FormControl(''),
      locality: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required),
      idCountry: new FormControl('', Validators.required),
      countryName: new FormControl(''),
      country: new FormControl(''),
      isDefault: new FormControl(false)
    }); 

    if(this.data.address){
      this.data.address.country = {id: this.data.address.idCountry, name: this.data.address.countryName};

      this.form.patchValue(this.data.address); 
    };

    this.filteredCountries = this.form.get('country').valueChanges.pipe(
      startWith(''),
      map(country => country ? this._filter(country) : this.data.countries.slice())
    );
  }

  displayFn(country: ListOption): string {
    return country && country.name ? country.name : '';
  }

  private _filter(country: any): ListOption[] {
    console.info('_filter country; ', country);

    const countryName = country.name || country;

    let filteredValues = this.data.countries.filter(country => country.name.toLowerCase().indexOf(countryName.toLowerCase()) === 0);

    console.info('filteredValues: ', filteredValues);

    return filteredValues;
  }

  public onSubmit(){
    console.log(this.form.value);

    let countryObj = this.form.get('country').value;

    this.form.get('idCountry').patchValue(countryObj.id); 
    this.form.get('countryName').patchValue(countryObj.name); 

    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

  public compareFunction(o1: any, o2: any) {
    return (o1.name == o2.name && o1.code == o2.code);
  }

}
