import { Directive, ElementRef, Input, SimpleChange } from '@angular/core';
//import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';
@Directive({
  selector: '[appMaskDate]'
})
export class MaskDateDirective {
  @Input('appMaskDate') typeMask: any;
  maskDateTime = [/\d/,/\d/, '/', /\d/,/\d/, '/', /\d/,/\d/, /\d/,/\d/,'', /\d/,/\d/,':', /\d/,/\d/];
  maskDate = [ /\d/,/\d/, '/', /\d/,/\d/, '/',  /\d/,/\d/, /\d/,/\d/];
  maskedInputController;

  constructor( private element: ElementRef) { 
    this.updateMask();
  }

  updateMask(){
    // this.maskedInputController = textMask.maskInput({
    //   inputElement: this.element.nativeElement,
    //   mask: this.typeMask === 'date' ? this.maskDate: this.maskDateTime,
    //   showMask: false,
    //   guide: false
    // })
  }

  ngOnDestroy(){
    this.maskedInputController.destroy();
  }

  ngOnChanges(changes: SimpleChange):void {
    Object.getOwnPropertyNames(changes).forEach(change =>{
      if(change === 'typeMask'){
        this.typeMask = changes[change].currentValue;
        this.updateMask;
      }
    })
  }
}
