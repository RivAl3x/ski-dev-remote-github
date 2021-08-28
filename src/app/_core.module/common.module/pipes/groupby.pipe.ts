import { Pipe, PipeTransform } from '@angular/core';
import { isArray } from 'util';

@Pipe({
  name: 'groupby'
})
export class GroupByPipe implements PipeTransform {
  transform(value: Array<object>, prop: string) {
    if (!isArray(value)) { throw new Error('GroupBy Pipe: value must be array'); }
    if (!prop) { throw new Error('GroupBy Pipe: property must be set'); }

    return value.reduce((groups, item) => {
      const val = item[prop];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }
}