import { Pipe, PipeTransform } from '@angular/core';
import { infor } from '../model/infor';


@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(infors:infor[] = [],searchValue:string): infor {
    if (!infors || !searchValue)
    {
      return  ;
    }
    // return user.filter(data => data.username.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) ;
  }

}
