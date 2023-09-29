import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textHighlighter'
})
export class TextHighlighterPipe implements PipeTransform {

  transform(value: any, args: any): any {

    if(!args) return value;
    
    if(!value) return value;
    
    const re = new RegExp("\\n?"+args, 'igm');

    value = value.replace(re, '<span class="highlighted-text">$&</span>');
    
    return value;
  }

}
