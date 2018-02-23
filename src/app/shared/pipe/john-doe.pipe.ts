import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'johnDoe'
})
export class JohnDoePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value || 'John Doe';
  }

}
