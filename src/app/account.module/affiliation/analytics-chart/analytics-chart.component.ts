import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-chart',
  templateUrl: './analytics-chart.component.html',
  styleUrls: ['./analytics-chart.component.scss']
})
export class AnalyticsChartComponent { 

  public monthlyHoursUsage: any[] = [
    {
      name: 'Allocated Hours',
      series: [
        {
          name: 'January',
          value: 20
        },
        {
          name: 'February',
          value: 20
        },
        {
          name: 'March',
          value: 25
        },
        {
          name: 'April',
          value: 30
        },
        {
          name: 'May',
          value: 30
        },
        {
          name: 'June',
          value: 25
        },
        {
          name: 'July',
          value: 20
        },
        {
          name: 'August',
          value: 10
        }, 
        {
          name: 'September',
          value: 20
        },
        {
          name: 'October',
          value: 25
        },
        {
          name: 'November',
          value: 30
        },
        {
          name: 'December',
          value: 25
        }
      ]
    },
    {
      name: 'Used Hours',
      series: [
        {
          name: 'January',
          value: 14
        },
        {
          name: 'February',
          value: 16
        },
        {
          name: 'March',
          value: 18
        },
        {
          name: 'April',
          value: 15
        },
        {
          name: 'May',
          value: 12
        },
        {
          name: 'June',
          value: 14
        },
        {
          name: 'July',
          value: 12
        },
        {
          name: 'August',
          value: 6
        }, 
        {
          name: 'September',
          value: 10
        },
        {
          name: 'October',
          value: 15
        },
        {
          name: 'November',
          value: 20
        },
        {
          name: 'December',
          value: 15
        }
      ]
    },
  ];

  public showXAxis = true;
  public showYAxis = true;
  public gradient = false;
  public showLegend = true;
  public showXAxisLabel = true;
  public xAxisLabel = 'Months';
  public showYAxisLabel = true;
  public yAxisLabel = 'Hours';
  public colorScheme = {
    domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
  }; 
  public autoScale = true; 
  
  constructor() { 
    Object.assign(this, this.monthlyHoursUsage)   
  }
  
  onSelect(event) {
    console.log(event);
  }

}
