import {Injectable} from '@angular/core';
import {AbstractControl} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class DataUtilsService {

  constructor() {
  }

  static markAsTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({onlySelf: true});
      }
      if (control.controls) {
        this.markAsTouched(control);
      }
    });
  }

  static isEmpty(v: any) {
    return v === '' || v === void (0) || v === null;
  }

  static cloneObject(source: any) {
    return JSON.parse(JSON.stringify(source));
  }

  static nonEspecially(): any {
    return (control: AbstractControl) => {
      if (!control || !control.value) {
        return null;
      }
      const regex = new RegExp(/^[0-9a-z_A-Z]*$/);
      const value = control.value.toString();
      if (!regex.test(value)) {
        const newValue = value.replace(/[^\w\s]/gi, '');
        control.patchValue(newValue);
      }
      return null
    };
  }

  static number(): any {
    return (control: AbstractControl) => {
      if (!control || !control.value) {
        return null;
      }
      const regex = new RegExp(/^\d+$/);
      const value = control.value.toString();
      if (!regex.test(value)) {
        const newValue = value.replace(/[^0-9]/g, '');
        control.patchValue(newValue);
      }
      return null
    };
  }
}
