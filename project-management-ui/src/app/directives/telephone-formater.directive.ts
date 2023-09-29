import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTelephoneFormaterDirective]'
})
export class TelephoneFormaterDirective {

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef
  ) { }

  @HostListener('input', ['$event.target.value']) onInput(eventValue: string) {
    eventValue = eventValue.split(' ').join('');

    let value = '';

    eventValue.split('').join('').match(/.{1,3}/g).map((item) => {
      value += value !== '' ? (' ' + item) : item
    });

    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      value);
  }  
}
