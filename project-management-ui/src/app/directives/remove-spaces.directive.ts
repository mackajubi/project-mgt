import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appRemoveSpaces]'
})
export class RemoveSpacesDirective {

  constructor(
    private renderer: Renderer2, 
    private elementRef: ElementRef
  ) { }

  @HostListener('input', ['$event.target.value']) onInput(eventValue: string) {

    const value = eventValue.trim() 
    
    this.renderer.setProperty(
      this.elementRef.nativeElement,
      'value',
      value
    )
  }

}
