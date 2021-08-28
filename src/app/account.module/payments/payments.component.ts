import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  public payments = [
    { id: 1, number: '#3258', date: 'March 29, 2021', status: 'Completed', total: '140', items: '2' },
    { id: 2, number: '#3145', date: 'February 14, 2021', status: 'On hold', total: '255.99', items: '3' },
    { id: 3, number: '#2972', date: 'January 7, 2021', status: 'Processing', total: '255.99', items: '2' },
    { id: 4, number: '#2971', date: 'January 5, 2021', status: 'Completed', total: '73.00', items: '2' },
    { id: 5, number: '#1981', date: 'December 24, 2020', status: 'Pending Payment', total: '285.00', items: '3' },
    { id: 6, number: '#1781', date: 'September 3, 2020', status: 'Refunded', total: '49.00', items: '3' }
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
