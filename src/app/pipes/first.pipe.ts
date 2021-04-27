import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'first'
})
export class FirstPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    console.log(value[0]);
    return value[0];
  }

}
