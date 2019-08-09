import { FormGroup, AbstractControl } from '@angular/forms';

export function ValidEmail(control: AbstractControl) {
if (!control.value) {
// if control is empty return no error
return null;
}
if (control.errors && !control.errors.validEmail) {
return null;
}

const valid = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/igm.test(control.value);
return valid ? null : { validEmail: true };
}