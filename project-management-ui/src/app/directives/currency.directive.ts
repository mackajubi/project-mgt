import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[appCurrencyDirective]'
})
export class CurrencyDirective {

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef, 
    private currency: CurrencyPipe
  ) { }

  @HostListener('input', ['$event.target.value']) onInput(eventValue: string) {
    const value = parseInt((eventValue.replace('UGX. ', '')).split(',').join(''));

    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      this.currency.transform(value, 'UGX. ', 'symbol', '1.0-0'));
  }

}
