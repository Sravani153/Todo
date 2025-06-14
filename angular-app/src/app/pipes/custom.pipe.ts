import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom',
  standalone:true
})
export class CustomPipe implements PipeTransform {
  transform(value: string): string {
    return value ? `User: ${value.toUpperCase()}` : '';
  }
}
