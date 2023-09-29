import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCheckAgainstMaxValue]'
})
export class CheckAgainstMaxValueDirective {

  @Input() max = 0;

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef
  ) { }

  @HostListener('input', ['$event.target.value']) onInput(eventValue: string) {
    const value = parseInt(eventValue, 10);

    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      Number.isNaN(value) ? eventValue : (value > this.max ? this.max : value)
    )
  }

}
