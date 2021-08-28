import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';

@Component({
  selector: 'app-hours-usage',
  templateUrl: './hours-usage.component.html',
  styleUrls: ['./hours-usage.component.scss']
})
export class HoursUsageComponent implements OnInit {

  @Input() hoursUsage;
  public data: any[]; 
  public showLegend = true;
  public gradient = false;
  public colorScheme = {
    domain: ['#c99c3b', '#2a2828']
  }; 
  public showLabels = true;
  public explodeSlices = false;
  public doughnut = false; 
  @ViewChild('resizedDiv') resizedDiv:ElementRef;
  public previousWidthOfResizedDiv:number = 0; 
  
  constructor() { }

  ngOnInit(){
    this.data = this.hoursUsage;  
  }
  
  public onSelect(event) {
    console.log(event);
  }

  ngAfterViewChecked() {    
    if(this.previousWidthOfResizedDiv != this.resizedDiv.nativeElement.clientWidth){
      setTimeout(() => this.data = [...this.hoursUsage] );
    }
    this.previousWidthOfResizedDiv = this.resizedDiv.nativeElement.clientWidth;
  }

}
