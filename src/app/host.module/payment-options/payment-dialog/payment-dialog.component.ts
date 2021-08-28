import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss']
})
export class PaymentDialogComponent implements OnInit {
  public form: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<PaymentDialogComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder
  ) { }

  ngOnInit(): void {   
    this.form = this.fb.group({
      id: 0, 
      bank: new FormControl('', Validators.required),
      iban: new FormControl('', Validators.required),
      swift: new FormControl('', Validators.required),
      locality: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      streetNo: new FormControl('', Validators.required),
      apartment: new FormControl('', Validators.required),
      floor: new FormControl('', Validators.required),
      zipCode: new FormControl('', Validators.required),
    }); 

    if(this.data.payment){
      this.form.patchValue(this.data.payment); 
    };
  }

  public onSubmit(){
    console.log(this.form.value);
    if(this.form.valid){
      this.dialogRef.close(this.form.value);
    }
  }

  public compareFunction(o1: any, o2: any) {
    return (o1.name == o2.name && o1.code == o2.code);
  }

}
