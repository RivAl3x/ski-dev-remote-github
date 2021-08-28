import { Pipe, PipeTransform } from '@angular/core';
import { appConstants } from '../models/constants';

@Pipe({
  name: 'defte'
})
export class DefaultTextPipe implements PipeTransform {
  transform(value: string, defaultText = '') {
    // string is null or spaces
    if (value === null || value.match(/^ *$/) !== null) {
      return defaultText || appConstants.defaultTextIfEmpty;
    }
    return value;
  }
}