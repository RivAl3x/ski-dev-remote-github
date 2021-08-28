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
  selector: 'app-email-dialog',
  templateUrl: './email-dialog.component.html',
  styleUrls: ['./email-dialog.component.scss'],
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
export class EmailDialogComponent implements OnInit {
  public form: FormGroup;

  constructor(
    public currentUser: CurrentUser,
    public dialogRef: MatDialogRef<EmailDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void { 

    this.form = this.fb.group({
      token: new FormControl(this.data, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    }); 

  }

  public onSubmit(){
    console.log(this.form.value);

    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

}
