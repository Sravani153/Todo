import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskPipe',
  standalone:true
})
export class MaskPipePipe implements PipeTransform {

  transform(value: string, maskChar: string = '*'): string {
    if (!value) return '';
    return maskChar.repeat(value.length);
  }}


