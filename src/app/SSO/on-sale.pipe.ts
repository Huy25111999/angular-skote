import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'onSale'
})
export class OnSalePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value){
      return 'Sử dụng pipe';
    }
    return null;
  }

}
