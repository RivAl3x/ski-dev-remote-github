import { Component, OnInit } from '@angular/core';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';


@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,  useValue: { color: 'primary' },
  }]
})
export class SuccessComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    
  }

}
