import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByIdOffice'
})
export class FilterByIdOfficePipe implements PipeTransform {
  transform(items:Array<any>, id?) {
    return items.filter(item => item.idOfficeType == id)[0];
  }
}