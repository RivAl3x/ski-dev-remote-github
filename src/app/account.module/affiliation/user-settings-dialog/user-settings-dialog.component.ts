import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDBService } from 'src/app/_core.module/common.module/services/localDb.service';
import { Observable } from 'rxjs';
import { ListOption } from 'src/app/_shared/models/list-option.model';
import { map, startWith } from 'rxjs/operators';
import { $animations } from 'src/app/_theme/utils/app-animations';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS } from '@angular/material/slide-toggle';
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';
import { Guid } from 'guid-typescript';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.scss'],
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
export class UserSettingsDialogComponent implements OnInit {
  public form: FormGroup;
  public billingAddresses = [];

  public loading: boolean = false;
  public affiliation: any;

  constructor(
    public accountService: AccountService,
    public currentUser: CurrentUser,
    public dialogRef: MatDialogRef<UserSettingsDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {

    console.info('passed aff data: ', this.data);
    
    //this.loadBillingAddresses();

    this.affiliation = this.data.affiliation;
    this.billingAddresses = this.data.billingAddresses;

    this.initForm();

    this.mapSavedAffiliationData();

  }
  
  private initForm() {

    this.form = new FormGroup({
      affiliationData: new FormArray([]),
    });

  }

  initAffiliationData() {
    return new FormGroup({
      //id: new FormControl(null),
      idBillingAddress: new FormControl(null, Validators.required),
      monthlyHours: new FormControl(null, Validators.required),
    });
  }

  get affiliationDataControls() {
    //console.info((this.form.get('affiliationData') as FormArray).controls);
    return (this.form.get('affiliationData') as FormArray).controls;
  }

  mapSavedAffiliationData() {
    if(this.affiliation.affiliationData.length) {
      this.affiliation.affiliationData.map((affiliationData, index) => {
        (<FormArray>this.form.get('affiliationData')).push(
          new FormGroup({
            //id: new FormControl(affiliationData.id),
            idBillingAddress: new FormControl(affiliationData.idBillingAddress),
            monthlyHours: new FormControl(affiliationData.monthlyHours),
          })
        );
      });
    } else {
      this.onAddAffiliationData();
    }
  }

  onAddAffiliationData() {
    //console.info('availableTopicsControls -- ', this.availableTopicsControls);

    (<FormArray>this.form.get('affiliationData')).push(
      this.initAffiliationData()
    );
  }

  onDeleteAffiliationData(index: number) {
    (<FormArray>this.form.get('affiliationData')).removeAt(index);
  }



  loadBillingAddresses() {
    this.accountService.getBillingAddresses().subscribe((response) => {
      console.info('getBillingAddresses response -- ', response);
      
      this.billingAddresses = response;
    });
  }

  public onSubmit() {
    console.info('this.form.value -- ', this.form.value);

    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }

  }

}
