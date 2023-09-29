import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDigitCommaSeparator]'
})
export class DigitCommaSeparatorDirective {

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef,
    private number: DecimalPipe
  ) { }

  @HostListener('input', ['$event.target.value']) onInput(eventValue: string) {
    eventValue = eventValue.split(',').join('');
    
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      this.number.transform(eventValue, '1.0-0'));
  }  
}
