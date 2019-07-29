import { FormGroup, AbstractControl } from '@angular/forms';

export function ValidPassword(control: AbstractControl) {
    if (!control.value) {
        // if control is empty return no error
        return null;
    }
    if (control.errors && !control.errors.validPassword) {
        return null;
    }

    const valid = /^[A-Za-z0-9\d=!\$#%\^&\*\(\)\-@._*]*$/.test(control.value)
                && /[A-Z]/.test(control.value)
                && /[=!\$#%\^&\*\(\)\-@._*]/.test(control.value)
                && /[a-z]/.test(control.value)
                && /\d/.test(control.value);
    return valid ? null : { validPassword: true };
  }
