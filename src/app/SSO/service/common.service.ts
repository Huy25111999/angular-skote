import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  validateAllForm(form: FormGroup){
    Object.keys(form.controls).forEach(field =>{
      const control = form.get(field);
      if(control instanceof FormControl){
        control.markAsTouched({onlySelf : true});
      }else if(control instanceof FormGroup){
        this.validateAllForm(control)
      }
    })
  }

  trimSpaceForm(form: FormGroup){
    Object.keys(form.controls).forEach(field =>{
      const control = form.get(field);
      if(control instanceof FormControl ){
        const value = control.value;
        if(typeof value === 'string'){
          control.setValue(value.trim());

        }
      }else if(control instanceof FormGroup){
        this.trimSpaceForm(control)
      }
    })
  }

  setValueIsNull(form: FormGroup){
    Object.keys(form.controls).forEach(field =>{
      const control = form.get(field);
      if(control instanceof FormGroup){
        const value = control.value;
        if( value === ''){
          control.setValue(null);
        }
      }else if( control instanceof FormGroup){
        this.trimSpaceForm(control)
      }
    })
  }
}
