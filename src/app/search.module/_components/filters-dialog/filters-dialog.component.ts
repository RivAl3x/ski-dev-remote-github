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
  selector: 'app-filters-dialog',
  templateUrl: './filters-dialog.component.html',
  styleUrls: ['./filters-dialog.component.scss'],
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
export class FiltersDialogComponent implements OnInit {
  public form: FormGroup;

  public priceLevels = [
    {id: '1', code: 'less-10', name: 'Less than 10 €/day'},
    {id: '2', code: '10-to-50', name: 'Between 10 and 50 €/day'},
    {id: '3', code: '50-to-100', name: 'Between 50 and 100 €/day'},
    {id: '4', code: 'more-100', name: 'More than 100 €/day'}
  ];

  constructor(
    private localDBService: LocalDBService,
    public dialogRef: MatDialogRef<FiltersDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {   

    this.form = this.fb.group({
      priceLevels: new FormControl(''),
    }); 

    if(this.data.filters){
      this.form.patchValue(this.data.filters); 
    };
  }

  public onSubmit(){
    console.log(this.form.value);

    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

}
