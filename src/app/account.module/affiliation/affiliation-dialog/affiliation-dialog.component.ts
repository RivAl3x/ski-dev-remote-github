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
import { CurrentUser } from 'src/app/_core.module/common.module/services/currentuser.service';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-affiliation-dialog',
  templateUrl: './affiliation-dialog.component.html',
  styleUrls: ['./affiliation-dialog.component.scss'],
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
export class AffiliationDialogComponent implements OnInit {
  public form: FormGroup;
  public validationTypes = [];

  constructor(
    public currentUser: CurrentUser,
    public dialogRef: MatDialogRef<AffiliationDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void { 
    this.validationTypes = this.loadValidationTypes(); 

    this.form = this.fb.group({
      token: new FormControl(this.currentUser.isCompany ? Guid.raw() : '', Validators.required),
    }); 

    if (this.currentUser.isCompany) this.form.addControl('validationType', new FormControl(1, Validators.required));

  }

  loadValidationTypes() {
    return [
      {
        id: 1,
        code: 'auto-validation',
        name: 'Auto validation'
      },
      {
        id: 2,
        code: 'manual-validation',
        name: 'Manual validation'
      }
    ];
  }

  refreshToken() {
    this.form.get('token').patchValue(Guid.raw());
  }

  public onSubmit(){
    console.log(this.form.value);

    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

}
