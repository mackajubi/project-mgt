import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textShortner'
})
export class TextShortnerPipe implements PipeTransform {

  transform(text: any, limit: number): any {
    const max = limit ? limit : 25;
    return text.length > max ? text.substring(0, max) + '...' : text;
  }

}
