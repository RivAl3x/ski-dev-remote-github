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
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
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
export class SettingsDialogComponent implements OnInit {
  public form: FormGroup;
  public validationOptions = [];
  public settings: any;

  constructor(
    public accountService: AccountService,
    public currentUser: CurrentUser,
    public dialogRef: MatDialogRef<SettingsDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.validationOptions = this.loadValidationOptions();
    this.settings = this.loadSettings();

    this.initForm(this.settings);

  }
  
  loadValidationOptions() {
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

  loadSettings() {
    return {
      autoValidation: 1,
    }
  }

  private initForm(settings) {

    let autoValidationMapped = settings.autoValidation ? settings.autoValidation : null;
    
    this.form = new FormGroup({
      autoValidation: new FormControl(autoValidationMapped, Validators.required),
    });
  }

  public onSubmit() {
    console.info('this.form.value -- ', this.form.value);

  }

}
